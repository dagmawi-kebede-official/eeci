"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { use } from "react";
import IncidentReportForm, {
  type IncidentReportData,
} from "@/components/IncidentReportForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditReportPage({ params }: PageProps) {
  const { id } = use(params);
  const reportId = Number(id);

  const [report, setReport] = useState<IncidentReportData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!Number.isInteger(reportId) || reportId <= 0) {
      setError("Invalid incident report ID.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchReport() {
      try {
        const response = await fetch(`/api/reports/${reportId}`, {
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Incident report not found.");
          }

          if (response.status === 403) {
            throw new Error("You do not have permission to edit this report.");
          }

          if (response.status === 401) {
            throw new Error("Please log in to edit this report.");
          }

          throw new Error("Failed to load incident report.");
        }

        const data = await response.json();

        if (!data.report) {
          throw new Error("Incident report not found.");
        }

        if (!cancelled) {
          setReport(data.report as IncidentReportData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load incident report."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchReport();

    return () => {
      cancelled = true;
    };
  }, [reportId]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <div role="alert" className="alert alert-error">
          <span>{error || "Incident report not found."}</span>
        </div>

        <Link href="/dashboard#incident-reports" className="btn btn-ghost mt-4">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <IncidentReportForm
      key={report.id}
      mode="edit"
      reportId={report.id}
      initialData={report}
    />
  );
}
