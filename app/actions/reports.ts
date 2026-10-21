"use server";

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";

interface EvidenceFile {
  name: string;
  size: number;
  type: string;
  path?: string;
}

interface ReportFormData {
  name: string;
  description: string;
  content: string;
  isPublic: boolean;
  incidentType: string;
  severity: string;
  reportedAt: string;
  affectedSystem: string;
  affectedDepartment: string;
  affectedUsers: number;
  reporter: string;
  evidenceFiles: EvidenceFile[];
}

interface ActionResult {
  success: boolean;
  error?: string;
  reportId?: number;
}

const MAX_EVIDENCE_FILE_SIZE = 50 * 1024 * 1024;

const incidentTypes = [
  "Malware",
  "Ransomware",
  "Phishing",
  "Unauthorized Access",
  "Account Compromise",
  "Data Breach",
  "Denial of Service",
  "Web Application Attack",
  "Insider Threat",
  "Credential Theft",
  "Suspicious Network Activity",
  "Other",
];

const severities = ["Low", "Medium", "High", "Critical"];

const departments = [
  "Finance",
  "HR",
  "IT",
  "Operations",
  "Customer Service",
  "Legal",
  "Executive",
  "Other",
];

function validateIncident(data: ReportFormData): string | null {
  if (!data || typeof data.name !== "string" || !data.name.trim()) {
    return "Incident title is required";
  }

  if (!incidentTypes.includes(data.incidentType)) {
    return "Invalid incident type";
  }

  if (!severities.includes(data.severity)) {
    return "Invalid incident severity";
  }

  if (!data.reportedAt || Number.isNaN(Date.parse(data.reportedAt))) {
    return "A valid incident date and time are required";
  }

  if (!departments.includes(data.affectedDepartment)) {
    return "Invalid affected department";
  }

  if (
    typeof data.description !== "string" ||
    data.description.trim().length < 10
  ) {
    return "Description must contain at least 10 characters";
  }

  if (
    !Number.isInteger(data.affectedUsers) ||
    data.affectedUsers < 0
  ) {
    return "Affected user count must be a non-negative integer";
  }

  if (
    !Array.isArray(data.evidenceFiles) ||
    data.evidenceFiles.some((file) => {
      if (
        !file ||
        typeof file.name !== "string" ||
        !file.name.trim() ||
        !Number.isSafeInteger(file.size) ||
        file.size < 0 ||
        file.size > MAX_EVIDENCE_FILE_SIZE ||
        typeof file.type !== "string"
      ) {
        return true;
      }

      if (file.path !== undefined) {
        if (
          typeof file.path !== "string" ||
          !file.path.trim() ||
          file.path.startsWith("/") ||
          file.path.includes("\\") ||
          file.path.split("/").some((segment) => segment === "." || segment === "..")
        ) {
          return true;
        }
      }

      return false;
    })
  ) {
    return "Invalid evidence file information";
  }

  return null;
}

/**
 * The signed-upload endpoint stores files using this key pattern:
 * user-<userId>/report-<reportId>/<unique-name>
 * Pathless entries remain supported for old records that only saved metadata.
 */
function evidencePathsBelongToReport(
  files: EvidenceFile[],
  userId: string,
  reportId: number
): boolean {
  const expectedPrefix = `user-${userId}/report-${reportId}/`;

  return files.every((file) => {
    if (file.path === undefined) return true;

    return (
      file.path.startsWith(expectedPrefix) &&
      file.path.length > expectedPrefix.length
    );
  });
}

const EVIDENCE_BUCKET = "incident-evidence";

function isOwnedEvidencePath(
  path: string,
  userId: string,
  reportId: number
): boolean {
  const prefix = `user-${userId}/report-${reportId}/`;

  return (
    path.startsWith(prefix) &&
    path.length > prefix.length &&
    !path.startsWith("/") &&
    !path.includes("\\") &&
    !path.split("/").some((segment) => !segment || segment === "." || segment === "..")
  );
}

function parseEvidenceFiles(value: Prisma.JsonValue | null): EvidenceFile[] | null {
  if (value === null) return [];
  if (!Array.isArray(value)) return null;

  const files: EvidenceFile[] = [];

  for (const item of value) {
    if (!item || typeof item !== "object" || Array.isArray(item)) return null;

    const entry = item as Prisma.JsonObject;
    if (
      typeof entry.name !== "string" ||
      typeof entry.size !== "number" ||
      typeof entry.type !== "string" ||
      (entry.path !== undefined && typeof entry.path !== "string")
    ) {
      return null;
    }

    files.push({
      name: entry.name,
      size: entry.size,
      type: entry.type,
      ...(typeof entry.path === "string" ? { path: entry.path } : {}),
    });
  }

  return files;
}

/**
 * List every object below this report's storage folder. This also removes files
 * left behind if upload succeeded but saving the evidence metadata failed.
 * Our uploader stores files directly in the report folder, but nested folders
 * are handled defensively as well.
 */
async function listStoragePathsRecursively(
  folder: string,
  depth = 0
): Promise<{ paths: string[]; error?: string }> {
  if (depth > 5) {
    return { paths: [], error: "Evidence storage contains an unexpected folder depth." };
  }

  const pageSize = 1000;
  const paths: string[] = [];
  let offset = 0;

  while (true) {
    const { data, error } = await supabaseAdmin.storage
      .from(EVIDENCE_BUCKET)
      .list(folder, {
        limit: pageSize,
        offset,
        sortBy: { column: "name", order: "asc" },
      });

    if (error) {
      console.error("Supabase evidence listing error:", error.message);
      return { paths: [], error: "Could not inspect stored evidence. The report was kept." };
    }

    const entries = data ?? [];

    for (const entry of entries) {
      if (!entry.name || entry.name === "." || entry.name === "..") {
        return { paths: [], error: "An invalid entry was found in evidence storage." };
      }

      if (entry.id === null) {
        const nested = await listStoragePathsRecursively(`${folder}/${entry.name}`, depth + 1);
        if (nested.error) return nested;
        paths.push(...nested.paths);
      } else {
        paths.push(`${folder}/${entry.name}`);
      }
    }

    if (entries.length < pageSize) break;
    offset += entries.length;
  }

  return { paths };
}

/** Remove objects in small batches and stop on the first Storage error. */
async function removeStoragePaths(paths: string[]): Promise<string | null> {
  const uniquePaths = [...new Set(paths)];

  for (let index = 0; index < uniquePaths.length; index += 100) {
    const batch = uniquePaths.slice(index, index + 100);
    const { error } = await supabaseAdmin.storage
      .from(EVIDENCE_BUCKET)
      .remove(batch);

    if (error) {
      console.error("Supabase evidence deletion error:", error.message);
      return "Could not delete all evidence files from storage. The incident record was kept; please retry.";
    }
  }

  return null;
}

function incidentFields(data: ReportFormData) {
  return {
    incidentType: data.incidentType,
    severity: data.severity,
    reportedAt: new Date(data.reportedAt),
    affectedSystem: data.affectedSystem.trim() || null,
    affectedDepartment: data.affectedDepartment,
    affectedUsers: data.affectedUsers,
    reporter: data.reporter.trim() || null,
    evidenceFiles: data.evidenceFiles as unknown as Prisma.InputJsonValue,
  };
}

export async function createReport(
  data: ReportFormData
): Promise<ActionResult> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return { success: false, error: "Unauthorized" };
    }

    const validationError = validateIncident(data);

    if (validationError) {
      return { success: false, error: validationError };
    }

    // A report is created before its evidence is uploaded, because the report ID
    // is part of each Storage path. Do not accept client-supplied paths here.
    if (data.evidenceFiles.some((file) => file.path !== undefined)) {
      return {
        success: false,
        error: "Create the incident report before attaching uploaded evidence.",
      };
    }

    const report = await prisma.report.create({
      data: {
        name: data.name.trim(),
        description: data.description.trim(),
        content: data.content,
        isPublic: false,
        authorId: currentUser.userId,
        ...incidentFields(data),
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/reports/new");

    // The form needs this ID to upload evidence into the correct report folder.
    return { success: true, reportId: report.id };
  } catch (error) {
    console.error("Create incident report error:", error);

    return {
      success: false,
      error: "Failed to create incident report",
    };
  }
}

export async function updateReport(
  id: number,
  data: ReportFormData
): Promise<ActionResult> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return { success: false, error: "Unauthorized" };
    }

    if (!Number.isSafeInteger(id) || id <= 0) {
      return { success: false, error: "Invalid incident report ID" };
    }

    const validationError = validateIncident(data);

    if (validationError) {
      return { success: false, error: validationError };
    }

    const existing = await prisma.report.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!existing || existing.authorId !== currentUser.userId) {
      return {
        success: false,
        error: "Not authorized to edit this incident report",
      };
    }

    // Prevent an authenticated user from attaching arbitrary Storage paths or
    // paths belonging to another user/report. Pathless legacy metadata is okay.
    if (!evidencePathsBelongToReport(data.evidenceFiles, currentUser.userId, id)) {
      return {
        success: false,
        error: "One or more evidence files do not belong to this incident report.",
      };
    }

    await prisma.report.update({
      where: { id },
      data: {
        name: data.name.trim(),
        description: data.description.trim(),
        content: data.content,
        isPublic: false,
        ...incidentFields(data),
      },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/reports/${id}/edit`);

    return { success: true, reportId: id };
  } catch (error) {
    console.error("Update incident report error:", error);

    return {
      success: false,
      error: "Failed to update incident report",
    };
  }
}

/**
 * Permanently deletes one evidence object and removes its reference from the
 * report. The requested path must already be attached to a report owned by the
 * authenticated user.
 */
export async function deleteReportEvidenceFile(
  id: number,
  path: string
): Promise<ActionResult> {
  let storageObjectDeleted = false;

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return { success: false, error: "Unauthorized" };

    if (
      !Number.isSafeInteger(id) ||
      id <= 0 ||
      typeof path !== "string" ||
      !isOwnedEvidencePath(path, currentUser.userId, id)
    ) {
      return { success: false, error: "Invalid evidence reference." };
    }

    const existing = await prisma.report.findUnique({
      where: { id },
      select: { authorId: true, evidenceFiles: true },
    });

    if (!existing || existing.authorId !== currentUser.userId) {
      return {
        success: false,
        error: "Not authorized to remove evidence from this incident report.",
      };
    }

    const files = parseEvidenceFiles(existing.evidenceFiles);
    if (!files) {
      return {
        success: false,
        error: "Evidence metadata is invalid. No files were deleted.",
      };
    }

    if (!files.some((file) => file.path === path)) {
      return {
        success: false,
        error: "This file is not attached to the incident report.",
      };
    }

    if (!files.every((file) => !file.path || isOwnedEvidencePath(file.path, currentUser.userId, id))) {
      return {
        success: false,
        error: "The report contains an invalid evidence path. No files were deleted.",
      };
    }

    const storageError = await removeStoragePaths([path]);
    if (storageError) return { success: false, error: storageError };
    storageObjectDeleted = true;

    try {
      const remainingFiles = files.filter((file) => file.path !== path);
      await prisma.report.update({
        where: { id },
        data: {
          evidenceFiles: remainingFiles as unknown as Prisma.InputJsonValue,
        },
      });
    } catch (databaseError) {
      console.error("Evidence metadata update failed after Storage deletion:", databaseError);
      return {
        success: false,
        error: "The file was deleted from storage, but its report reference could not be updated. Please retry removing it.",
      };
    }

    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/reports/${id}/edit`);
    return { success: true, reportId: id };
  } catch (error) {
    console.error("Delete incident evidence error:", error);
    return {
      success: false,
      error: storageObjectDeleted
        ? "The file was deleted from storage, but the operation did not finish. Please retry."
        : "Failed to delete incident evidence.",
    };
  }
}

export async function deleteReport(
  id: number
): Promise<ActionResult> {
  let storageObjectsDeleted = false;

  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return { success: false, error: "Unauthorized" };
    }

    if (!Number.isSafeInteger(id) || id <= 0) {
      return { success: false, error: "Invalid incident report ID." };
    }

    const existing = await prisma.report.findUnique({
      where: { id },
      select: { authorId: true, evidenceFiles: true },
    });

    if (!existing || existing.authorId !== currentUser.userId) {
      return {
        success: false,
        error: "Not authorized to delete this report",
      };
    }

    const files = parseEvidenceFiles(existing.evidenceFiles);
    if (!files) {
      return {
        success: false,
        error: "Evidence metadata is invalid, so the report was not deleted.",
      };
    }

    if (!files.every((file) => !file.path || isOwnedEvidencePath(file.path, currentUser.userId, id))) {
      return {
        success: false,
        error: "The report contains an invalid evidence path, so it was not deleted.",
      };
    }

    // Use the user's/report's storage folder as the source of truth too, so
    // uploaded objects are cleaned even if a prior metadata save failed.
    const folder = `user-${currentUser.userId}/report-${id}`;
    const listed = await listStoragePathsRecursively(folder);
    if (listed.error) {
      return { success: false, error: listed.error };
    }

    const metadataPaths = files.flatMap((file) => (file.path ? [file.path] : []));
    const pathsToRemove = [...new Set([...metadataPaths, ...listed.paths])];

    if (!pathsToRemove.every((path) => isOwnedEvidencePath(path, currentUser.userId, id))) {
      return {
        success: false,
        error: "An unexpected evidence path was found. The report was not deleted.",
      };
    }

    const storageError = await removeStoragePaths(pathsToRemove);
    if (storageError) return { success: false, error: storageError };
    storageObjectsDeleted = pathsToRemove.length > 0;

    // Delete the database row only after Storage confirms object deletion.
    await prisma.report.delete({ where: { id } });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Delete incident report error:", error);

    return {
      success: false,
      error: storageObjectsDeleted
        ? "Evidence files were removed, but the incident record could not be deleted. Please retry deleting the incident."
        : "Failed to delete incident report",
    };
  }
}
