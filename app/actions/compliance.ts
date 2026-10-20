"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type ComplianceAnswers = Record<number, number>;

interface ComplianceAssessmentData {
  organizationSector: string;
  organizationType: string;
  criticalInfrastructureStatus: string;
  answers: ComplianceAnswers;
}

interface ActionResult {
  success: boolean;
  error?: string;
  assessmentId?: number;
  totalScore?: number;
}

/*
 * Question weights
 *
 * Questions 1–3 are introductory/profile questions
 * and therefore have no score.
 *
 * Questions 4–25 total exactly 100 points.
 */
const questionWeights: Record<number, number> = {
  4: 4,
  5: 4,

  6: 5,
  7: 5,

  8: 4,
  9: 5,

  10: 4,
  11: 5,

  12: 6,
  13: 6,

  14: 5,
  15: 5,

  16: 5,
  17: 5,

  18: 6,
  19: 6,

  20: 4,
  21: 4,

  22: 3,
  23: 3,

  24: 3,
  25: 3,
};

/*
 * Each maturity level represents a percentage
 * of the question's maximum available points.
 *
 * 0 = Not Implemented
 * 1 = Planned
 * 2 = Partially Implemented
 * 3 = Implemented
 * 4 = Managed & Continuously Improved
 */
const maturityMultiplier: Record<number, number> = {
  0: 0,
  1: 0.25,
  2: 0.5,
  3: 0.75,
  4: 1,
};

export async function createComplianceAssessment(
  data: ComplianceAssessmentData,
  userId: string
): Promise<ActionResult> {
  try {
    /*
     * Basic validation
     */
    if (
      !data.organizationSector ||
      !data.organizationType ||
      !data.criticalInfrastructureStatus
    ) {
      return {
        success: false,
        error: "Organization profile information is required",
      };
    }

    /*
     * Make sure all 22 scored questions
     * have been answered.
     */
    for (let questionId = 4; questionId <= 25; questionId++) {
      const answer = data.answers[questionId];

      if (
        answer === undefined ||
        !Number.isInteger(answer) ||
        answer < 0 ||
        answer > 4
      ) {
        return {
          success: false,
          error: `Question ${questionId} has not been answered correctly`,
        };
      }
    }

    /*
     * Calculate the total score.
     */
    let totalScore = 0;

    const answerRecords: {
        questionId: number;
        answerValue: number;
        awardedPoints: number;
    }[] = [];

    for (let questionId = 4; questionId <= 25; questionId++) {
      const answerValue = data.answers[questionId];
      const weight = questionWeights[questionId];
      const multiplier = maturityMultiplier[answerValue];

      const awardedPoints = weight * multiplier;

      totalScore += awardedPoints;

      answerRecords.push({
        questionId,
        answerValue,
        awardedPoints,
      });
    }

    /*
     * Round the final score to two decimal places.
     */
    totalScore =
      Math.round(totalScore * 100) / 100;

    /*
     * Make sure the score can never exceed 100.
     */
    totalScore = Math.min(totalScore, 100);

    /*
     * Create the assessment and all answers
     * in one database transaction.
     */
    const assessment =
      await prisma.$transaction(async (tx) => {
        const createdAssessment =
          await tx.complianceAssessment.create({
            data: {
              userId,

              organizationSector:
                data.organizationSector,

              organizationType:
                data.organizationType,

              criticalInfrastructureStatus:
                data.criticalInfrastructureStatus,

              totalScore,
            },
          });

        await tx.complianceAnswer.createMany({
          data: answerRecords.map(
            (answer) => ({
              assessmentId:
                createdAssessment.id,

              questionId:
                answer.questionId,

              answerValue:
                answer.answerValue,

              awardedPoints:
                answer.awardedPoints,
            })
          ),
        });

        return createdAssessment;
      });

    /*
     * Refresh dashboard data.
     */
    revalidatePath("/dashboard");
    revalidatePath("/compliance");

    return {
      success: true,
      assessmentId: assessment.id,
      totalScore,
    };
  } catch (error) {
    console.error(
      "Create compliance assessment error:",
      error
    );

    return {
      success: false,
      error: "Failed to create compliance assessment",
    };
  }
}
