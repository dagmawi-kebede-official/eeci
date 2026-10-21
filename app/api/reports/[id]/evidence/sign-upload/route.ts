import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { basename, extname } from "node:path";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase/admin";

const BUCKET = "incident-evidence";
const MAX_FILE_SIZE = 50 * 1024 * 1024;

const ALLOWED_EXTENSIONS = new Set([
  ".pdf",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".txt",
  ".log",
  ".csv",
  ".json",
  ".xml",
  ".zip",
  ".doc",
  ".docx",
  ".pcap",
  ".pcapng",
]);

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const reportId = Number(id);

    if (!Number.isSafeInteger(reportId) || reportId <= 0) {
      return NextResponse.json(
        { error: "Invalid report ID." },
        { status: 400 }
      );
    }

    const report = await prisma.report.findFirst({
      where: {
        id: reportId,
        authorId: user.userId,
      },
      select: { id: true },
    });

    if (!report) {
      return NextResponse.json(
        { error: "Report not found." },
        { status: 404 }
      );
    }

    const body = await request.json();

    const fileName = basename(
      typeof body.fileName === "string" ? body.fileName : ""
    );
    const fileSize = Number(body.fileSize);
    const extension = extname(fileName).toLowerCase();

    if (
      !fileName ||
      !ALLOWED_EXTENSIONS.has(extension) ||
      !Number.isFinite(fileSize) ||
      fileSize <= 0 ||
      fileSize > MAX_FILE_SIZE
    ) {
      return NextResponse.json(
        { error: "Unsupported file or invalid file size." },
        { status: 400 }
      );
    }

    const safeName = fileName
      .normalize("NFKD")
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .replace(/^\.+/, "")
      .slice(-100);

    const path =
      `user-${user.userId}/report-${report.id}/` +
      `${randomUUID()}-${safeName || "evidence"}`;

    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET)
      .createSignedUploadUrl(path);

    if (error) {
      console.error("Supabase signing error:", error.message);

      return NextResponse.json(
        { error: "Could not prepare the file upload." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      path,
      token: data.token,
    });
  } catch (error) {
    console.error("Evidence upload setup failed:", error);

    return NextResponse.json(
      { error: "Could not prepare the file upload." },
      { status: 500 }
    );
  }
}
