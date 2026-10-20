
"use client";

type IncidentSummary = {
  severity?: string | null;
  status?: string | null;
};

type SeverityName =
  | "Critical"
  | "High"
  | "Medium"
  | "Low"
  | "Unspecified";

type MetricIconName = "activity" | "open" | "resolved" | "critical";

const severityColors: Record<SeverityName, string> = {
  Critical: "#f87171",
  High: "#fb923c",
  Medium: "#fbbf24",
  Low: "#60a5fa",
  Unspecified: "#71717a",
};

const severityOrder: SeverityName[] = [
  "Critical",
  "High",
  "Medium",
  "Low",
  "Unspecified",
];

function normalizeSeverity(
  severity?: string | null
): SeverityName {
  switch (severity?.trim().toLowerCase()) {
    case "critical":
      return "Critical";
    case "high":
      return "High";
    case "medium":
      return "Medium";
    case "low":
      return "Low";
    default:
      return "Unspecified";
  }
}

function normalizeStatus(status?: string | null) {
  return (status || "OPEN").trim().toUpperCase();
}

function MetricIcon({ name }: { name: MetricIconName }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      {name === "activity" && (
        <path d="M2 12h4l3-8 6 16 3-8h4" />
      )}
      {name === "open" && (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </>
      )}
      {name === "resolved" && (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="m8 12 2.5 2.5L16 9" />
        </>
      )}
      {name === "critical" && (
        <>
          <path d="m12 3 10 18H2L12 3Z" />
          <path d="M12 9v5m0 3h.01" />
        </>
      )}
    </svg>
  );
}

const metricStyles = {
  neutral: {
    border: "border-white/10",
    icon: "bg-white/5 text-white/70",
    value: "text-white",
  },
  blue: {
    border: "border-blue-500/25",
    icon: "bg-blue-500/10 text-blue-300",
    value: "text-blue-300",
  },
  green: {
    border: "border-emerald-500/25",
    icon: "bg-emerald-500/10 text-emerald-300",
    value: "text-emerald-300",
  },
  red: {
    border: "border-red-500/25",
    icon: "bg-red-500/10 text-red-300",
    value: "text-red-300",
  },
};

export default function IncidentReportsAnalytics({
  reports,
}: {
  reports: IncidentSummary[];
}) {
  const isActive = (report: IncidentSummary) =>
    !["RESOLVED", "CLOSED"].includes(normalizeStatus(report.status));

  const stats = {
    total: reports.length,
    open: reports.filter(isActive).length,
    resolved: reports.filter(
      (report) =>
        normalizeStatus(report.status) === "RESOLVED"
    ).length,
    critical: reports.filter(
      (report) =>
        normalizeSeverity(report.severity) === "Critical" &&
        isActive(report)
    ).length,
  };

  const bySeverity = severityOrder.map((name) => ({
    name,
    value: reports.filter(
      (report) => normalizeSeverity(report.severity) === name
    ).length,
  }));

  const circumference = 2 * Math.PI * 44;
  const severityTotal = bySeverity.reduce(
    (sum, item) => sum + item.value,
    0
  );

  let progress = 0;

  const segments = bySeverity.map((item) => {
    const length =
      severityTotal > 0
        ? (item.value / severityTotal) * circumference
        : 0;

    const segment = {
      ...item,
      length,
      offset: progress,
    };

    progress += length;
    return segment;
  });

  const cards: {
    label: string;
    value: number;
    icon: MetricIconName;
    tone: keyof typeof metricStyles;
    hint?: string;
  }[] = [
    {
      label: "Total Incidents",
      value: stats.total,
      icon: "activity",
      tone: "neutral",
    },
    {
      label: "Open",
      value: stats.open,
      icon: "open",
      tone: "blue",
    },
    {
      label: "Resolved",
      value: stats.resolved,
      icon: "resolved",
      tone: "green",
    },
    {
      label: "Critical",
      value: stats.critical,
      icon: "critical",
      tone: "red",
      hint: "Active",
    },
  ];

  return (
    <section
        aria-label="Incident analytics"
        className="mb-6 grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-12"
        >
        <div className="min-w-0 border border-white/10 bg-white/2.5 p-4 lg:col-span-7">
            <div className="border-b border-white/10 pb-3">
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/35">
                Incident Analytics
            </p>
            <h3 className="mt-1 text-sm font-semibold text-white">
                Severity Distribution
            </h3>
            </div>

            <div className="relative mx-auto mt-2 h-55 w-full max-w-70">
            <svg
                viewBox="0 0 120 120"
                className="h-full w-full"
                role="img"
                aria-label="Donut chart showing incidents by severity"
            >
                <circle
                cx="60"
                cy="60"
                r="44"
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="12"
                />

                <g transform="rotate(-90 60 60)">
                {segments.map((segment) =>
                    segment.value > 0 ? (
                    <circle
                        key={segment.name}
                        cx="60"
                        cy="60"
                        r="44"
                        fill="none"
                        stroke={severityColors[segment.name]}
                        strokeWidth="12"
                        strokeDasharray={`${segment.length} ${
                        circumference - segment.length
                        }`}
                        strokeDashoffset={-segment.offset}
                    />
                    ) : null
                )}
                </g>
            </svg>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-3xl font-bold text-white">
                {stats.total}
                </span>
                <span className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/40">
                Incidents
                </span>
            </div>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-3 border-t border-white/10 pt-4 sm:grid-cols-4">
            {bySeverity
                .filter((item) => item.name !== "Unspecified" || item.value > 0)
                .map((item) => (
                <div key={item.name} className="flex min-w-0 items-center gap-2">
                    <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{
                        backgroundColor: severityColors[item.name],
                    }}
                    />

                    <span className="truncate text-[11px] text-white/55">
                    {item.name}
                    </span>

                    <span className="ml-auto font-mono text-xs text-white/80">
                    {item.value}
                    </span>
                </div>
                ))}
            </div>
        </div>

        <div className="min-w-0 lg:col-span-5">
            <div className="grid h-full grid-cols-1 gap-3 sm:grid-cols-2">
            {cards.map((card) => {
                const style = metricStyles[card.tone];

                return (
                <article
                    key={card.label}
                    className={`relative flex min-h-36 min-w-0 flex-col justify-between overflow-hidden border bg-white/2.5 p-4 ${style.border}`}
                >
                    <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-medium text-white/45">
                        {card.label}
                    </p>

                    <span className={`shrink-0 p-2 ${style.icon}`}>
                        <MetricIcon name={card.icon} />
                    </span>
                    </div>

                    <div className="mt-3 flex items-end justify-between gap-2">
                    <p
                        className={`font-mono text-3xl font-bold tracking-tight ${style.value}`}
                    >
                        {card.value}
                    </p>

                    {card.hint && (
                        <span className="mb-1 inline-flex items-center gap-1.5 text-[10px] text-red-300/70">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                        {card.hint}
                        </span>
                    )}
                    </div>
                </article>
                );
            })}
            </div>
        </div>
    </section>
  );
}
