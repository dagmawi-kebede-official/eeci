"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { deleteSecurityTestingBooking } from "@/actions/security-testing";
import { useMemo } from "react";
import IncidentReportsSection from "@/components/IncidentReportsSection";

interface Report {
    id: number;
    name: string;
    description: string;
    content?: string;
    isPublic: boolean;
    createdAt: string;
    incidentType: string | null;
    severity: string | null;
    reportedAt: string | null;
    affectedSystem: string | null;
    affectedDepartment: string | null;
    affectedUsers: number | null;
    reporter: string | null;
    evidenceFiles: {
        name: string;
        size: number;
        type: string;
    }[] | null;
}

interface DomainScore {
    key: string;
    name: string;
    earnedPoints: number;
    maximumScore: number;
    percentage: number;
}

interface ComplianceAssessment {
    id: number;
    organizationSector: string;
    organizationType: string;
    criticalInfrastructureStatus: string;
    totalScore: number;
    createdAt: string;
    updatedAt: string;
    domainScores: DomainScore[];
}

interface SecurityTestingBooking {
    id: number;
    name: string;
    testingType: string;
    scope: string;
    startDate: string;
    endDate: string;
    status: string;
    termsAccepted: boolean;
    createdAt: string;
    updatedAt: string;
}

const domainGuidance: Record<string, {
    critical: string;
    developing: string;
    strong: string;
}> = {
    "Governance & Security Management": {
        critical: "Your governance and security management foundation needs immediate attention. Establish clear security ownership, policies, responsibilities, and a regular process for reviewing and improving your cybersecurity program.",
        developing: "Your governance foundation is developing, but important areas may still be inconsistent. Strengthen security policies, ownership, accountability, and regular management review to create a more structured cybersecurity program.",
        strong: "You have done great in Governance & Security Management. Your organization shows a strong foundation for managing cybersecurity. Continue reviewing your policies, responsibilities, and security objectives to keep this foundation effective.",
    },
    "Risk & Asset Management": {
        critical: "Your risk and asset management needs immediate attention. Start by identifying your critical systems, information assets, and major cybersecurity risks so your organization can prioritize what needs protection first.",
        developing: "Your risk and asset management is progressing, but there is room to improve visibility and prioritization. Maintain an accurate asset inventory and regularly assess the risks associated with your most important systems and information.",
        strong: "You have done great in Risk & Asset Management. Your organization demonstrates strong awareness of its assets and cybersecurity risks. Continue reviewing your inventory and risk priorities as your environment changes.",
    },
    "Identity & Access Management": {
        critical: "Your identity and access management requires immediate attention. Review who has access to critical systems, remove unnecessary access, and establish stronger controls around authentication and privileged accounts.",
        developing: "Your identity and access controls are developing, but gaps may still exist. Focus on regularly reviewing user access, strengthening authentication, and ensuring privileged access is carefully controlled.",
        strong: "You have done great in Identity & Access Management. Your organization demonstrates a strong approach to controlling access to systems and information. Continue reviewing privileges and authentication controls regularly.",
    },
    "Data Protection & Privacy": {
        critical: "Your data protection and privacy practices need immediate attention. Identify the information your organization holds, determine what is most sensitive, and establish appropriate controls for protecting and handling it.",
        developing: "Your data protection and privacy practices are developing, but further structure is needed. Strengthen data classification, protection controls, retention practices, and privacy processes around sensitive information.",
        strong: "You have done great in Data Protection & Privacy. Your organization demonstrates a strong foundation for protecting sensitive information. Continue reviewing how data is collected, stored, accessed, shared, and retained.",
    },
    "Network & Endpoint Security": {
        critical: "Your network and endpoint security needs immediate attention. Prioritize securing endpoints, network infrastructure, remote access, and the basic security controls protecting your organization's technology environment.",
        developing: "Your network and endpoint security is developing, but additional controls may be needed. Focus on consistent endpoint protection, secure configurations, network segmentation where appropriate, and secure remote access.",
        strong: "You have done great in Network & Endpoint Security. Your organization demonstrates strong protection across its technology environment. Continue monitoring, maintaining, and reviewing endpoint and network controls as the environment evolves.",
    },
    "Vulnerability, Configuration & Application Security": {
        critical: "Your vulnerability, configuration, and application security requires immediate attention. Establish a regular process for identifying vulnerabilities, correcting insecure configurations, and addressing security weaknesses in applications.",
        developing: "Your vulnerability and configuration management is developing, but consistency is important. Strengthen vulnerability scanning, patching, secure configuration management, and security practices throughout the application lifecycle.",
        strong: "You have done great in Vulnerability, Configuration & Application Security. Your organization demonstrates a strong foundation for identifying and reducing technical security weaknesses. Continue testing, patching, and reviewing configurations regularly.",
    },
    "Security Monitoring & Threat Detection": {
        critical: "Your security monitoring and threat detection needs immediate attention. Establish visibility into important systems and security events so suspicious activity can be identified and investigated before it becomes a larger incident.",
        developing: "Your security monitoring capabilities are developing, but visibility may still be incomplete. Focus on monitoring critical systems, improving alerting, and establishing a consistent process for reviewing and responding to suspicious activity.",
        strong: "You have done great in Security Monitoring & Threat Detection. Your organization demonstrates strong capabilities for maintaining security visibility. Continue tuning monitoring and detection processes as threats and your environment evolve.",
    },
    "Incident Response": {
        critical: "Your incident response capability needs immediate attention. Establish a clear process for identifying, reporting, containing, investigating, and recovering from cybersecurity incidents before one occurs.",
        developing: "Your incident response capability is developing, but greater preparation is needed. Document response procedures, define responsibilities, and regularly test how your organization would respond to a cybersecurity incident.",
        strong: "You have done great in Incident Response. Your organization demonstrates a strong foundation for handling cybersecurity incidents. Continue testing and improving your response procedures so they remain effective when needed.",
    },
    "Business Continuity & Disaster Recovery": {
        critical: "Your business continuity and disaster recovery readiness needs immediate attention. Identify your most critical business services and establish recovery priorities, procedures, and responsibilities for major disruptions.",
        developing: "Your continuity and recovery capabilities are developing, but important areas may still need strengthening. Review recovery priorities, backup processes, recovery procedures, and regularly test whether your organization can recover from disruption.",
        strong: "You have done great in Business Continuity & Disaster Recovery. Your organization demonstrates strong preparation for maintaining and recovering important operations. Continue testing recovery procedures and updating them as your business changes.",
    },
    "Third-Party & Supply Chain Security": {
        critical: "Your third-party and supply chain security needs immediate attention. Identify the external providers that could affect your organization's security and establish a process for assessing and managing their cybersecurity risks.",
        developing: "Your third-party security practices are developing, but supplier risk management can be strengthened. Prioritize critical suppliers, establish security expectations, and regularly review the risks associated with important third parties.",
        strong: "You have done great in Third-Party & Supply Chain Security. Your organization demonstrates strong awareness of third-party cybersecurity risk. Continue reviewing critical suppliers and maintaining appropriate security expectations throughout important relationships.",
    },
    "People, Awareness & Security Culture": {
        critical: "Your security awareness and culture needs immediate attention. Establish basic cybersecurity awareness for employees and create clear expectations around secure behavior, reporting, and responsibility.",
        developing: "Your security culture is developing, but awareness should become more consistent. Provide regular security awareness activities and reinforce expectations around phishing, passwords, data handling, and incident reporting.",
        strong: "You have done great in People, Awareness & Security Culture. Your organization demonstrates a strong foundation for building security-conscious behavior. Continue reinforcing awareness through regular training, communication, and practical exercises.",
    },
};

const getDomainGuidance = (domain: DomainScore) => {
    const guidance = domainGuidance[domain.name];
    if (!guidance) {
        return "";
    }
    if (domain.percentage < 50) {
        return guidance.critical;
    }
    if (domain.percentage < 80) {
        return guidance.developing;
    }
    return guidance.strong;
};

export default function DashboardPage() {
    const { user } = useAuth();
    const [complianceAssessment, setComplianceAssessment] = useState<ComplianceAssessment | null>(null);
    const [loadingCompliance, setLoadingCompliance] = useState(true);
    const [securityTestingBookings, setSecurityTestingBookings] = useState<SecurityTestingBooking[]>([]);
    const [loadingSecurityTesting, setLoadingSecurityTesting] = useState(true);
    const [deletingBookingId, setDeletingBookingId] = useState<number | null>(null);
    const [expandedDomain, setExpandedDomain] = useState<string | null>(null);
    const [activeSection, setActiveSection] = useState<"profile" | "incidents" | "testing">("profile");

    useEffect(() => {
      if (window.location.hash === "#incident-reports") {
        setActiveSection("incidents");
      }
    }, []);
    useEffect(() => {
      if (window.location.hash === "#security-services") {
        setActiveSection("testing");
      }
    }, []);

    useEffect(() => {
        if (user) {
            fetchComplianceAssessment();
            fetchSecurityTestingBookings();
        }
    }, [user]);

    const stats = useMemo(() => {
        const total = securityTestingBookings.length;
        const pending = securityTestingBookings.filter((b) => b.status === "PENDING").length;
        const active = securityTestingBookings.filter((b) => b.status === "SCHEDULED" || b.status === "IN_PROGRESS").length;
        const completed = securityTestingBookings.filter((b) => b.status === "COMPLETED").length;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
        const typeCounts = securityTestingBookings.reduce<Record<string, number>>((acc, b) => {
            acc[b.testingType] = (acc[b.testingType] ?? 0) + 1;
            return acc;
        }, {});
        const maxTypeCount = Math.max(1, ...Object.values(typeCounts));
        return { total, pending, active, completed, completionRate, typeCounts, maxTypeCount };
    }, [securityTestingBookings]);

    const fetchComplianceAssessment = async () => {
        try {
            const response = await fetch("/api/compliance", {
                credentials: "include",
            });
            if (response.ok) {
                const data = await response.json();
                if (data.assessments &&
                    data.assessments.length > 0) {
                    setComplianceAssessment(data.assessments[0]);
                }
            }
        }
        catch (error) {
            console.error("Failed to fetch compliance assessment:", error);
        }
        finally {
            setLoadingCompliance(false);
        }
    };

    const fetchSecurityTestingBookings = async () => {
        try {
            const response = await fetch("/api/security-testing", {
                credentials: "include",
            });
            if (response.ok) {
                const data = await response.json();
                const bookings = Array.isArray(data)
                    ? data
                    : data.bookings || [];
                setSecurityTestingBookings(bookings);
            }
        }
        catch (error) {
            console.error("Failed to fetch security testing bookings:", error);
        }
        finally {
            setLoadingSecurityTesting(false);
        }
    };

    const handleDeleteBooking = async (id: number) => {
        if (!user ||
            !confirm("Are you sure you want to cancel this security testing booking?")) {
            return;
        }
        setDeletingBookingId(id);
        try {
            const result = await deleteSecurityTestingBooking(id);
            if (result.success) {
                setSecurityTestingBookings(securityTestingBookings.filter((booking) => booking.id !== id));
            }
            else {
                alert(result.error ||
                    "Failed to delete booking");
            }
        }
        catch (error) {
            console.error("Delete security testing booking error:", error);
            alert("Failed to delete security testing booking");
        }
        finally {
            setDeletingBookingId(null);
        }
    };
    return (<main className="min-h-screen bg-black text-white">
      <div className="mx-auto w-full max-w-[1800px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">

        <header className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
            </div>
            <h1 className="mt-1 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Dashboard
            </h1>
            <p className="mt-2 text-sm leading-6 text-white/60">
              Welcome back, {user?.name}!
            </p>
          </div>
        </header>

        {/* ======================================================
            CENTRALIZED CONTROL PANEL
        ======================================================= */}
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/2.5 shadow-[0_20px_80px_-35px_rgba(255,255,255,0.18)]">

          {/* Interconnection lines */}
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <div className="absolute left-1/3 top-0 h-full w-px bg-linear-to-b from-transparent via-white/8 to-transparent"/>
            <div className="absolute left-2/3 top-0 h-full w-px bg-linear-to-b from-transparent via-white/8 to-transparent"/>
            <div className="absolute left-0 top-1/2 h-px w-full bg-linear-to-r from-transparent via-white/8 to-transparent"/>
          </div>
          <div className="relative flex min-h-160 flex-col md:flex-row">
            <nav aria-label="Dashboard sections" className="flex max-w-full shrink-0 flex-row gap-2 overflow-x-auto border-b border-white/10 bg-black/40 p-3 md:w-60 md:flex-col md:gap-2 md:border-b-0 md:border-r md:p-4">
              <p className="hidden px-3 pb-2 font-mono text-xs uppercase tracking-[0.22em] text-white/55 md:block">Workspace</p>
              <button type="button" onClick={() => setActiveSection("profile")} aria-current={activeSection === "profile" ? "page" : undefined} className={`cursor-pointer flex min-h-11 min-w-max items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black md:w-full ${activeSection === "profile" ? "border-white/20 bg-white/10 text-white shadow-[inset_2px_0_0_0_rgba(255,255,255,0.9)]" : "border-transparent text-white/55 hover:border-white/10 hover:bg-white/5 hover:text-white"}`}>
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0"><path d="M12 3l7 3v5c0 4.5-2.8 8.5-7 10-4.2-1.5-7-5.5-7-10V6l7-3z"/><path d="m8.5 12 2.3 2.3 4.7-5"/></svg>
                <span>Security Profile</span>
              </button>
              <button type="button" onClick={() => setActiveSection("incidents")} aria-current={activeSection === "incidents" ? "page" : undefined} className={`cursor-pointer flex min-h-11 min-w-max items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black md:w-full ${activeSection === "incidents" ? "border-white/20 bg-white/10 text-white shadow-[inset_2px_0_0_0_rgba(255,255,255,0.9)]" : "border-transparent text-white/55 hover:border-white/10 hover:bg-white/5 hover:text-white"}`}>
                
                <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <line x1="10" y1="9" x2="8" y2="9" />
              </svg>
                <span>Incident Reports</span>
              </button>
              <button type="button" onClick={() => setActiveSection("testing")} aria-current={activeSection === "testing" ? "page" : undefined} className={`cursor-pointer flex min-h-11 min-w-max items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black md:w-full ${activeSection === "testing" ? "border-white/20 bg-white/10 text-white shadow-[inset_2px_0_0_0_rgba(255,255,255,0.9)]" : "border-transparent text-white/55 hover:border-white/10 hover:bg-white/5 hover:text-white"}`}>
                <span className="ml-0.5 text-2xl">⌸</span>
                <span>Security Testing</span>
              </button>
            </nav>
            <div className="min-w-0 flex-1">
              <div className="grid min-w-0 lg:grid-cols-12">

            {activeSection === "profile" && <>

            {/* ==================================================
                Compliance overview
            =================================================== */}

            <div className="min-w-0 border-b border-white/10 p-5 sm:p-6 lg:col-span-8 lg:border-r">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
                <div>
                  <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-white/55">
                    <span className="inline-block mr-2 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    EECI security profile
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold leading-7 tracking-tight text-white sm:text-2xl">
                    Cybersecurity Compliance
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                <Link href="/compliance" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/15 bg-transparent px-4 py-2 text-sm font-medium text-white transition-colors hover:border-white/35 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black">
                  ⟲ Reassess
                </Link>
                <Link href="/security" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0" aria-label="Compliance Assessment">
                        <path d="M12 3l7 3v5c0 4.5-2.8 8.5-7 10-4.2-1.5-7-5.5-7-10V6l7-3z"/>
                        <path d="m8.5 12 2.3 2.3 4.7-5"/>
                      </svg>
                  Protect Your Company
                </Link>
              </div>
              </div>
              
              {loadingCompliance ? (<div className="grid min-h-90 place-items-center rounded-xl border border-white/10 bg-white/2.5 p-6">
                  <div className="w-full max-w-3xl">
                    <div className="skeleton h-10 w-40"></div>
                    <div className="mt-3 skeleton h-3 w-72"></div>
                    <div className="mt-8 space-y-4">
                      {[1, 2, 3, 4].map((item) => (<div key={item} className="space-y-2">
                          <div className="skeleton h-3 w-48"></div>
                          <div className="skeleton h-1 w-full"></div>
                        </div>))}
                    </div>
                  </div>
                </div>) : complianceAssessment ? (<div className="grid gap-4 xl:grid-cols-[220px_1fr]">

                  {/* Overall score */}
                  <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/60 p-5 sm:p-6">
                    <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-white/55">
                      Overall Score
                    </p>
                    <div className="relative mx-auto mt-4 h-36 w-36">
                      <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="43" fill="none" stroke="currentColor" strokeWidth="3" className="text-white/10"/>
                        <circle cx="50" cy="50" r="43" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className={complianceAssessment.totalScore < 50
                    ? "text-red-400"
                    : complianceAssessment.totalScore < 80
                        ? "text-amber-300"
                        : "text-emerald-400"} strokeDasharray={2 * Math.PI * 43} strokeDashoffset={2 *
                    Math.PI *
                    43 *
                    (1 -
                        Math.min(complianceAssessment.totalScore, 100) / 100)}/>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="font-mono text-4xl font-black tracking-tight">
                          {complianceAssessment.totalScore.toFixed(0)}
                        </span>
                        <span className="mt-1 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-white/55">
                          / 100
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 text-center">
                      <span className={`inline-flex items-center gap-2 border px-2.5 py-1 font-mono text-xs tracking-[0.04em] ${complianceAssessment.totalScore < 50
                    ? "border-red-500/30 bg-red-500/10 text-red-300"
                    : complianceAssessment.totalScore < 80
                        ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
                        : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"}`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-current"/>
                        {complianceAssessment.totalScore < 50
                    ? "Critical"
                    : complianceAssessment.totalScore < 80
                        ? "Developing"
                        : "Strong"}
                      </span>
                    </div>

                    <div className="mt-5 border-t border-white/10 pt-4">
                      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-white/55">
                        Latest assessment
                      </p>
                      <p className="mt-2 text-sm leading-6 text-white/60">
                        {new Date(complianceAssessment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="mt-4 border-t border-white/10 pt-4">
                      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-white/55">
                        Security Identity
                      </p>
                      <div className="mt-2 space-y-2">
                        <div>
                          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-white/55">
                            Sector
                          </p>
                          <p className="mt-0.5 truncate text-xs font-medium text-white/70">
                            {complianceAssessment.organizationSector}
                          </p>
                        </div>
                        <div>
                          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-white/55">
                            Organization type
                          </p>
                          <p className="mt-0.5 truncate text-xs font-medium text-white/70">
                            {complianceAssessment.organizationType}
                          </p>
                        </div>
                        <div>
                          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-white/55">
                            Critical infrastructure status
                          </p>
                          <p className="mt-0.5 line-clamp-2 text-xs leading-4 font-medium text-white/70">
                            {complianceAssessment.criticalInfrastructureStatus}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Domain matrix */}
                  <div className="min-w-0 rounded-xl border border-white/10 bg-white/2.5 p-4 sm:p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-white/55">
                          Domain Performance
                        </p>
                        <p className="mt-2 text-sm leading-6 text-white/60">
                          Current performance across the EECI security domains.
                        </p>
                      </div>
                    </div>
                    <div className="grid gap-x-5 sm:grid-cols-2">
                      {complianceAssessment.domainScores.map((domain, index) => {
                    const isExpanded = expandedDomain === domain.key;
                    const tone = domain.percentage < 50
                        ? {
                            text: "text-red-300",
                            bar: "bg-red-400",
                            border: "border-red-500/30",
                            bg: "bg-red-500/[0.04]",
                        }
                        : domain.percentage < 80
                            ? {
                                text: "text-amber-300",
                                bar: "bg-amber-300",
                                border: "border-amber-500/30",
                                bg: "bg-amber-500/[0.04]",
                            }
                            : {
                                text: "text-emerald-300",
                                bar: "bg-emerald-400",
                                border: "border-emerald-500/30",
                                bg: "bg-emerald-500/[0.04]",
                            };
                    return (<div key={domain.key} className={`border-b border-white/8 py-2.5 ${isExpanded ? tone.bg : ""}`}>
                            <button type="button" onClick={() => setExpandedDomain(isExpanded ? null : domain.key)} className="w-full cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black">
                              <div className="mb-1.5 flex items-center justify-between gap-3">
                                <div className="flex min-w-0 items-center gap-2">
                                  <span className="font-mono text-sm leading-5 text-white/55">
                                    {String(index + 1).padStart(2, "0")}
                                  </span>
                                  <h3 className="truncate text-sm font-medium leading-5 text-white/80">
                                    {domain.name}
                                  </h3>
                                </div>
                                <div className="flex shrink-0 items-center gap-2">
                                  <span className={`font-mono text-xs font-bold ${tone.text}`}>
                                    {domain.percentage.toFixed(0)}%
                                  </span>
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`h-3 w-3 text-white/55 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>
                                    <path d="m6 9 6 6 6-6"/>
                                  </svg>
                                </div>
                              </div>
                              <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                                <div className={`h-full ${tone.bar} transition-all duration-700`} style={{
                            width: `${Math.min(domain.percentage, 100)}%`,
                        }}/>
                              </div>
                            </button>
                            {isExpanded && (<div className={`mt-2 border-l pl-3 ${tone.border}`}>
                                <p className="mb-1 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-white/55">
                                  Recommended direction
                                </p>
                                <p className="text-sm leading-5 text-white/60">
                                  {getDomainGuidance(domain)}
                                </p>
                              </div>)}
                          </div>);
                })}
                    </div>
                  </div>
                </div>) : (<div className="flex min-h-90 flex-col items-center justify-center rounded-xl border border-white/10 bg-white/2.5 p-8 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="h-16 w-16 text-white/55" aria-label="Compliance Assessment">
                    <path d="M12 3l7 3v5c0 4.5-2.8 8.5-7 10-4.2-1.5-7-5.5-7-10V6l7-3z"/>
                    <path d="m8.5 12 2.3 2.3 4.7-5"/>
                  </svg>
                  <h3 className="mt-4 text-sm font-semibold leading-5 text-white">
                    Build your cybersecurity profile
                  </h3>
                  <p className="mt-2 max-w-xl text-sm leading-5 text-white/55">
                    Complete the EECI cybersecurity assessment to generate your organization's security score,
                    domain performance, and compliance profile.
                  </p>
                  <Link href="/compliance" className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black">
                    Start Assessment →
                  </Link>
                </div>)}
            </div>
            
              {/* DOMAIN PERFORMANCE GRAPHS */}
              <div className="flex min-w-0 flex-col lg:col-span-4">
                {/* TOP: Domain Performance Area Chart */}
                <aside className="min-w-0 border-b border-white/10 p-5 sm:p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-white/55">
                        Security analytics
                      </p>
                      <h2 className="mt-1 text-xl font-semibold leading-7 tracking-tight text-white sm:text-2xl">
                        Domain Performance
                      </h2>
                    </div>
                    <span className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-white/55">
                      11 domains
                    </span>
                  </div>

                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-white/55">
                        Security maturity
                      </p>
                      <div className="flex items-center gap-3 font-mono text-xs tracking-[0.04em]">
                        <span className="flex items-center gap-1.5 text-emerald-300/70">
                          <i className="h-1.5 w-4 rounded-full bg-emerald-400" />
                          Strong
                        </span>
                        <span className="flex items-center gap-1.5 text-amber-300/70">
                          <i className="h-1.5 w-4 rounded-full bg-amber-300" />
                          Developing
                        </span>
                        <span className="flex items-center gap-1.5 text-red-300/70">
                          <i className="h-1.5 w-4 rounded-full bg-red-400" />
                          Critical
                        </span>
                      </div>
                    </div>

                    <div className="relative h-55 overflow-hidden rounded-lg border border-white/10 bg-black/40 px-2 pb-1 pt-4">
                      {complianceAssessment?.domainScores?.length ? (() => {
                        const chartWidth = 1000;
                        const chartHeight = 220;
                        const bottom = 204;
                        const top = 16;
                        const usableHeight = bottom - top;
                        const domains = complianceAssessment.domainScores;

                        const makePoints = (scale: number) =>
                          domains.map((domain, index) => {
                            const x =
                              domains.length === 1
                                ? chartWidth / 2
                                : (index / (domains.length - 1)) * chartWidth;
                            const value = Math.max(
                              0,
                              Math.min(100, domain.percentage * scale)
                            );
                            const y = top + (1 - value / 100) * usableHeight;
                            return { x, y, value };
                          });

                        const smoothPath = (points: { x: number; y: number }[]) => {
                          if (points.length === 1) {
                            return `M ${points[0].x} ${points[0].y}`;
                          }

                          let path = `M ${points[0].x} ${points[0].y}`;

                          for (let i = 0; i < points.length - 1; i += 1) {
                            const current = points[i];
                            const next = points[i + 1];
                            const dx = (next.x - current.x) / 2;

                            path += ` C ${current.x + dx} ${current.y}, ${next.x - dx} ${next.y}, ${next.x} ${next.y}`;
                          }

                          return path;
                        };

                        type MaturityBand = "red" | "yellow" | "green";

                        type MaturityBandConfig = {
                          area: string;
                          line: string;
                          fill: string;
                          stroke: string;
                          opacity: number;
                          width: number;
                        };

                        const bandCounts: Record<MaturityBand, number> = {
                          green: domains.filter((domain) => domain.percentage >= 80).length,
                          yellow: domains.filter(
                            (domain) => domain.percentage >= 50 && domain.percentage < 80
                          ).length,
                          red: domains.filter((domain) => domain.percentage < 50).length,
                        };

                        const maxBandCount = Math.max(
                          bandCounts.red,
                          bandCounts.yellow,
                          bandCounts.green,
                          1
                        );

                        const bandHeight = (band: MaturityBand) =>
                          0.16 + (bandCounts[band] / maxBandCount) * 0.84;

                        const redPoints = makePoints(bandHeight("red"));
                        const yellowPoints = makePoints(bandHeight("yellow"));
                        const greenPoints = makePoints(bandHeight("green"));

                        const redLine = smoothPath(redPoints);
                        const yellowLine = smoothPath(yellowPoints);
                        const greenLine = smoothPath(greenPoints);

                        const redArea = `${redLine} L ${chartWidth} ${bottom} L 0 ${bottom} Z`;
                        const yellowArea = `${yellowLine} L ${chartWidth} ${bottom} L 0 ${bottom} Z`;
                        const greenArea = `${greenLine} L ${chartWidth} ${bottom} L 0 ${bottom} Z`;

                        const renderOrder = (
                          ["red", "yellow", "green"] as MaturityBand[]
                        ).sort((a, b) => bandCounts[a] - bandCounts[b]);

                        return (
                          <div className="relative z-10 h-full w-full">
                            <svg
                              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                              preserveAspectRatio="none"
                              className="h-full w-full"
                              role="img"
                              aria-label="Security maturity relationship area chart"
                            >
                              <defs>
                                <linearGradient id="securityGreenFill" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#34d399" stopOpacity="0.48" />
                                  <stop offset="100%" stopColor="#34d399" stopOpacity="0.10" />
                                </linearGradient>
                                <linearGradient id="securityYellowFill" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.38" />
                                  <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.07" />
                                </linearGradient>
                                <linearGradient id="securityRedFill" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#f87171" stopOpacity="0.30" />
                                  <stop offset="100%" stopColor="#f87171" stopOpacity="0.05" />
                                </linearGradient>
                              </defs>

                              {renderOrder.map((band) => {
                                const config: MaturityBandConfig = {
                                  red: {
                                    area: redArea,
                                    line: redLine,
                                    fill: "url(#securityRedFill)",
                                    stroke: "#f87171",
                                    opacity: 0.82,
                                    width: 2,
                                  },
                                  yellow: {
                                    area: yellowArea,
                                    line: yellowLine,
                                    fill: "url(#securityYellowFill)",
                                    stroke: "#fbbf24",
                                    opacity: 0.88,
                                    width: 2,
                                  },
                                  green: {
                                    area: greenArea,
                                    line: greenLine,
                                    fill: "url(#securityGreenFill)",
                                    stroke: "#34d399",
                                    opacity: 0.95,
                                    width: 2.5,
                                  },
                                }[band];

                                return (
                                  <g key={band}>
                                    <path d={config.area} fill={config.fill} />
                                    <path
                                      d={config.line}
                                      fill="none"
                                      stroke={config.stroke}
                                      strokeOpacity={config.opacity}
                                      strokeWidth={config.width}
                                      vectorEffect="non-scaling-stroke"
                                      strokeLinecap="round"
                                    />
                                  </g>
                                );
                              })}
                            </svg>

                            <div className="pointer-events-none absolute inset-x-2 bottom-1 flex justify-between font-mono text-sm leading-5 text-white/55">
                              <span>01</span>
                              <span>06</span>
                              <span>11</span>
                            </div>
                          </div>
                        );
                      })() : (
                        <div className="flex h-full items-center justify-center">
                          <span className="font-mono text-xs tracking-[0.18em] text-white/55">
                            Complete an assessment to populate analytics
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 flex items-center justify-between text-sm leading-5 text-white/55">
                      <span>Lower maturity</span>
                      <span>Domain relationship</span>
                      <span>Higher maturity</span>
                    </div>
                  </div>
                </aside>

                {/* BOTTOM: Domain Performance Bar Chart */}
                <aside className="min-w-0">
                  <div className="pt-4 sm:p-5">
                    <div className="relative h-55 overflow-hidden rounded-lg border border-white/10 bg-black/40 px-2 pb-1 pt-4">
                      {complianceAssessment?.domainScores?.length ? (() => {
                        const chartWidth = 1000;
                        const chartHeight = 220;
                        const top = 20;
                        const bottom = 190;
                        const usableHeight = bottom - top;
                        const domains = complianceAssessment.domainScores;
                        const slotWidth = chartWidth / domains.length;
                        const barWidth = Math.min(44, slotWidth * 0.58);

                        const getColor = (percentage: number) => {
                          if (percentage >= 80) return "#34d399";
                          if (percentage >= 50) return "#fbbf24";
                          return "#f87171";
                        };

                        return (
                          <div className="relative z-10 h-full w-full">
                            <svg
                              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                              preserveAspectRatio="none"
                              className="h-full w-full"
                              role="img"
                              aria-label="Bar chart showing security maturity for each domain"
                            >
                              <defs>
                                <linearGradient id="domainGreenBar" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#34d399" stopOpacity="0.95" />
                                  <stop offset="100%" stopColor="#34d399" stopOpacity="0.35" />
                                </linearGradient>
                                <linearGradient id="domainYellowBar" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.95" />
                                  <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.35" />
                                </linearGradient>
                                <linearGradient id="domainRedBar" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#f87171" stopOpacity="0.95" />
                                  <stop offset="100%" stopColor="#f87171" stopOpacity="0.35" />
                                </linearGradient>
                              </defs>

                              {/* Percentage grid lines */}
                              {[0, 25, 50, 75, 100].map((tick) => {
                                const y = bottom - (tick / 100) * usableHeight;

                                return (
                                  <g key={tick}>
                                    <line
                                      x1="0"
                                      y1={y}
                                      x2={chartWidth}
                                      y2={y}
                                      stroke="rgba(255,255,255,0.10)"
                                      strokeDasharray="4 6"
                                    />
                                    <text
                                      x="6"
                                      y={Math.max(12, y - 4)}
                                      fill="rgba(255,255,255,0.45)"
                                      fontSize="12"
                                      fontFamily="monospace"
                                    >
                                      {tick}%
                                    </text>
                                  </g>
                                );
                              })}

                              {/* Domain maturity bars */}
                              {domains.map((domain, index) => {
                                const percentage = Math.max(
                                  0,
                                  Math.min(100, domain.percentage)
                                );
                                const barHeight = (percentage / 100) * usableHeight;
                                const x =
                                  index * slotWidth + (slotWidth - barWidth) / 2;
                                const y = bottom - barHeight;

                                const fill =
                                  percentage >= 80
                                    ? "url(#domainGreenBar)"
                                    : percentage >= 50
                                      ? "url(#domainYellowBar)"
                                      : "url(#domainRedBar)";

                                return (
                                  <g key={index}>
                                    <rect
                                      x={x}
                                      y={y}
                                      width={barWidth}
                                      height={barHeight}
                                      rx="4"
                                      fill={fill}
                                      stroke={getColor(percentage)}
                                      strokeOpacity="0.65"
                                      strokeWidth="1"
                                    >
                                      <title>
                                        Domain {index + 1}: {percentage}% maturity
                                      </title>
                                    </rect>

                                    <text
                                      x={x + barWidth / 2}
                                      y={Math.max(top + 12, y - 6)}
                                      fill="rgba(255,255,255,0.8)"
                                      fontSize="12"
                                      fontFamily="monospace"
                                      textAnchor="middle"
                                    >
                                      {Math.round(percentage)}%
                                    </text>
                                  </g>
                                );
                              })}
                            </svg>

                            <div className="pointer-events-none absolute inset-x-2 bottom-1 flex justify-between font-mono text-sm leading-5 text-white/55">
                              <span>01</span>
                              <span>
                                {String(Math.ceil(domains.length / 2)).padStart(2, "0")}
                              </span>
                              <span>{String(domains.length).padStart(2, "0")}</span>
                            </div>
                          </div>
                        );
                      })() : (
                        <div className="flex h-full items-center justify-center">
                          <span className="font-mono text-xs tracking-[0.18em] text-white/55">
                            Complete an assessment to populate analytics
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 flex items-center justify-between text-sm leading-5 text-white/55">
                      <span>Lower maturity</span>
                      <span>Domain relationship</span>
                      <span>Higher maturity</span>
                    </div>
                  </div>
                </aside>
              </div>

            </>}

            {activeSection === "testing" && <>

            {/* ==================================================
                SECURITY TESTING KPI MATRIX
            =================================================== */}
            <div className="min-w-0 border-b border-white/10 p-5 sm:p-6 lg:col-span-5">
              <div className="mb-4">
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-white/55">
                  Security Services
                </p>
                <h2 className="mt-1 text-xl font-semibold leading-7 tracking-tight text-white sm:text-2xl">Security Testing</h2>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex min-h-32 flex-col justify-between rounded-xl border border-blue-500/25 bg-white/2.5 p-4 transition-colors hover:bg-white/4">
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-200/80">
                    Total bookings
                  </p>
                  <p className="mt-3 font-mono text-3xl font-bold tracking-tight text-blue-300">
                    {stats.total}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/60">Across all testing types</p>
                </div>
                <div className="flex min-h-32 flex-col justify-between rounded-xl border border-indigo-500/25 bg-white/2.5 p-4 transition-colors hover:bg-white/4">
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-indigo-200/80">
                    Active
                  </p>
                  <p className="mt-3 font-mono text-3xl font-bold tracking-tight text-indigo-300">
                    {stats.active}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/60">In progress now</p>
                </div>
                <div className="flex min-h-32 flex-col justify-between rounded-xl border border-amber-500/25 bg-white/2.5 p-4 transition-colors hover:bg-white/4">
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-200/80">
                    Pending
                  </p>
                  <p className="mt-3 font-mono text-3xl font-bold tracking-tight text-amber-300">
                    {stats.pending}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/60">Awaiting approval</p>
                </div>
                <div className="flex min-h-32 flex-col justify-between rounded-xl border border-emerald-500/25 bg-white/2.5 p-4 transition-colors hover:bg-white/4">
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-200/80">
                    Completion rate
                  </p>
                  <p className="mt-3 font-mono text-3xl font-bold tracking-tight text-emerald-300">
                    {stats.completionRate}
                    <span className="ml-1 text-lg text-emerald-300/50">%</span>
                  </p>
                  <div className="mt-2 h-1 overflow-hidden bg-white/10">
                    <div className="h-full rounded-full bg-emerald-400 transition-all duration-1000" style={{ width: `${stats.completionRate}%` }}/>
                  </div>
                </div>
              </div>
            </div>

            {/* ==================================================
                SECURITY TESTING CONTROL CENTER
            =================================================== */}
            <div className="min-w-0 border-b border-white/10 p-5 sm:p-6 lg:col-span-7 lg:border-r">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
                <div>
                  <p id="security-services" className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-white/55">
                    Security Services
                  </p>
                  <h2 className="mt-1 text-xl font-semibold leading-7 tracking-tight text-white sm:text-2xl">Security Testing</h2>
                </div>
                <Link href="/security" className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black">
                    ⌸ Book Security Testing
                  </Link>
              </div>
              {loadingSecurityTesting ? (<div className="rounded-xl border border-white/10 bg-white/2.5 p-5">
                  <div className="space-y-4">
                    {[1, 2, 3].map((item) => (<div key={item} className="flex items-center justify-between gap-4">
                        <div className="space-y-2">
                          <div className="skeleton h-3 w-48"></div>
                          <div className="skeleton h-2 w-28"></div>
                        </div>
                        <div className="skeleton h-6 w-16"></div>
                      </div>))}
                  </div>
                </div>) : securityTestingBookings.length === 0 ? (<div className="flex min-h-60 flex-col items-center justify-center rounded-xl border border-white/10 bg-white/2.5 p-6 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="h-14 w-14 text-white/55" aria-label="Security Testing Booking">
                    <rect x="3" y="4" width="18" height="17" rx="2"/>
                    <path d="M16 2v4"/>
                    <path d="M8 2v4"/>
                    <path d="M3 10h18"/>
                    <path d="m8 15 2 2 5-5"/>
                  </svg>
                  <h3 className="mt-3 text-sm font-semibold leading-5 text-white">
                    No security testing booked yet
                  </h3>
                  <p className="mt-2 max-w-xl text-sm leading-5 text-white/55">
                    Request a vulnerability assessment, penetration test, or red team engagement to evaluate your organization's security.
                  </p>
                  <Link href="/security" className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black">
                    ⌸ Book Security Testing
                  </Link>
                </div>) : (<div className="max-h-80 space-y-3 overflow-y-auto pr-1">
                  {securityTestingBookings.map((booking) => {
                    const testingTypeNames: Record<string, string> = {
                        VULNERABILITY_ASSESSMENT: "Vulnerability Assessment",
                        PENETRATION_TESTING: "Penetration Testing",
                        RED_TEAM_ENGAGEMENT: "Red Team Engagement",
                    };
                    const statusLabels: Record<string, string> = {
                        PENDING: "Waiting for approval",
                        SCHEDULED: "Scheduled",
                        IN_PROGRESS: "In progress",
                        COMPLETED: "Completed",
                    };
                    const statusStyles: Record<string, {
                        dot: string;
                        pill: string;
                        glow: string;
                        bar: string;
                    }> = {
                        PENDING: {
                            dot: "bg-amber-400",
                            pill: "border-amber-500/30 bg-amber-500/10 text-amber-300",
                            glow: "shadow-[0_0_12px_-2px_rgba(251,191,36,0.5)]",
                            bar: "from-amber-500 to-amber-300",
                        },
                        SCHEDULED: {
                            dot: "bg-blue-400",
                            pill: "border-blue-500/30 bg-blue-500/10 text-blue-300",
                            glow: "shadow-[0_0_12px_-2px_rgba(96,165,250,0.5)]",
                            bar: "from-blue-500 to-blue-300",
                        },
                        IN_PROGRESS: {
                            dot: "bg-indigo-400",
                            pill: "border-indigo-500/30 bg-indigo-500/10 text-indigo-300",
                            glow: "shadow-[0_0_12px_-2px_rgba(129,140,248,0.5)]",
                            bar: "from-indigo-500 to-indigo-300",
                        },
                        COMPLETED: {
                            dot: "bg-emerald-400",
                            pill: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
                            glow: "shadow-[0_0_12px_-2px_rgba(52,211,153,0.5)]",
                            bar: "from-emerald-500 to-emerald-300",
                        },
                    };
                    const statusProgress: Record<string, number> = {
                        PENDING: 20,
                        SCHEDULED: 45,
                        IN_PROGRESS: 70,
                        COMPLETED: 100,
                    };
                    const status = statusStyles[booking.status] ?? statusStyles.PENDING;
                    const progress = statusProgress[booking.status] ?? 0;
                    const scopeLines = booking.scope.split("\n").filter(Boolean);
                    const scopePreview = scopeLines[0];
                    const scopeExtra = scopeLines.length - 1;
                    return (<div key={booking.id} className="rounded-xl border border-white/10 bg-white/2.5 p-4 transition-colors hover:border-white/20 hover:bg-white/4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="truncate text-sm font-semibold leading-5 text-white">
                                {booking.name}
                              </h3>
                              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${status.pill}`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`}/>
                                {statusLabels[booking.status] ?? booking.status}
                              </span>
                            </div>
                            <p className="mt-2 text-sm leading-6 text-white/60">
                              {testingTypeNames[booking.testingType] ?? booking.testingType}
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                              <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                                <div className={`h-full rounded-full bg-linear-to-r ${status.bar}`} style={{ width: `${progress}%` }}/>
                              </div>
                              <span className="font-mono text-xs text-white/50">
                                {progress}%
                              </span>
                            </div>
                            <div className="mt-2 grid grid-cols-2 gap-3">
                              <div>
                                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-white/55">
                                  Requested window
                                </p>
                                <p className="mt-1 truncate font-mono text-sm leading-5 text-white/70">
                                  {booking.startDate} → {booking.endDate}
                                </p>
                              </div>
                              <div className="min-w-0">
                                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-white/55">
                                  Scope
                                </p>
                                <p className="mt-1 truncate text-sm leading-5 text-white/70">
                                  {scopePreview}
                                  {scopeExtra > 0 && (<span className="ml-1 rounded border border-white/10 bg-white/5 px-1 py-0.5 font-mono text-sm leading-5 text-white/60">
                                      +{scopeExtra}
                                    </span>)}
                                </p>
                              </div>
                            </div>
                          </div>
                          {booking.status === "PENDING" && (<button type="button" onClick={() => handleDeleteBooking(booking.id)} disabled={deletingBookingId === booking.id} className="cursor-pointer inline-flex min-h-9 shrink-0 items-center justify-center gap-2 rounded-lg border border-red-500/25 bg-red-500/5 px-3 py-2 text-xs font-semibold text-red-200 transition-colors hover:border-red-500/45 hover:bg-red-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-not-allowed disabled:opacity-40">
                              {deletingBookingId === booking.id ? (<>
                                  <svg className="h-3 w-3 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                                    <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                  </svg>
                                  <span>Deleting...</span>
                                </>) : (<>
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                                    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                                    <path d="M10 11v6M14 11v6"/>
                                  </svg>
                                  <span>Delete Request</span>
                                </>)}
                            </button>)}
                        </div>
                      </div>);
                })}
                </div>)}
            </div>
            </>}

            {activeSection === "incidents" && <>

            {/* ======================================================
                INCIDENT REPORTS
            ====================================================== */}
            <div className="w-full min-w-0 lg:col-span-12">
              <IncidentReportsSection />
            </div>
            </>}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>);
}
