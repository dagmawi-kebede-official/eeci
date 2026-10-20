import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserFromRequest } from "@/lib/auth";

const domains = {
  governance: {
    name: "Governance & Security Management",
    questions: [4, 5],
    maximumScore: 8,
  },

  risk: {
    name: "Risk & Asset Management",
    questions: [6, 7],
    maximumScore: 10,
  },

  identity: {
    name: "Identity & Access Management",
    questions: [8, 9],
    maximumScore: 9,
  },

  dataProtection: {
    name: "Data Protection & Privacy",
    questions: [10, 11],
    maximumScore: 9,
  },

  network: {
    name: "Network & Endpoint Security",
    questions: [12, 13],
    maximumScore: 12,
  },

  vulnerability: {
    name: "Vulnerability, Configuration & Application Security",
    questions: [14, 15],
    maximumScore: 10,
  },

  monitoring: {
    name: "Security Monitoring & Threat Detection",
    questions: [16, 17],
    maximumScore: 10,
  },

  incidentResponse: {
    name: "Incident Response",
    questions: [18, 19],
    maximumScore: 12,
  },

  resilience: {
    name: "Business Continuity & Disaster Recovery",
    questions: [20, 21],
    maximumScore: 8,
  },

  supplyChain: {
    name: "Third-Party & Supply Chain Security",
    questions: [22, 23],
    maximumScore: 6,
  },

  people: {
    name: "People, Awareness & Security Culture",
    questions: [24, 25],
    maximumScore: 6,
  },
};

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUserFromRequest(request);

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user's assessments, newest first
    const assessments =
      await prisma.complianceAssessment.findMany({
        where: {
          userId: currentUser.userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          organizationSector: true,
          organizationType: true,
          criticalInfrastructureStatus: true,
          totalScore: true,
          createdAt: true,
          updatedAt: true,

          answers: {
            select: {
              questionId: true,
              answerValue: true,
              awardedPoints: true,
            },
          },
        },
      });

    /*
     * Calculate domain scores for every assessment.
     */
    const assessmentsWithDomains = assessments.map(
      (assessment) => {
        const domainScores = Object.entries(
          domains
        ).map(([key, domain]) => {
          const domainAnswers =
            assessment.answers.filter(
              (answer) =>
                domain.questions.includes(
                  answer.questionId
                )
            );

          const earnedPoints =
            domainAnswers.reduce(
              (total, answer) =>
                total + answer.awardedPoints,
              0
            );

          const percentage =
            domain.maximumScore === 0
              ? 0
              : (earnedPoints /
                  domain.maximumScore) *
                100;

          return {
            key,
            name: domain.name,
            earnedPoints: Math.round(
              earnedPoints * 100
            ) / 100,
            maximumScore:
              domain.maximumScore,
            percentage: Math.round(
              percentage * 100
            ) / 100,
          };
        });

        return {
          id: assessment.id,
          organizationSector:
            assessment.organizationSector,
          organizationType:
            assessment.organizationType,
          criticalInfrastructureStatus:
            assessment.criticalInfrastructureStatus,
          totalScore: assessment.totalScore,
          createdAt: assessment.createdAt,
          updatedAt: assessment.updatedAt,
          domainScores,
        };
      }
    );

    return NextResponse.json({
      assessments: assessmentsWithDomains,
    });
  } catch (error) {
    console.error(
      "Get compliance assessments error:",
      error
    );

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
