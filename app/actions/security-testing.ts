"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

type TestingType =
  | "VULNERABILITY_ASSESSMENT"
  | "PENETRATION_TESTING"
  | "RED_TEAM_ENGAGEMENT";

interface SecurityTestingData {
  testingType: TestingType;
  name: string;
  scope: string;
  startDate: string;
  endDate: string;
  termsAccepted: boolean;
}

interface ActionResult {
  success: boolean;
  error?: string;
  bookingId?: number;
}

const validTestingTypes: TestingType[] = [
  "VULNERABILITY_ASSESSMENT",
  "PENETRATION_TESTING",
  "RED_TEAM_ENGAGEMENT",
];

export async function createSecurityTestingBooking(
  data: SecurityTestingData
): Promise<ActionResult> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    if (!validTestingTypes.includes(data.testingType)) {
      return {
        success: false,
        error: "Invalid security testing type",
      };
    }

    if (!data.name.trim()) {
      return {
        success: false,
        error: "Test name is required",
      };
    }

    if (!data.scope.trim()) {
      return {
        success: false,
        error: "Testing scope is required",
      };
    }

    if (!data.startDate || !data.endDate) {
      return {
        success: false,
        error: "Start and end dates are required",
      };
    }

    if (data.endDate < data.startDate) {
      return {
        success: false,
        error: "End date cannot be before start date",
      };
    }

    if (!data.termsAccepted) {
      return {
        success: false,
        error:
          "You must accept the authorization requirements before requesting a test",
      };
    }

    const booking =
      await prisma.securityTestingBooking.create({
        data: {
          userId: currentUser.userId,
          name: data.name.trim(),
          testingType: data.testingType,
          scope: data.scope.trim(),
          startDate: data.startDate,
          endDate: data.endDate,
          status: "PENDING",
          termsAccepted: data.termsAccepted,
        },
      });

    revalidatePath("/dashboard");
    revalidatePath("/security");

    return {
      success: true,
      bookingId: booking.id,
    };
  } catch (error) {
    console.error(
      "Create security testing booking error:",
      error
    );

    return {
      success: false,
      error: "Failed to create security testing booking",
    };
  }
}

export async function deleteSecurityTestingBooking(
  id: number
): Promise<ActionResult> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const existing =
      await prisma.securityTestingBooking.findUnique({
        where: { id },
        select: {
          userId: true,
          status: true,
        },
      });

    if (
      !existing ||
      existing.userId !== currentUser.userId
    ) {
      return {
        success: false,
        error: "Not authorized to delete this booking",
      };
    }

    if (existing.status !== "PENDING") {
      return {
        success: false,
        error:
          "Only pending security testing bookings can be deleted",
      };
    }

    await prisma.securityTestingBooking.delete({
      where: { id },
    });

    revalidatePath("/dashboard");
    revalidatePath("/security");

    return {
      success: true,
      bookingId: id,
    };
  } catch (error) {
    console.error(
      "Delete security testing booking error:",
      error
    );

    return {
      success: false,
      error: "Failed to delete security testing booking",
    };
  }
}
