import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const nextHeaders = await import("next/headers");
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const bookings = await prisma.securityTestingBooking.findMany({
      where: {
        userId: currentUser.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        testingType: true,
        scope: true,
        startDate: true,
        endDate: true,
        status: true,
        termsAccepted: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Get security testing bookings error:", error);

    return NextResponse.json(
      { error: "Failed to load security testing bookings" },
      { status: 500 }
    );
  }
}
