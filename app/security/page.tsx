"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { createSecurityTestingBooking } from "@/actions/security-testing";

type TestingType =
  | "VULNERABILITY_ASSESSMENT"
  | "PENETRATION_TESTING"
  | "RED_TEAM_ENGAGEMENT";

const TESTING_TYPES: Record<
  TestingType,
  {
    number: string;
    label: string;
    description: string;
    duration: string;
    term: string;
    price: string;
    priceUnit: string;
    points: string[];
  }
> = {
  VULNERABILITY_ASSESSMENT: {
    number: "01",
    label: "VULNERABILITY ASSESSMENT",
    description:
      "Automated scanning to detect known security weaknesses in your systems.",
    duration: "Usually 1–3 days",
    term: "Discover",
    price: "$1,500",
    priceUnit: "starting price · per engagement",
    points: [
      "Identify known vulnerabilities",
      "Review exposed services",
      "Prioritize weaknesses",
      "Security-focused reporting",
    ],
  },

  PENETRATION_TESTING: {
    number: "02",
    label: "PENETRATION TESTING",
    description:
      "Simulated attacks to find and validate exploitable security flaws.",
    duration: "Usually 1–2 weeks",
    term: "Validate",
    price: "$5,000",
    priceUnit: "starting price · per engagement",
    points: [
      "Real attack techniques",
      "Application and infrastructure testing",
      "Validate security controls",
      "Detailed security findings",
    ],
  },

  RED_TEAM_ENGAGEMENT: {
    number: "03",
    label: "RED-TEAM ENGAGEMENT",
    description:
      "A controlled simulation of a real-world attack across your people, processes, applications, and technology.",
    duration: "Usually 3–6 weeks",
    term: "Simulate",
    price: "$15,000",
    priceUnit: "starting price · per engagement",
    points: [
      "Multi-layer attack simulation",
      "People and process testing",
      "Physical and technical scenarios",
      "Management-approved engagement",
    ],
  },
};

const BASE_CHECKS = [
  "I own this system, or I have written permission from the owner to test it.",
  "The scope below lists every system that may be tested, and nothing else.",
  "Our team knows the test window and will not treat it as a real attack.",
];

const RED_CHECKS = [
  "Senior management has approved social engineering and physical access attempts.",
  "An emergency contact is available 24/7 to stop the test if something goes wrong.",
];

function RequestDialog({
  initial,
  onClose,
  onSuccess,
}: {
  initial: TestingType;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { user } = useAuth();

  const [kind, setKind] = useState<TestingType>(initial);
  const [name, setName] = useState("");
  const [scope, setScope] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const checks =
    kind === "RED_TEAM_ENGAGEMENT"
      ? [...BASE_CHECKS, ...RED_CHECKS]
      : BASE_CHECKS;

  const allChecked = checks.every((check) => checked[check]);

  const valid =
    name.trim() &&
    scope.trim() &&
    startDate &&
    endDate &&
    endDate >= startDate &&
    allChecked &&
    user;

  const inputClass =
    "mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-white/30 focus:bg-white/[0.06]";

  const submit = async () => {
    if (!valid || !user) return;

    setSubmitting(true);
    setError("");

    const result = await createSecurityTestingBooking({
      testingType: kind,
      name: name.trim(),
      scope: scope.trim(),
      startDate,
      endDate,
      termsAccepted: true,
    });

    if (!result.success) {
      setError(result.error ?? "Failed to submit security testing request.");
      setSubmitting(false);
      return;
    }

    onSuccess();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="security-request-title"
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-white/10 bg-[#0b0b0b] p-6 text-white shadow-2xl sm:rounded-3xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">
              Security Testing
            </p>

            <h2
              id="security-request-title"
              className="mt-2 text-2xl font-semibold"
            >
              Request a security test
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/40">
              Provide the engagement details below. All requests are reviewed
              before testing begins.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="cursor-pointer rounded-full border border-white/10 p-2 text-white/50 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-5 w-5"
            >
              <path d="m6 6 12 12" />
              <path d="m18 6-12 12" />
            </svg>
          </button>
        </div>

        <div className="mt-8 space-y-6">
          <label className="block text-sm font-medium text-white/80">
            Test type

            <select
              className={inputClass}
              value={kind}
              onChange={(e) => {
                setKind(e.target.value as TestingType);
                setChecked({});
              }}
            >
              {(Object.keys(TESTING_TYPES) as TestingType[]).map((type) => (
                <option
                  key={type}
                  value={type}
                  className="bg-black text-white"
                >
                  {TESTING_TYPES[type].label}
                </option>
              ))}
            </select>

            <span className="mt-2 block text-xs leading-5 text-white/30">
              {TESTING_TYPES[kind].description}{" "}
              {TESTING_TYPES[kind].duration}.
            </span>
          </label>

          <label className="block text-sm font-medium text-white/80">
            Name this test

            <input
              className={inputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Customer portal"
            />
          </label>

          <label className="block text-sm font-medium text-white/80">
            What can we test?

            <textarea
              className={inputClass}
              rows={4}
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              placeholder={"portal.example.et\n10.20.0.0/24"}
            />

            <span className="mt-2 block text-xs text-white/25">
              List every approved system, application, domain, IP range, or
              other asset that may be tested.
            </span>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-white/80">
              Start date

              <input
                type="date"
                className={inputClass}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </label>

            <label className="block text-sm font-medium text-white/80">
              End date

              <input
                type="date"
                className={inputClass}
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </label>
          </div>

          <fieldset className="rounded-2xl border border-white/10 bg-white/2 p-5">
            <legend className="px-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
              Authorization
            </legend>

            <div className="mt-2 space-y-4">
              {checks.map((check) => (
                <label
                  key={check}
                  className="flex items-start gap-3 text-sm leading-6 text-white/60"
                >
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 shrink-0 accent-white"
                    checked={!!checked[check]}
                    onChange={(e) =>
                      setChecked({
                        ...checked,
                        [check]: e.target.checked,
                      })
                    }
                  />

                  <span>{check}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
            >
              {error}
            </p>
          )}
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="cursor-pointer rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-white/60 transition hover:bg-white/5 hover:text-white disabled:opacity-40"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={submit}
            disabled={!valid || submitting}
            className="cursor-pointer rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/30"
          >
            {submitting ? "Submitting..." : "Request Security Testing →"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SecurityTesting() {
  const router = useRouter();

  const [dialog, setDialog] = useState<TestingType | null>(null);

  return (
    <main className="min-h-screen bg-black text-white mb-40 mt-10">
      <div className="flex flex-col items-center mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <header className="max-w-3xl text-center">
          <p className="font-mono text-lg uppercase tracking-[0.3em] text-white/30">
            Security Services
          </p>
          
          <h1 className="text-5xl font-black tracking-tighter sm:text-7xl md:text-8xl bg-linear-to-b from-white via-zinc-200 to-zinc-600 bg-clip-text text-transparent leading-[0.9]">
              Security Testing
          </h1>

          <p className="max-w-4xl text-lg leading-8 text-white/40">
            Find weak spots before attackers do. Request a test, follow its progress and fix what we find.
          </p>
        </header>

        <section aria-labelledby="choose-test" className="mt-25">

          <div className="grid gap-5 lg:grid-cols-3">
            {(Object.keys(TESTING_TYPES) as TestingType[]).map((type) => {
              const test = TESTING_TYPES[type];

              return (
                <article
                  key={type}
                  className={`group relative flex min-h-175 flex-col overflow-hidden rounded-3xl border p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                    type === "VULNERABILITY_ASSESSMENT"
                      ? "border-blue-400/25 bg-linear-to-b from-blue-500/13 via-blue-950/20 to-[#080a10] hover:border-blue-300/50 hover:shadow-blue-950/40"
                      : type === "PENETRATION_TESTING"
                      ? "border-purple-400/25 bg-linear-to-b from-purple-500/[0.14] via-purple-950/20 to-[#0b0810] hover:border-purple-300/50 hover:shadow-purple-950/40"
                      : "border-red-400/25 bg-linear-to-b from-red-500/[0.14] via-red-950/20 to-[#100809] hover:border-red-300/50 hover:shadow-red-950/40"
                  }`}
                >
                  <div className="flex mt-5 text-center items-start justify-between gap-4">
                    <div>
                      <p className={`font-mono text-xs font-semibold tracking-[0.28em] ${
                        type === "VULNERABILITY_ASSESSMENT"
                          ? "text-blue-300"
                          : type === "PENETRATION_TESTING"
                          ? "text-purple-300"
                          : "text-red-300"
                      }`}>

                      <span className="relative inline-block text-4xl tracking-tight">
                        <span className="relative z-10">{test.label}</span>

                        <span
                          aria-hidden
                          className="pointer-events-none absolute inset-0 z-20 bg-linear-to-r from-transparent via-white/80 to-transparent bg-size-[200%_100%] bg-clip-text text-transparent mix-blend-overlay animate-[sheen_4s_linear_infinite]"
                        >
                          {test.label}
                        </span>

                        <style>{`
                          @keyframes sheen {
                            0%   { background-position: 200% center; }
                            100% { background-position: -200% center; }
                          }
                        `}</style>
                      </span>
                      
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto pt-10">
                    <div className="mb-20 border-t border-white/10 pt-5">
                      <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/35">
                        Estimated duration
                      </p>
                      <p className="mt-2 text-sm text-white/75">{test.duration}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDialog(type)}
                      className={`w-full cursor-pointer rounded-full px-4 py-3 text-lg font-semibold text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black ${
                        type === "VULNERABILITY_ASSESSMENT"
                          ? "bg-blue-600 hover:bg-blue-500 focus:ring-blue-400"
                          : type === "PENETRATION_TESTING"
                          ? "bg-purple-600 hover:bg-purple-500 focus:ring-purple-400"
                          : "bg-red-600 hover:bg-red-500 focus:ring-red-400"
                      }`}
                    >
                      Get Test
                    </button>
                  </div>

                  <div className="mt-15">
                    <h3 className="text-2xl font-semibold leading-tight tracking-tight">
                      {test.term}
                    </h3>
                    
                  </div>

                  <div className="mt-10 mb-50 space-y-8">
                    {test.points.map((point, index) => {
                      const symbols =
                        type === "VULNERABILITY_ASSESSMENT"
                          ? ["⌕", "↗", "◆", "≋"]
                          : type === "PENETRATION_TESTING"
                          ? ["↗", "▦", "◎", "≡"]
                          : ["◈", "♙", "⌁", "◉"];
                      return (
                        <div
                          key={point}
                          className="flex items-start gap-3 text-sm leading-6 text-white/70"
                        >
                          <span
                            aria-hidden="true"
                            className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center text-base ${
                              type === "VULNERABILITY_ASSESSMENT"
                                ? "text-blue-300"
                                : type === "PENETRATION_TESTING"
                                ? "text-purple-300"
                                : "text-red-300"
                            }`}
                          >
                            {symbols[index]}
                          </span>
                          <span>{point}</span>
                        </div>
                      );
                    })}
                  </div>

                  <p className="mt-15 min-h-28 text-sm leading-7 text-white/60">
                      {test.description}
                    </p>

                  
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-16 w-full max-w-4xl text-center sm:px-10 sm:py-10" aria-labelledby="security-services-footer">
          
          <h2 id="security-services-footer" className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Build confidence before an attacker tests your defenses.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/55">
            From finding known weaknesses to simulating a determined adversary, choose the level of testing that fits your risk. Every engagement is scoped with you, authorized in advance, and delivered with actionable findings to help strengthen your security.
          </p>
        </section>
      </div>

      {dialog && (
        <RequestDialog
          initial={dialog}
          onClose={() => setDialog(null)}
          onSuccess={() => router.replace("/dashboard/#security-services")}
        />
      )}
    </main>
  );
}
