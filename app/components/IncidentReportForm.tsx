"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createReport,
  updateReport,
  deleteReportEvidenceFile,
} from "@/actions/reports";
import { uploadEvidenceFile } from "@/lib/supabase/upload-helper";

type Severity = "Low" | "Medium" | "High" | "Critical";

type EvidenceFile = {
  name: string;
  size: number;
  type: string;
  path?: string;
};

export interface IncidentReportData {

  id: number;

  name: string;

  description: string;

  content: string;

  isPublic: boolean;

  incidentType: string | null;

  severity: string | null;

  reportedAt: string | null;

  affectedSystem: string | null;

  affectedDepartment: string | null;

  affectedUsers: number | null;

  reporter: string | null;

  evidenceFiles: EvidenceFile[] | null;

}

interface Props {

  mode: "create" | "edit";

  reportId?: number;

  initialData?: IncidentReportData;

}

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

const severityOptions: {

  value: Severity;

  description: string;

}[] = [

  {

    value: "Low",

    description: "Minimal business impact; easily contained with existing tooling.",

  },

  {

    value: "Medium",

    description: "Limited impact or scope; contained quickly with IR team effort.",

  },

  {

    value: "High",

    description: "Significant impact, multiple systems, or sensitive data at risk.",

  },

  {

    value: "Critical",

    description: "Severe impact: production down, confirmed data exfiltration, or executive escalation.",

  },

];

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const ALLOWED_FILE_EXTENSIONS = new Set([
  ".pdf", ".png", ".jpg", ".jpeg", ".webp", ".txt", ".log",
  ".csv", ".json", ".xml", ".zip", ".doc", ".docx", ".pcap", ".pcapng",
]);

function toLocalDateTimeInput(value?: string | null) {

  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const pad = (n: number) => String(n).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(

    date.getDate()

  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;

}

function formatSize(bytes: number) {

  if (bytes < 1024) return `${bytes} B`;

  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;

  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;

}

const inputClass =
  "w-full min-h-12 rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-sm leading-6 text-white placeholder:text-white/35 shadow-inner shadow-black/20 outline-none transition duration-200 hover:border-white/25 hover:bg-white/[0.035] focus:border-white/60 focus:bg-white/[0.045] focus:ring-4 focus:ring-white/10";

const labelClass =
  "mb-2 block text-sm font-medium tracking-[0.01em] text-white/80";

export default function IncidentReportForm({

  mode,

  reportId,

  initialData,

}: Props) {

  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(initialData?.name ?? "");

  const [type, setType] = useState(initialData?.incidentType ?? "");

  const [severity, setSeverity] = useState<Severity | "">(

    (initialData?.severity as Severity | null) ?? ""

  );

  const [reportedAt, setReportedAt] = useState(

    toLocalDateTimeInput(initialData?.reportedAt)

  );

  const [affectedSystem, setAffectedSystem] = useState(

    initialData?.affectedSystem ?? ""

  );

  const [department, setDepartment] = useState(

    initialData?.affectedDepartment ?? ""

  );

  const [affectedUsers, setAffectedUsers] = useState(

    initialData?.affectedUsers ?? 0

  );

  const [description, setDescription] = useState(

    initialData?.description ?? ""

  );

  const [reporter, setReporter] = useState(

    initialData?.reporter ?? ""

  );

  const [files, setFiles] = useState<EvidenceFile[]>(

    initialData?.evidenceFiles ?? []

  );

  // Existing evidence metadata is separate from newly selected browser File objects.
  const [newFiles, setNewFiles] = useState<File[]>([]);

  // Prevent duplicate incident creation if upload fails after the report is saved.
  const [createdReportId, setCreatedReportId] = useState<number | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [error, setError] = useState("");
  const [fileError, setFileError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingEvidencePath, setDeletingEvidencePath] = useState<string | null>(null);

  function addFiles(selected: FileList | File[]) {
    setError("");
    const picked = Array.from(selected);
    const oversized = picked.filter((file) => file.size > MAX_FILE_SIZE);
    const unsupported = picked.filter((file) => {
      const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
      return !ALLOWED_FILE_EXTENSIONS.has(extension);
    });
    const accepted = picked.filter((file) => {
      const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
      return file.size > 0 && file.size <= MAX_FILE_SIZE && ALLOWED_FILE_EXTENSIONS.has(extension);
    });

    if (oversized.length > 0 || unsupported.length > 0) {
      const messages: string[] = [];
      if (oversized.length > 0) messages.push("Each file must be 50 MB or smaller.");
      if (unsupported.length > 0) messages.push("One or more file types are not supported.");
      setFileError(messages.join(" "));
    } else {
      setFileError("");
    }

    setNewFiles((previous) => {
      const additions = accepted.filter(
        (file) =>
          !previous.some(
            (existing) =>
              existing.name === file.name &&
              existing.size === file.size &&
              existing.lastModified === file.lastModified
          )
      );
      return [...previous, ...additions];
    });
  }

  function removePendingFile(index: number) {
    setNewFiles((previous) => previous.filter((_, i) => i !== index));
  }

  function removeMetadataOnlyFile(index: number) {
    setFiles((previous) => previous.filter((_, i) => i !== index));
  }

  async function removeStoredFile(index: number) {
    const file = files[index];
    if (!file) return;

    // Older records only stored metadata; they do not have an object to delete.
    if (!file.path) {
      removeMetadataOnlyFile(index);
      return;
    }

    const activeReportId = mode === "edit" ? reportId : createdReportId;
    if (!activeReportId) {
      setError("Save the incident report before removing stored evidence.");
      return;
    }

    if (!window.confirm(`Permanently delete "${file.name}" from evidence storage?`)) {
      return;
    }

    setError("");
    setDeletingEvidencePath(file.path);

    try {
      const result = await deleteReportEvidenceFile(activeReportId, file.path);
      if (!result.success) {
        setError(result.error ?? `Could not remove ${file.name}.`);
        return;
      }

      setFiles((previous) => previous.filter((item) => item.path !== file.path));
    } catch (removeError) {
      console.error("Evidence file removal failed:", removeError);
      setError(`Could not remove ${file.name}. Please try again.`);
    } finally {
      setDeletingEvidencePath(null);
    }
  }

  function validate() {

    const nextErrors: Record<string, string> = {};

    if (!title.trim()) nextErrors.title = "Incident title is required";

    if (!type) nextErrors.type = "Incident type is required";

    if (!severity) nextErrors.severity = "Severity is required";

    if (!reportedAt) nextErrors.reportedAt = "Date and time are required";

    if (description.trim().length < 10) {
      nextErrors.description = "Provide an incident description of at least 10 characters.";
    }

    if (

      !Number.isInteger(Number(affectedUsers)) ||

      Number(affectedUsers) < 0

    ) {

      nextErrors.affectedUsers =

        "Affected users must be a non-negative whole number";

    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;

  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (fileError) {
      setError(fileError);
      return;
    }

    if (!validate()) {
      setError("Please complete the required fields.");
      return;
    }

    if (mode === "edit" && !reportId) {
      setError("The incident report ID is missing.");
      return;
    }

    const reportedDate = new Date(reportedAt);
    if (Number.isNaN(reportedDate.getTime())) {
      setError("Please enter a valid incident date and time.");
      return;
    }

    const content = [
      `# ${title.trim()}`,
      `Incident type: ${type}`,
      `Severity: ${severity}`,
      `Reported at: ${reportedDate.toISOString()}`,
      `Affected system: ${affectedSystem.trim() || "Not specified"}`,
      `Department: ${department || "Not specified"}`,
      `Affected users: ${Number(affectedUsers)}`,
      `Reporter: ${reporter.trim() || "Not specified"}`,
      "",
      "## Incident Description",
      description.trim(),
    ].join("\n\n");

    setIsSubmitting(true);

    try {
      const data = {
        name: title.trim(),
        description: description.trim(),
        content,
        isPublic: initialData?.isPublic ?? false,
        incidentType: type,
        severity,
        reportedAt: reportedDate.toISOString(),
        affectedSystem: affectedSystem.trim(),
        affectedDepartment: department || "IT",
        affectedUsers: Number(affectedUsers),
        reporter: reporter.trim(),
        evidenceFiles: files,
      };

      // Save the report first because Supabase evidence paths include its ID.
      let activeReportId: number | null =
        mode === "edit" ? reportId! : createdReportId;

      if (activeReportId === null) {
        const result = await createReport(data);

        if (!result.success) {
          setError(result.error ?? "Unable to create the incident report.");
          return;
        }

        // createReport must return the newly created database ID for evidence uploads.
        const created = result as typeof result & {
          reportId?: number;
          id?: number;
          report?: { id?: number };
        };
        activeReportId = created.reportId ?? created.report?.id ?? created.id ?? null;

        if (!activeReportId || !Number.isSafeInteger(activeReportId)) {
          setError(
            "The incident report was saved, but createReport did not return its ID. Update app/actions/reports.ts to return { success: true, reportId: report.id } before uploading evidence."
          );
          return;
        }

        setCreatedReportId(activeReportId);
      } else {
        const result = await updateReport(activeReportId, data);
        if (!result.success) {
          setError(result.error ?? "Unable to save the incident report.");
          return;
        }
      }

      // Upload each newly selected File directly to Supabase using a signed token.
      const uploadedFiles: EvidenceFile[] = [];
      const failedFiles: File[] = [];

      for (const file of newFiles) {
        try {
          uploadedFiles.push(await uploadEvidenceFile(activeReportId, file));
        } catch (uploadError) {
          console.error(`Evidence upload failed for ${file.name}:`, uploadError);
          failedFiles.push(file);
        }
      }

      const nextEvidenceFiles = [...files, ...uploadedFiles];

      if (uploadedFiles.length > 0) {
        // Keep successful uploads in state even if the metadata write needs retrying.
        setFiles(nextEvidenceFiles);
        setNewFiles(failedFiles);

        const evidenceResult = await updateReport(activeReportId, {
          ...data,
          evidenceFiles: nextEvidenceFiles,
        });

        if (!evidenceResult.success) {
          setError(
            "The files uploaded, but EECI could not save their references. Submit again to retry saving the evidence details."
          );
          return;
        }
      } else if (failedFiles.length > 0) {
        setNewFiles(failedFiles);
      }

      if (failedFiles.length > 0) {
        setError(
          `The incident report was saved, but ${failedFiles.length} evidence file(s) failed to upload. The remaining files are still selected; submit again to retry.`
        );
        return;
      }

      router.replace("/dashboard#incident-reports");
      router.refresh();
    } catch (submissionError) {
      console.error("Incident report submission error:", submissionError);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (

    <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">

      <div className="mb-7">

        <Link

          href="/dashboard#incident-reports"

          className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/12 bg-white/2.5 px-6 py-3 text-sm font-medium text-white/75 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"

        >

          ← Back to Dashboard

        </Link>

      </div>

      <header className="relative mb-9 overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-white/[0.07] via-white/[0.035] to-transparent px-6 py-7 shadow-2xl shadow-black/10 sm:px-8 sm:py-9">

        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.24em] text-white/65">

          Security Incidents

        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">

          {mode === "create" ? "Report an Incident" : "Edit Incident Report"}

        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">

          {mode === "create"

            ? "Submit a new security incident for review and investigation."

            : "Update the incident details and evidence information."}

        </p>

      </header>

      <form onSubmit={handleSubmit}>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(280px,3fr)] lg:gap-7">

          <div className="min-w-0 space-y-6 lg:col-span-1">

            {/* Incident information */}

            <section className="overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-white/5.5 to-white/2 p-5 shadow-xl shadow-black/10 sm:rounded-3xl sm:p-7">

              <h2 className="border-b border-white/10 pb-4 text-base font-semibold tracking-tight text-white sm:text-lg">

                Incident Information

              </h2>

              <div className="mt-6 space-y-6">

                <div>

                  <label htmlFor="incident-title" className={labelClass}>

                    Incident Title <span className="text-white/75">*</span>

                  </label>

                  <input

                    id="incident-title"

                    className={inputClass}

                    placeholder="e.g. Ransomware on Finance Server"

                    value={title}

                    onChange={(e) => setTitle(e.target.value)}

                    maxLength={100}

                    required

                  />

                  {errors.title && (

                    <p className="mt-1 text-xs text-white/75">{errors.title}</p>

                  )}

                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  <div>

                    <label htmlFor="incident-type" className={labelClass}>

                      Incident Type <span className="text-white/75">*</span>

                    </label>

                    <select

                      id="incident-type"

                      className={inputClass}

                      value={type}

                      onChange={(e) => setType(e.target.value)}

                      required

                    >

                      <option value="" disabled hidden>

                        Select type

                      </option>

                      {incidentTypes.map((item) => (

                        <option key={item} value={item}>

                          {item}

                        </option>

                      ))}

                    </select>

                    {errors.type && (

                      <p className="mt-1 text-xs text-white/75">{errors.type}</p>

                    )}

                  </div>

                  <div>

                    <label htmlFor="reported-at" className={labelClass}>

                      Date and Time <span className="text-white/75">*</span>

                    </label>

                    <input

                      id="reported-at"

                      type="datetime-local"

                      className={inputClass}

                      value={reportedAt}

                      onChange={(e) => setReportedAt(e.target.value)}

                      required

                    />

                    {errors.reportedAt && (

                      <p className="mt-1 text-xs text-white/75">

                        {errors.reportedAt}

                      </p>

                    )}

                  </div>

                </div>

                <fieldset>

                  <legend className={labelClass}>

                    Severity <span className="text-white/75">*</span>

                  </legend>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                    {severityOptions.map((item) => {

                      const selected = severity === item.value;

                      return (

                        <button

                          key={item.value}

                          type="button"

                          aria-pressed={selected}

                          onClick={() => setSeverity(item.value)}

                          className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30 ${
                            item.value === "Low"
                              ? selected ? "border-emerald-400/70 bg-emerald-400/10 shadow-lg shadow-emerald-950/20 ring-1 ring-emerald-400/25" : "border-emerald-400/20 bg-black/30 hover:border-emerald-400/50 hover:bg-emerald-400/[0.07]"
                              : item.value === "Medium"
                              ? selected ? "border-amber-400/70 bg-amber-400/10 shadow-lg shadow-amber-950/20 ring-1 ring-amber-400/25" : "border-amber-400/20 bg-black/30 hover:border-amber-400/50 hover:bg-amber-400/[0.07]"
                              : item.value === "High"
                              ? selected ? "border-orange-400/75 bg-orange-500/10 shadow-lg shadow-orange-950/20 ring-1 ring-orange-400/30" : "border-orange-400/20 bg-black/30 hover:border-orange-400/55 hover:bg-orange-500/[0.07]"
                              : selected ? "border-rose-400/80 bg-rose-500/12 shadow-lg shadow-rose-950/25 ring-1 ring-rose-400/30" : "border-rose-400/25 bg-black/30 hover:border-rose-400/60 hover:bg-rose-500/8"
                          }`}

                        >
                          <span className="mb-3 flex items-center justify-between gap-2">
                            <span className={`text-base font-semibold tracking-tight ${item.value === "Low" ? "text-emerald-300" : item.value === "Medium" ? "text-amber-300" : item.value === "High" ? "text-orange-300" : "text-rose-300"}`}>
                              {item.value}
                            </span>
                            <span className={`h-2.5 w-2.5 rounded-full ring-4 ${item.value === "Low" ? "bg-emerald-400 ring-emerald-400/10" : item.value === "Medium" ? "bg-amber-400 ring-amber-400/10" : item.value === "High" ? "bg-orange-400 ring-orange-400/10" : "bg-rose-400 ring-rose-400/10"}`} aria-hidden="true" />
                          </span>
                          <span className="block text-xs leading-5 text-white/60">
                            {item.description}
                          </span>
                          {selected && <span className={`mt-3 inline-flex items-center rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-wider ${item.value === "Low" ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200" : item.value === "Medium" ? "border-amber-400/30 bg-amber-400/10 text-amber-200" : item.value === "High" ? "border-orange-400/30 bg-orange-400/10 text-orange-200" : "border-rose-400/30 bg-rose-400/10 text-rose-200"}`}>Selected</span>}
                        </button>

                      );

                    })}

                  </div>

                  {errors.severity && (

                    <p className="mt-1 text-xs text-white/75">

                      {errors.severity}

                    </p>

                  )}

                </fieldset>

                <div className="grid gap-5 sm:grid-cols-2">

                  <div>

                    <label htmlFor="affected-system" className={labelClass}>

                      Affected System / Asset

                    </label>

                    <input

                      id="affected-system"

                      className={inputClass}

                      placeholder="e.g. Web Server PROD-01"

                      value={affectedSystem}

                      onChange={(e) => setAffectedSystem(e.target.value)}

                      maxLength={255}

                    />

                  </div>

                  <div>

                    <label htmlFor="department" className={labelClass}>

                      Affected Department

                    </label>

                    <select

                      id="department"

                      className={inputClass}

                      value={department}

                      onChange={(e) => setDepartment(e.target.value)}

                    >

                      <option value="" disabled hidden>

                        Select department

                      </option>

                      {departments.map((item) => (

                        <option key={item} value={item}>

                          {item}

                        </option>

                      ))}

                    </select>

                  </div>

                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  <div>

                    <label htmlFor="affected-users" className={labelClass}>

                      Affected Users

                    </label>

                    <input

                      id="affected-users"

                      type="number"

                      min={0}

                      step={1}

                      className={inputClass}

                      value={affectedUsers}

                      onChange={(e) =>

                        setAffectedUsers(Number(e.target.value))

                      }

                    />

                    {errors.affectedUsers && (

                      <p className="mt-1 text-xs text-white/75">

                        {errors.affectedUsers}

                      </p>

                    )}

                  </div>

                  <div>

                    <label htmlFor="reporter" className={labelClass}>

                      Reporter

                    </label>

                    <input

                      id="reporter"

                      className={inputClass}

                      placeholder="Your name"

                      value={reporter}

                      onChange={(e) => setReporter(e.target.value)}

                      maxLength={100}

                    />

                  </div>

                </div>

                <div>

                  <label htmlFor="incident-description" className={labelClass}>

                    Incident Description{" "}

                    <span className="text-white/75">*</span>

                  </label>

                  <textarea

                    id="incident-description"

                    rows={6}

                    className={inputClass}

                    placeholder="Describe what happened, when it was detected, indicators observed, and any initial actions taken."

                    value={description}

                    onChange={(e) => setDescription(e.target.value)}

                    required

                  />

                  {errors.description && (

                    <p className="mt-1 text-xs text-white/75">

                      {errors.description}

                    </p>

                  )}

                </div>

              </div>

            </section>

            {/* Evidence selection */}

            <section className="overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-white/5.5 to-white/2 p-5 shadow-xl shadow-black/10 sm:rounded-3xl sm:p-7">

              <h2 className="border-b border-white/10 pb-4 text-base font-semibold tracking-tight text-white sm:text-lg">

                Evidence Upload

              </h2>

              <div

                role="button"

                tabIndex={0}

                onClick={() => fileInputRef.current?.click()}

                onKeyDown={(e) => {

                  if (e.key === "Enter" || e.key === " ") {

                    e.preventDefault();

                    fileInputRef.current?.click();

                  }

                }}

                onDragOver={(e) => e.preventDefault()}

                onDrop={(e) => {

                  e.preventDefault();

                  addFiles(e.dataTransfer.files);

                }}

                className="mt-5 cursor-pointer rounded-2xl border border-dashed border-white/20 bg-white/2.5 p-7 text-center transition duration-200 hover:border-white/45 hover:bg-white/5.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 sm:p-9"

              >

                <div className="mb-4 flex justify-center text-white/70">

                  <svg

                    xmlns="http://www.w3.org/2000/svg"

                    viewBox="0 0 24 24"

                    fill="none"

                    stroke="currentColor"

                    strokeWidth="1.5"

                    strokeLinecap="round"

                    strokeLinejoin="round"

                    className="h-9 w-9"

                    aria-hidden="true"

                  >

                    <path d="M12 16V4" />

                    <path d="m7 9 5-5 5 5" />

                    <path d="M20 16.5v2A2.5 2.5 0 0 1 17.5 21h-11A2.5 2.5 0 0 1 4 18.5v-2" />

                  </svg>

                </div>

                <p className="text-sm font-medium text-white/85">

                  Drag and drop evidence here or{" "}

                  <span className="font-semibold underline">

                    browse files on your device

                  </span>

                </p>

                <p className="mt-2 text-xs leading-5 text-white/45">

                  Accepted: logs, screenshots, documents, network captures. Max 50MB per file.

                </p>

                <input

                  ref={fileInputRef}

                  type="file"

                  multiple

                  accept=".log,.txt,.csv,.json,.xml,.pcap,.pcapng,.png,.jpg,.jpeg,.webp,.pdf,.doc,.docx,.zip"

                  className="hidden"

                  onChange={(e) => {

                    if (e.target.files) addFiles(e.target.files);

                    e.currentTarget.value = "";

                  }}

                />

              </div>

              <p className="mt-4 text-xs leading-6 text-white/45">
                Files are uploaded to EECI's private Supabase evidence storage when you submit the report.
                Each file must be 50 MB or smaller. Do not upload unrelated secrets or personal data.
              </p>

              {(files.length > 0 || newFiles.length > 0) && (
                <div className="mt-5 space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={`${file.path ?? "metadata"}-${file.name}-${index}`}
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/10 p-3.5"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="h-5 w-5 shrink-0 text-white/50"
                        aria-hidden="true"
                      >
                        <path d="M6 3h9l4 4v14H6z" />
                        <path d="M14 3v5h5" />
                      </svg>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm">{file.name}</p>
                        <p className="text-xs text-white/45">
                          {file.type} · {formatSize(file.size)}
                        </p>
                        <p className="mt-1.5 text-[11px] text-white/65">
                          {file.path ? "Stored in private evidence storage" : "Older metadata only — file contents are not stored"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => void removeStoredFile(index)}
                        disabled={deletingEvidencePath === file.path || isSubmitting}
                        className="rounded-lg px-3 py-2 text-xs font-medium text-white/50 transition hover:bg-white/6 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label={`Remove ${file.name}`}
                      >
                        {deletingEvidencePath === file.path ? "Deleting..." : "Remove"}
                      </button>
                    </div>
                  ))}

                  {newFiles.map((file, index) => (
                    <div
                      key={`${file.name}-${file.size}-${file.lastModified}`}
                      className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/4.5 p-3.5"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="h-5 w-5 shrink-0 text-white"
                        aria-hidden="true"
                      >
                        <path d="M6 3h9l4 4v14H6z" />
                        <path d="M14 3v5h5" />
                      </svg>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm">{file.name}</p>
                        <p className="text-xs text-white/45">
                          {file.type || "application/octet-stream"} · {formatSize(file.size)}
                        </p>
                        <p className="mt-1.5 text-[11px] text-white/85">Ready to upload</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removePendingFile(index)}
                        className="rounded-lg px-3 py-2 text-xs font-medium text-white/55 transition hover:bg-white/6 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                        aria-label={`Remove ${file.name}`}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

            </section>

            {(error || fileError) && (

              <div

                role="alert"

                className="rounded-xl border border-white/20 bg-white/6 p-4 text-sm leading-6 text-white/90 shadow-lg shadow-black/20"

              >

                {error || fileError}

              </div>

            )}

            <div className="flex flex-col-reverse justify-end gap-3 border-t border-white/10 pt-5 sm:flex-row">

              <Link

                href="/dashboard#incident-reports"

                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/12 bg-white/2.5 px-6 py-3 text-sm font-medium text-white/75 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"

              >

                Cancel

              </Link>

              <button

                type="submit"

                disabled={isSubmitting}

                className="cursor-pointer inline-flex min-h-11 items-center justify-center rounded-full bg-linear-to-r from-white to-white/85 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-black/30 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"

              >

                {isSubmitting

                  ? "Saving..."

                  : mode === "create" && !createdReportId
                    ? "Submit Incident →"
                    : "Save Changes →"}

              </button>

            </div>

          </div>

          {/* Guidance panel */}

          <aside className="space-y-5 lg:sticky lg:top-6">

            <section className="group relative overflow-hidden rounded-2xl border border-white/12 bg-linear-to-br from-white/7.5 via-white/[0.035] to-transparent p-5 shadow-xl shadow-black/20 transition duration-300 hover:border-white/20 sm:rounded-3xl sm:p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/6 text-white/80" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3 4.5 6v5.2c0 4.5 3.2 7.8 7.5 9.8 4.3-2 7.5-5.3 7.5-9.8V6L12 3Z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <h2 className="text-base font-semibold tracking-tight text-white">Reporting Tips</h2>
              <ul className="mt-4 space-y-2.5 text-sm leading-6 text-white/65">
                <li className="flex gap-3 rounded-xl border border-white/[0.07] bg-black/15 p-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/70" aria-hidden="true" /><span>Provide as much detail as possible in the description.</span></li>
                <li className="flex gap-3 rounded-xl border border-white/[0.07] bg-black/15 p-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/70" aria-hidden="true" /><span>Attach relevant logs or screenshots, they accelerate triage.</span></li>
                <li className="flex gap-3 rounded-xl border border-white/[0.07] bg-black/15 p-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/70" aria-hidden="true" /><span>Set severity based on business impact, not just technical impact.</span></li>
                <li className="flex gap-3 rounded-xl border border-white/[0.07] bg-black/15 p-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/70" aria-hidden="true" /><span>Include affected user count for impact assessment.</span></li>
                <li className="flex gap-3 rounded-xl border border-white/[0.07] bg-black/15 p-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/70" aria-hidden="true" /><span>Set the detection time, not the time of this report, when known.</span></li>
              </ul>
            </section>

            <section className="group relative overflow-hidden rounded-2xl border border-white/12 bg-linear-to-br from-white/7.5 via-white/[0.035] to-transparent p-5 shadow-xl shadow-black/20 transition duration-300 hover:border-white/20 sm:rounded-3xl sm:p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/6 text-white/80" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v18M3 12h18" />
                  <circle cx="12" cy="12" r="9" />
                </svg>
              </div>
              <h2 className="text-base font-semibold tracking-tight text-white">Severity Guidelines</h2>
              <div className="mt-5 space-y-2.5">
                {severityOptions.map((item) => (
                  <div key={item.value} className={`relative overflow-hidden rounded-xl border bg-black/20 p-3.5 transition duration-200 hover:-translate-y-px ${item.value === "Low" ? "border-emerald-400/20 hover:border-emerald-400/45 hover:bg-emerald-400/4.5" : item.value === "Medium" ? "border-amber-400/20 hover:border-amber-400/45 hover:bg-amber-400/4.5" : item.value === "High" ? "border-orange-400/20 hover:border-orange-400/45 hover:bg-orange-500/4.5" : "border-rose-400/25 hover:border-rose-400/50 hover:bg-rose-500/5"}`}>
                    <span className={`absolute inset-y-0 left-0 w-1 ${item.value === "Low" ? "bg-emerald-400" : item.value === "Medium" ? "bg-amber-400" : item.value === "High" ? "bg-orange-400" : "bg-rose-400"}`} aria-hidden="true" />
                    <div className="flex items-center gap-2.5 pl-1.5">
                      <span className={`h-2.5 w-2.5 rounded-full ring-4 ${item.value === "Low" ? "bg-emerald-400 ring-emerald-400/10" : item.value === "Medium" ? "bg-amber-400 ring-amber-400/10" : item.value === "High" ? "bg-orange-400 ring-orange-400/10" : "bg-rose-400 ring-rose-400/10"}`} aria-hidden="true" />
                      <p className={`text-sm font-semibold ${item.value === "Low" ? "text-emerald-300" : item.value === "Medium" ? "text-amber-300" : item.value === "High" ? "text-orange-300" : "text-rose-300"}`}>{item.value}</p>
                    </div>
                    <p className="mt-2 pl-6.25 text-xs leading-5 text-white/65">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

          </aside>

        </div>

      </form>

    </div>

  );

}
