"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { deleteReport } from "@/actions/reports";
import IncidentReportsAnalytics from "./IncidentReportsAnalytics";

interface EvidenceFile {
  name: string;
  size: number;
  type: string;
}

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
  evidenceFiles: EvidenceFile[] | null;
  status: string;
  assignedAnalyst: string | null;
}

type StatusFilter =
  | "all"
  | "open"
  | "investigating"
  | "contained"
  | "recovering"
  | "resolved";

type DateRange = "all" | "7d" | "30d" | "90d";

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

const statusTabs: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "investigating", label: "Investigating" },
  { value: "contained", label: "Contained" },
  { value: "recovering", label: "Recovering" },
  { value: "resolved", label: "Resolved" },
];

const severityStyles: Record<string, string> = {
  Critical: "border-red-500/30 bg-red-500/10 text-red-300",
  High: "border-orange-500/30 bg-orange-500/10 text-orange-300",
  Medium: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  Low: "border-white/15 bg-white/[0.03] text-white/60",
};

const statusStyles: Record<string, string> = {
  OPEN: "border-white/15 bg-white/[0.04] text-white/70",
  INVESTIGATING: "border-blue-500/30 bg-blue-500/10 text-blue-300",
  CONTAINED: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  RECOVERING: "border-indigo-500/30 bg-indigo-500/10 text-indigo-300",
  RESOLVED: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
};

const selectClass =
  "w-full rounded-lg border border-white/10 bg-[#101010] px-3 py-2.5 text-sm text-white outline-none transition focus:border-white/30";

const searchIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-4-4" />
  </svg>
);

function formatSize(bytes: number) {

  if (bytes < 1024) return `${bytes} B`;

  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;

  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;

}

function formatDate(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString();
}

function displayStatus(status?: string | null) {
  return (status || "OPEN").replaceAll("_", " ");
}

export default function IncidentReportsSection() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchReports() {
      try {
        const response = await fetch("/api/reports", {
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            response.status === 401
              ? "Please log in to view your incident reports."
              : "Failed to load incident reports."
          );
        }

        const data = await response.json();

        const result: Report[] = Array.isArray(data)
          ? data
          : data.reports ?? [];

        if (!cancelled) {
          setReports(result);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load incident reports."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchReports();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredReports = useMemo(() => {
    const query = search.trim().toLowerCase();

    return reports.filter((report) => {
      const currentStatus = (
        report.status || "OPEN"
      ).toLowerCase();

      if (
        statusFilter !== "all" &&
        currentStatus !== statusFilter
      ) {
        return false;
      }

      if (
        severityFilter !== "all" &&
        report.severity !== severityFilter
      ) {
        return false;
      }

      if (
        typeFilter !== "all" &&
        report.incidentType !== typeFilter
      ) {
        return false;
      }

      if (query) {
        const searchable = [
          String(report.id),
          report.name,
          report.affectedSystem ?? "",
          report.assignedAnalyst ?? "",
          report.incidentType ?? "",
          report.description,
        ]
          .join(" ")
          .toLowerCase();

        if (!searchable.includes(query)) {
          return false;
        }
      }

      if (dateRange !== "all") {
        const days =
          dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : 90;

        const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
        const timestamp = new Date(
          report.reportedAt || report.createdAt
        ).getTime();

        if (Number.isNaN(timestamp) || timestamp < cutoff) {
          return false;
        }
      }

      return true;
    });
  }, [
    reports,
    statusFilter,
    severityFilter,
    typeFilter,
    dateRange,
    search,
  ]);

  function resetFilters() {
    setStatusFilter("all");
    setSeverityFilter("all");
    setTypeFilter("all");
    setDateRange("all");
    setSearch("");
  }

  async function handleDelete(report: Report) {
    const confirmed = window.confirm(
      `Delete incident report "${report.name}"? This cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(report.id);
    setError("");

    try {
      const result = await deleteReport(report.id);

      if (!result.success) {
        setError(result.error || "Failed to delete incident report.");
        return;
      }

      setReports((previous) =>
        previous.filter((item) => item.id !== report.id)
      );

      setSelectedReport((previous) =>
        previous?.id === report.id ? null : previous
      );
    } catch (err) {
      console.error("Delete incident report error:", err);
      setError("Failed to delete incident report.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section
      id="incident-reports"
      className="p-5 scroll-mt-24"
      aria-labelledby="incident-reports-title"
    >
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-white/55">
            Security Incidents
          </p>

          <h2
            id="incident-reports-title"
            className="text-2xl font-semibold tracking-tight"
          >
            Your Incident Reports
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
            View, filter, and manage all reported incidents.
          </p>
        </div>

        <Link
          href="/dashboard/reports/new"
          className="btn w-fit bg-white text-black hover:bg-white/90"
        >
          + Create Incident Report
        </Link>
      </div>

      <IncidentReportsAnalytics reports={reports} />

      {/* Filters */}
      <div className="border border-white/10 bg-white/2 p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {statusTabs.map((tab) => {
            const active = statusFilter === tab.value;

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setStatusFilter(tab.value)}
                aria-pressed={active}
                className={`cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-white text-black"
                    : "text-white/45 hover:bg-white/6 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <label className="relative block xl:col-span-1">
            <span className="sr-only">Search incident reports</span>

            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
              {searchIcon}
            </span>

            <input
              type="search"
              placeholder="Search ID, title, asset, analyst..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${selectClass} pl-9`}
            />
          </label>

          <label>
            <span className="sr-only">Filter by severity</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className={selectClass}
            >
              <option value="all">All severities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </label>

          <label>
            <span className="sr-only">Filter by incident type</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className={selectClass}
            >
              <option value="all">All types</option>

              {incidentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="sr-only">Filter by date</span>
            <select
              value={dateRange}
              onChange={(e) =>
                setDateRange(e.target.value as DateRange)
              }
              className={selectClass}
            >
              <option value="all">All time</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs text-white/40">
          <p>
            Showing{" "}
            <span className="font-semibold text-white">
              {filteredReports.length}
            </span>{" "}
            of {reports.length} incidents
          </p>

          <button
            type="button"
            onClick={resetFilters}
            className="cursor-pointer transition hover:text-white"
          >
            Reset filters
          </button>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-4 border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300"
        >
          {error}
        </div>
      )}

      {/* Incident table */}
      <div className="mt-4 overflow-hidden border border-white/10 bg-white/2">
        {loading ? (
          <div className="space-y-4 p-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex animate-pulse items-center gap-5"
              >
                <div className="h-4 w-10 rounded bg-white/10" />
                <div className="h-4 flex-1 rounded bg-white/10" />
                <div className="h-4 w-24 rounded bg-white/10" />
              </div>
            ))}
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="flex justify-center text-white/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-14 w-14 text-white/20"
                aria-hidden="true"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <line x1="10" y1="9" x2="8" y2="9" />
              </svg>

            </div>

            <h3 className="mt-4 text-base font-semibold">
              {reports.length === 0
                ? "No incident reports yet"
                : "No incidents match your filters"}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/40">
              {reports.length === 0
                ? "Create your first incident report to start documenting and tracking security incidents."
                : "Try adjusting or resetting the filters above."}
            </p>

            {reports.length === 0 ? (
              <Link
                href="/dashboard/reports/new"
                className="btn mt-5 bg-white text-black hover:bg-white/90"
              >
                + Create Incident Report
              </Link>
            ) : (
              <button
                type="button"
                onClick={resetFilters}
                className="cursor-pointer mt-5 text-sm text-white/70 underline underline-offset-4 hover:text-white"
              >
                Reset filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-262.5 border-collapse text-left">
              <thead>
                <tr className="border-b border-white/10 bg-white/3">
                  {[
                    "Incident ID",
                    "Title",
                    "Type",
                    "Severity",
                    "Affected Asset",
                    "Status",
                    "Reported",
                    "Analyst",
                    "Action",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35 first:pl-6 last:pr-6"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredReports.map((report) => {
                  const status = (report.status || "OPEN").toUpperCase();

                  return (
                    <tr
                      key={report.id}
                      className="border-b border-white/6 transition-colors last:border-b-0 hover:bg-white/2.5"
                    >
                      <td className="whitespace-nowrap px-4 py-4 pl-6 font-mono text-xs text-white/40">
                        INC-{String(report.id).padStart(4, "0")}
                      </td>

                      <td className="max-w-57.5 px-4 py-4">
                        <p className="truncate text-sm font-medium text-white/85">
                          {report.name}
                        </p>
                        <p className="mt-1 line-clamp-1 text-xs text-white/35">
                          {report.description}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-sm text-white/55">
                        {report.incidentType || "—"}
                      </td>

                      <td className="px-4 py-4">
                        {report.severity ? (
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${
                              severityStyles[report.severity] ??
                              severityStyles.Low
                            }`}
                          >
                            {report.severity}
                          </span>
                        ) : (
                          <span className="text-white/25">—</span>
                        )}
                      </td>

                      <td className="max-w-45 truncate px-4 py-4 text-sm text-white/50">
                        {report.affectedSystem || "—"}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide ${
                            statusStyles[status] ?? statusStyles.OPEN
                          }`}
                        >
                          {displayStatus(status)}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-xs text-white/45">
                        {formatDate(report.reportedAt || report.createdAt)}
                      </td>

                      <td className="px-4 py-4 text-sm text-white/45">
                        {report.assignedAnalyst || (
                          <span className="italic text-white/25">
                            Unassigned
                          </span>
                        )}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 pr-6">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setSelectedReport(report)}
                            aria-label="View report"
                            title="View report"
                            className="cursor-pointer text-white/80 transition hover:text-white hover:scale-110 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={1.5}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                              className="h-4 w-4"
                            >
                              <path d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </button>

                          <Link
                            href={`/dashboard/reports/${report.id}/edit`}
                            className="text-xs text-white/45 transition hover:text-white"
                          >
                            Edit
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDelete(report)}
                            disabled={deletingId === report.id}
                            className="cursor-pointer text-xs text-red-300/70 transition hover:text-red-300 disabled:opacity-40"
                          >
                            {deletingId === report.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Incident detail modal */}
      {selectedReport && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedReport(null);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setSelectedReport(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="incident-detail-title"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#0c0c0c] p-6 shadow-2xl sm:p-8"
          >
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/35">
                  Incident INC-
                  {String(selectedReport.id).padStart(4, "0")}
                </p>

                <h3
                  id="incident-detail-title"
                  className="mt-2 text-2xl font-semibold"
                >
                  {selectedReport.name}
                </h3>

                <p className="mt-2 text-sm text-white/40">
                  {selectedReport.incidentType || "Incident"} ·{" "}
                  {displayStatus(selectedReport.status)}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                ["Severity", selectedReport.severity || "Not specified"],
                ["Affected system", selectedReport.affectedSystem || "Not specified"],
                ["Department", selectedReport.affectedDepartment || "Not specified"],
                [
                  "Affected users",
                  selectedReport.affectedUsers == null
                    ? "Not specified"
                    : String(selectedReport.affectedUsers),
                ],
                ["Reporter", selectedReport.reporter || "Not specified"],
                ["Assigned analyst", selectedReport.assignedAnalyst || "Unassigned"],
                ["Reported", formatDate(selectedReport.reportedAt || selectedReport.createdAt)],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="border border-white/8 bg-white/2 p-4"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
                    {label}
                  </p>
                  <p className="mt-2 wrap-break-word text-sm text-white/80">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                Description
              </p>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white/70">
                {selectedReport.description}
              </p>
            </div>

            {selectedReport.evidenceFiles &&
              selectedReport.evidenceFiles.length > 0 && (
                <div className="mt-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                    Evidence references
                  </p>

                  <div className="mt-3 space-y-2">
                    {selectedReport.evidenceFiles.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="flex items-center justify-between gap-4 border border-white/10 p-3"
                      >
                        <span className="truncate text-sm text-white/70">
                          {file.name}
                        </span>

                        <span className="shrink-0 text-xs text-white/35">
                          {formatSize(file.size)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="btn btn-ghost text-white hover:bg-white/10"
              >
                Close
              </button>

              <Link
                href={`/dashboard/reports/${selectedReport.id}/edit`}
                className="btn bg-white text-black hover:bg-white/90"
              >
                Edit Incident →
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
