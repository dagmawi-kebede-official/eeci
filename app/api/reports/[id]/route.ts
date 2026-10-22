import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserFromRequest } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const reportId = parseInt(id);

    if (isNaN(reportId)) {
      return NextResponse.json({ error: "Invalid report ID" }, { status: 400 });
    }

    const currentUser = await getCurrentUserFromRequest(request);

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const report = await prisma.report.findUnique({
      where: { id: reportId },
      select: {
        id: true,
        name: true,
        description: true,
        content: true,
        isPublic: true,
        authorId: true,
        createdAt: true,
        updatedAt: true,
        status: true,
        assignedAnalyst: true,
        incidentType: true,
        severity: true,
        reportedAt: true,
        affectedSystem: true,
        affectedDepartment: true,
        affectedUsers: true,
        reporter: true,
        evidenceFiles: true,
      },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // Check ownership
    if (report.authorId !== currentUser.userId) {
      return NextResponse.json(
        { error: "Not authorized to edit this report" },
        { status: 403 }
      );
    }

    return NextResponse.json({ report });
  } catch (error) {
    console.error("Get report error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
