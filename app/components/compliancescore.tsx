"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { createComplianceAssessment } from "@/actions/compliance";
import Image from 'next/image';

type QuestionType = "intro" | "scored";

type Option = {
  label: string;
  value: number | string;
};

type Question = {
  id: number;
  category: string;
  question: string;
  type: QuestionType;
  weight: number;
  options?: Option[];
};

const maturityOptions: Option[] = [
  {
    label: "Not Implemented",
    value: 0,
  },
  {
    label: "Planned",
    value: 1,
  },
  {
    label: "Partially Implemented",
    value: 2,
  },
  {
    label: "Implemented",
    value: 3,
  },
  {
    label: "Managed & Continuously Improved",
    value: 4,
  },
];

const questions: Question[] = [
  // ============================================================
  // INTRODUCTORY QUESTIONS — 0 POINTS
  // ============================================================

  {
    id: 1,
    category: "Organization Profile",
    question:
      "What is your organization's primary sector?",
    type: "intro",
    weight: 0,
    options: [
      {
        label: "Digital Infrastructure & Financial Services",
        value: "ICT & Finance",
      },
      {
        label: "Governance, Public Safety & Essential Emergency Services",
        value: "Government Services",
      },
      {
        label: "Vital Life-Support Utilities",
        value: "Vital Life-Support Utilities",
      },
      {
        label: "Macroeconomic Foundations",
        value: "Macroeconomic Foundations",
      },
      {
        label: "Education",
        value: "Education",
      },
      {
        label: "Other",
        value: "Other",
      },
    ],
  },

  {
    id: 2,
    category: "Organization Profile",
    question:
      "What is the type of your organization?",
    type: "intro",
    weight: 0,
    options: [
      {
        label: "Government Institution",
        value: "Government Institution",
      },
      {
        label: "Public Enterprise",
        value: "Public Enterprise",
      },
      {
        label: "Private Sector Organization",
        value: "Private Sector Organization",
      },
      {
        label: "Non-Governmental / Non-Profit Organization",
        value: "NGO / Non-Profit",
      },
      {
        label: "Other",
        value: "Other",
      },
    ],
  },

  {
    id: 3,
    category: "Organization Profile",
    question:
      "What is your organization's Critical Infrastructure status?",
    type: "intro",
    weight: 0,
    options: [
      {
        label: "Designated Critical Infrastructure",
        value: "Designated Critical Infrastructure",
      },
      {
        label: "Not Designated as Critical Infrastructure",
        value: "Not Designated",
      },
      {
        label: "Currently Under Assessment / Designation Process",
        value: "Under Assessment",
      },
      {
        label: "Not Sure",
        value: "Not Sure",
      },
    ],
  },

  // ============================================================
  // A. GOVERNANCE & SECURITY MANAGEMENT — 8 POINTS
  // ============================================================

  {
    id: 4,
    category: "A. Governance & Security Management",
    question:
      "Does your organization have a formally approved cybersecurity governance program, including an information security/cybersecurity policy, defined security objectives, assigned roles and responsibilities, and management accountability for cybersecurity risk?",
    type: "scored",
    weight: 4,
  },

  {
    id: 5,
    category: "A. Governance & Security Management",
    question:
      "Is cybersecurity managed through a formal security management structure, such as a CISO/security officer, cybersecurity team, or qualified internal/external security function, with adequate authority, resources, competence, and documented procedures?",
    type: "scored",
    weight: 4,
  },

  // ============================================================
  // B. RISK & ASSET MANAGEMENT — 10 POINTS
  // ============================================================

  {
    id: 6,
    category: "B. Risk & Asset Management",
    question:
      "Does your organization maintain a current inventory and classification of information assets, IT/ICT systems, applications, databases, network infrastructure, endpoints, cloud resources, and other critical assets based on business criticality, sensitivity, and security risk?",
    type: "scored",
    weight: 5,
  },

  {
    id: 7,
    category: "B. Risk & Asset Management",
    question:
      "Does your organization conduct documented cybersecurity risk assessments and business impact analyses (BIA), identify threats and vulnerabilities affecting confidentiality, integrity, and availability (CIA), and maintain a risk register with assigned owners and treatment plans?",
    type: "scored",
    weight: 5,
  },

  // ============================================================
  // C. IDENTITY & ACCESS MANAGEMENT — 9 POINTS
  // ============================================================

  {
    id: 8,
    category: "C. Identity & Access Management",
    question:
      "Does your organization enforce identity and access management (IAM) using least privilege, role-based access control (RBAC), strong authentication, multi-factor authentication (MFA), and formal joiner-mover-leaver processes for user and privileged accounts?",
    type: "scored",
    weight: 4,
  },

  {
    id: 9,
    category: "C. Identity & Access Management",
    question:
      "Are privileged accounts, administrative access, remote access, and access to critical systems controlled through privileged access management (PAM), periodic access reviews, segregation of duties, and secure account provisioning/deprovisioning?",
    type: "scored",
    weight: 5,
  },

  // ============================================================
  // D. DATA PROTECTION & PRIVACY — 9 POINTS
  // ============================================================

  {
    id: 10,
    category: "D. Data Protection & Privacy",
    question:
      "Does your organization identify, classify, and protect sensitive, confidential, and personal data using appropriate data security controls such as encryption at rest and in transit, access controls, data-loss prevention (DLP), secure storage, and controlled data retention/disposal?",
    type: "scored",
    weight: 4,
  },

  {
    id: 11,
    category: "D. Data Protection & Privacy",
    question:
      "Does your organization have documented processes for protecting personal and sensitive information throughout its lifecycle including collection, processing, storage, transmission, sharing, retention, backup, and secure destruction in accordance with applicable Ethiopian legal and regulatory requirements?",
    type: "scored",
    weight: 5,
  },

  // ============================================================
  // E. NETWORK & ENDPOINT SECURITY — 12 POINTS
  // ============================================================

  {
    id: 12,
    category: "E. Network & Endpoint Security",
    question:
      "Does your organization implement defense-in-depth network security controls appropriate to its risk, including network segmentation, firewalls, secure configurations, intrusion detection/prevention systems (IDS/IPS), secure remote access, and controlled network services, ports, and protocols?",
    type: "scored",
    weight: 6,
  },

  {
    id: 13,
    category: "E. Network & Endpoint Security",
    question:
      "Are organizational endpoints, servers, and critical devices protected using centrally managed endpoint security controls such as anti-malware/antivirus, endpoint detection and response (EDR/XDR), host-based firewalls, security configuration baselines, and timely security updates?",
    type: "scored",
    weight: 6,
  },

  // ============================================================
  // F. VULNERABILITY, CONFIGURATION & APPLICATION SECURITY — 10
  // ============================================================

  {
    id: 14,
    category:
      "F. Vulnerability, Configuration & Application Security",
    question:
      "Does your organization operate a formal vulnerability and patch management process that includes vulnerability scanning, risk-based prioritization such as CVSS, remediation tracking, security patching, configuration hardening, and verification of remediation?",
    type: "scored",
    weight: 5,
  },

  {
    id: 15,
    category:
      "F. Vulnerability, Configuration & Application Security",
    question:
      "Are critical applications, websites, APIs, and ICT systems subjected to security testing such as penetration testing, vulnerability assessment, secure configuration review, code/security testing, and security assessment before deployment and after significant changes?",
    type: "scored",
    weight: 5,
  },

  // ============================================================
  // G. SECURITY MONITORING & THREAT DETECTION — 10
  // ============================================================

  {
    id: 16,
    category:
      "G. Security Monitoring & Threat Detection",
    question:
      "Does your organization continuously monitor security events across critical systems, endpoints, networks, applications, and security devices using centralized logging, Security Information and Event Management (SIEM), Security Operations Center (SOC), Managed Security Service Provider (MSSP), or equivalent capabilities?",
    type: "scored",
    weight: 5,
  },

  {
    id: 17,
    category:
      "G. Security Monitoring & Threat Detection",
    question:
      "Are security logs, alerts, indicators of compromise (IOCs), and cyber threat intelligence (CTI) collected, correlated, analyzed, retained, and reviewed to detect anomalous behavior, unauthorized access, malware, intrusion, and other cybersecurity events?",
    type: "scored",
    weight: 5,
  },

  // ============================================================
  // H. INCIDENT RESPONSE — 12 POINTS
  // ============================================================

  {
    id: 18,
    category: "H. Incident Response",
    question:
      "Does your organization maintain a documented Cybersecurity Incident Response Plan (CIRP) with incident classification, detection, analysis, containment, eradication, recovery, escalation, communication, evidence preservation, and clearly assigned incident-response roles?",
    type: "scored",
    weight: 6,
  },

  {
    id: 19,
    category: "H. Incident Response",
    question:
      "Does your organization maintain tested incident-response playbooks and an established capability internally or through an authorized external provider to monitor, report, investigate, and respond to cybersecurity incidents, including the applicable reporting and notification requirements to the National Computer Emergency Response Center?",
    type: "scored",
    weight: 6,
  },

  // ============================================================
  // I. BUSINESS CONTINUITY & DISASTER RECOVERY — 8 POINTS
  // ============================================================

  {
    id: 20,
    category: "I. Business Continuity & Disaster Recovery",
    question:
      "Does your organization maintain business continuity and disaster recovery (BC/DR) plans for critical systems and services, including defined Recovery Time Objectives (RTOs), Recovery Point Objectives (RPOs), backup requirements, recovery procedures, and alternate operating arrangements?",
    type: "scored",
    weight: 4,
  },

  {
    id: 21,
    category: "I. Business Continuity & Disaster Recovery",
    question:
      "Are critical data and systems backed up using secure and resilient backup mechanisms, including protection against unauthorized alteration or ransomware and are backups and recovery procedures regularly tested and documented?",
    type: "scored",
    weight: 4,
  },

  // ============================================================
  // J. THIRD-PARTY & SUPPLY CHAIN SECURITY — 6 POINTS
  // ============================================================

  {
    id: 22,
    category: "J. Third-Party & Supply Chain Security",
    question:
      "Does your organization assess and manage cybersecurity risks associated with third parties, suppliers, cloud/service providers, contractors, and technology vendors before granting them access to systems, networks, or sensitive information?",
    type: "scored",
    weight: 3,
  },

  {
    id: 23,
    category: "J. Third-Party & Supply Chain Security",
    question:
      "Do contracts, Service Level Agreements (SLAs), and supplier agreements include cybersecurity requirements covering access control, data protection, incident notification, vulnerability management, security monitoring, audit rights, and technology supply-chain security?",
    type: "scored",
    weight: 3,
  },

  // ============================================================
  // K. PEOPLE, AWARENESS & SECURITY CULTURE — 6 POINTS
  // ============================================================

  {
    id: 24,
    category: "K. People, Awareness & Security Culture",
    question:
      "Does your organization provide role-based cybersecurity awareness and security training covering phishing, social engineering, credential security, malware, data protection, incident reporting, and acceptable use of information systems?",
    type: "scored",
    weight: 3,
  },

  {
    id: 25,
    category: "K. People, Awareness & Security Culture",
    question:
      "Are personnel with cybersecurity responsibilities appropriately qualified, trained, and periodically assessed for competency, with cybersecurity exercises, incident simulations, or drills conducted to validate organizational readiness?",
    type: "scored",
    weight: 3,
  },
];

export default function ComplianceAssessment() {
  const router = useRouter();

  const { user } = useAuth();

  const [started, setStarted] = useState(false);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [answers, setAnswers] = useState<
    Record<number, string | number>
  >({});



  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");



  const handleChange = (
    questionId: number,
    value: string | number
  ) => {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: value,
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!user) {
      setError("You must be logged in to submit an assessment.");
      return;
    }

    /*
    * ============================================================
    * Validate introductory questions
    * ============================================================
    */

    const organizationSector = answers[1];
    const organizationType = answers[2];
    const criticalInfrastructureStatus = answers[3];

    if (
      typeof organizationSector !== "string" ||
      typeof organizationType !== "string" ||
      typeof criticalInfrastructureStatus !== "string"
    ) {
      setError(
        "Please complete all organization profile questions."
      );

      return;
    }

    /*
    * ============================================================
    * Validate and prepare scored questions
    * ============================================================
    */

    const scoredAnswers: Record<number, number> = {};

    for (let questionId = 4; questionId <= 25; questionId++) {
      const answer = answers[questionId];

      if (
        typeof answer !== "number" ||
        !Number.isInteger(answer) ||
        answer < 0 ||
        answer > 4
      ) {
        setError(
          `Please answer question ${questionId} before submitting the assessment.`
        );

        return;
      }

      scoredAnswers[questionId] = answer;
    }

    /*
    * ============================================================
    * Submit to server action
    * ============================================================
    */

    setIsSubmitting(true);

    try {
      const result =
        await createComplianceAssessment(
          {
            organizationSector,
            organizationType,
            criticalInfrastructureStatus,
            answers: scoredAnswers,
          },
          user.id
        );

      if (result.success) {
        router.replace("/dashboard");
      } else {
        setError(
          result.error ||
            "Failed to submit compliance assessment."
        );
      }
    } catch (error) {
      console.error(
        "Compliance assessment submission error:",
        error
      );

      setError(
        "An error occurred while submitting the assessment."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const completedQuestions = questions.filter(
    (question) =>
      answers[question.id] !== undefined
  ).length;

  const progress =
    (completedQuestions / questions.length) * 100;

  const currentQuestion = questions[currentQuestionIndex];

  const currentOptions =
    currentQuestion?.options ?? maturityOptions;

  const isFirstQuestion = currentQuestionIndex === 0;

  const isLastQuestion =
    currentQuestionIndex === questions.length - 1;


  const currentAnswer = answers[currentQuestion.id];
  const hasAnsweredCurrentQuestion =
    currentAnswer !== undefined && currentAnswer !== "";



  return (
    <section className="w-full bg-black px-4 py-16 text-white">
      <div className="mx-auto w-full max-w-5xl">

        {!started ? (
          /* ======================================================
             INTRODUCTION SCREEN
          ======================================================= */


          <div className="flex min-h-[80vh] mb-40 flex-col items-center justify-center text-center">

            <Image
              className="logo w-90 h-auto -mt-20 -mb-14"
              src="/eeci-logo-white.svg"
              alt="eeci logo"
              width={100}
              height={20}
              priority
            />

            <h1 className="text-5xl font-black tracking-tighter sm:text-7xl md:text-7xl bg-linear-to-b from-white via-zinc-200 to-zinc-600 bg-clip-text text-transparent leading-[0.9]">
              Cybersecurity Compliance Assessment
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/60 md:text-base">
              Evaluate your organization's cybersecurity
              governance, controls, resilience, and regulatory
              readiness through a structured security assessment.
            </p>

            <div className="mt-10 grid w-full max-w-2xl gap-4 sm:grid-cols-3">
              <div className="border border-white/10 bg-white/2 px-5 py-5">
                <div className="font-mono text-2xl font-bold">
                  25
                </div>

                <p className="mt-2 text-xs uppercase tracking-[0.15em] text-white/40">
                  Questions
                </p>
              </div>

              <div className="border border-white/10 bg-white/2 px-5 py-5">
                <div className="font-mono text-2xl font-bold">
                  100
                </div>

                <p className="mt-2 text-xs uppercase tracking-[0.15em] text-white/40">
                  Scored Points
                </p>
              </div>

              <div className="border border-white/10 bg-white/2 px-5 py-5">
                <div className="font-mono text-2xl font-bold">
                  11
                </div>

                <p className="mt-2 text-xs uppercase tracking-[0.15em] text-white/40">
                  Security Domains
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStarted(true)}
              className="
                group
                mt-12
                flex
                items-center
                gap-4
                border
                rounded-full
                px-9
                py-5
                font-mono
                text-xs
                font-semibold
                uppercase
                tracking-[0.25em]
                text-black
                bg-white
                transition-all
                duration-300
                hover:border-white
                hover:bg-black
                hover:text-white
                cursor-pointer
              "
            >
              Start Assessment

              <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>

          </div>
        ) : (
          /* ======================================================
             ASSESSMENT SCREEN
          ======================================================= */

          <form onSubmit={handleSubmit}>

            {/* Header */}

            <div className="mb-16">

              <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

                <div>

                  <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                    Cybersecurity Compliance Assessment
                  </h1>
                </div>

                
                <button
                  type="button"
                  onClick={() => {
                    setStarted(false);
                    setCurrentQuestionIndex(0);
                    setAnswers({});
                    setError("");
                  }}
                  className="btn w-fit font-mono text-xs uppercase tracking-[0.2em] text-black bg-white transition-colors hover:text-white hover:bg-black hover:border hover:border-white"
                >
                  Restart Assessment
                </button>


              </div>

              {/* Progress */}

              <div className="mt-10">

                <div className="flex items-center justify-between">

                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-white">
                    Assessment Progress
                  </span>

                  <span className="font-mono text-xs text-white">
                    {completedQuestions} / {questions.length}
                  </span>

                </div>

                <div className="h-3 w-full bg-white/10">

                  <div
                    className="h-3 bg-white transition-all duration-500"
                    style={{
                      width: `${progress}%`,
                    }}
                  />

                </div>

              </div>

            </div>

            {/* Questions */}

            <div className="space-y-10">

              {/* Current Question */}
              <div
                key={currentQuestion.id}
                className="
                  relative
                  border-white/10
                "
              >

                {/* Question metadata */}

                <div className="mb-2 flex flex-wrap items-center gap-3">

                  <span className="font-mono text-xs tracking-[0.25em] text-white/30">
                    {String(currentQuestionIndex + 1).padStart(2, "0")}
                  </span>

                  <span className="h-px w-8 bg-white/20" />

                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/40">
                    {currentQuestion.category}
                  </span>

                  {currentQuestion.type === "scored" && (
                    <span className="ml-auto font-mono text-xs text-white/30">
                      {currentQuestion.weight} POINTS
                    </span>
                  )}

                  {currentQuestion.type === "intro" && (
                    <span className="ml-auto font-mono text-xs text-white/30">
                      PROFILE
                    </span>
                  )}

                </div>


                {/* Question */}

                <h2 className="max-w-4xl text-xl font-semibold leading-8 md:text-2xl">
                  {currentQuestion.question}
                </h2>


                {/* Answer options */}

                <div className="mt-4 grid gap-1">

                  {currentOptions.map((option) => {

                    const selected =
                      answers[currentQuestion.id];

                    const isSelected =
                      selected === option.value;

                    return (
                      <label
                        key={String(option.value)}
                        className={`
                          group
                          flex
                          cursor-pointer
                          items-center
                          gap-4
                          border
                          px-5
                          py-4
                          transition-all
                          duration-300
                          ${
                            isSelected
                              ? "border-white/50 bg-white/8"
                              : "border-white/10 bg-white/2 hover:border-white/25 hover:bg-white/4"
                          }
                        `}
                      >

                        <input
                          type="radio"
                          name={`question-${currentQuestion.id}`}
                          value={String(option.value)}
                          checked={isSelected}
                          onChange={() =>
                            handleChange(
                              currentQuestion.id,
                              option.value
                            )
                          }
                          className="sr-only"
                        />


                        {/* Selection indicator */}

                        <span
                          className={`
                            flex
                            h-5
                            w-5
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            border
                            transition-all
                            duration-300
                            ${
                              isSelected
                                ? "border-white"
                                : "border-white/25 group-hover:border-white/50"
                            }
                          `}
                        >
                          <span
                            className={`
                              h-2
                              w-2
                              rounded-full
                              bg-white
                              transition-all
                              duration-300
                              ${
                                isSelected
                                  ? "scale-100 opacity-100"
                                  : "scale-0 opacity-0"
                              }
                            `}
                          />
                        </span>


                        <span
                          className={`
                            text-sm
                            leading-6
                            transition-colors
                            ${
                              isSelected
                                ? "text-white"
                                : "text-white/60 group-hover:text-white/80"
                            }
                          `}
                        >
                          {option.label}
                        </span>

                      </label>
                    );
                  })}

                </div>

              </div>


              {/* Navigation */}

              <div className="flex items-center justify-between border-t border-white/10 pt-8 mb-40">

                {/* Previous */}

                <button
                  type="button"
                  disabled={isFirstQuestion}
                  onClick={() => {
                    setError("");
                    setCurrentQuestionIndex(
                      (previous) => Math.max(previous - 1, 0)
                    );
                  }}
                  className="
                    group
                    border
                    border-white/20
                    px-6
                    py-3
                    font-mono
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.2em]
                    text-white
                    transition-all
                    duration-300
                    hover:border-white
                    hover:bg-white
                    hover:text-black
                    disabled:cursor-not-allowed
                    disabled:border-white/5
                    disabled:text-white/
                    cursor-pointer
                  "
                >
                  <span className="mr-3 transition-transform duration-300 group-hover:-translate-x-1">
                    ←
                  </span>

                  Previous
                </button>


                {/* Next / Submit */}

                {!isLastQuestion ? (
                  <button
                    type="button"
                    disabled={!hasAnsweredCurrentQuestion}
                    onClick={() => {
                      setError("");
                      if (!hasAnsweredCurrentQuestion) return;
                      setCurrentQuestionIndex((prev) => prev + 1);
                    }}
                    className="
                      group
                      border
                      border-white/30
                      bg-white
                      px-6
                      py-3
                      font-mono
                      text-xs
                      font-semibold
                      uppercase
                      tracking-[0.2em]
                      text-black
                      transition-all
                      duration-300
                      hover:border-white
                      hover:bg-black
                      hover:text-white
                      cursor-pointer
                      disabled:cursor-not-allowed
                    "
                  >
                    Next

                    <span className="ml-3 transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!hasAnsweredCurrentQuestion || isSubmitting}
                    className="
                      group
                      border
                      border-white/30
                      bg-white
                      px-6
                      py-3
                      font-mono
                      text-xs
                      font-semibold
                      uppercase
                      tracking-[0.2em]
                      text-black
                      transition-all
                      duration-300
                      hover:border-white
                      hover:bg-black
                      hover:text-white
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                      cursor-pointer
                    "
                  >
                    {isSubmitting ? (
                      <>
                        <span className="loading loading-spinner loading-xs mr-3" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Submit Assessment

                        <span className="ml-3 transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </>
                    )}
                  </button>
                )}

              </div>

            </div>

          </form>
        )}

      </div>
    </section>
  );
}
