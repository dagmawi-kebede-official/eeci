"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  {
    value: 95,
    label: "Compliance Readiness",
    description:
      "Keep your organization prepared for cybersecurity requirements.",
  },
  {
    value: 90,
    label: "Security Visibility",
    description:
      "Gain clearer visibility into your organization's security posture.",
  },
  {
    value: 85,
    label: "Security Improvement",
    description:
      "Continuously strengthen your organization's security over time.",
  },
];

export default function SecurityStats() {
  const sectionRef = useRef<HTMLElement>(null);
  const [started, setStarted] = useState(false);
  const [counts, setCounts] = useState(stats.map(() => 0));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      {
        threshold: 0.25,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;

    const duration = 1800;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);

      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setCounts(
        stats.map((stat) => Math.round(stat.value * easedProgress))
      );

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [started]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden px-6 py-28 text-white sm:py-60"
    >
      {/* Background ambient mesh */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-125 w-175 rounded-full bg-blue-500/5 blur-[160px]" />
      <div className="absolute bottom-0 right-1/4 -z-10 h-125 w-175 rounded-full bg-indigo-500/5 blur-[160px]" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Centered Header */}
        <div className="mb-15 flex flex-col items-center text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-zinc-500">
            Security Impact
          </p>

          <h2 className="text-5xl font-black tracking-tighter sm:text-7xl md:text-8xl bg-linear-to-b from-white via-zinc-200 to-zinc-600 bg-clip-text text-transparent leading-[0.9] max-w-6xl">
            Harden Your Defenses
          </h2>

          <p className="mt-8 max-w-2xl text-base leading-relaxed text-zinc-400 md:text-lg">
            Your organization&apos;s security should continuously improve.
            Our platform helps you understand where you stand, identify
            risks, and take meaningful action.
          </p>
        </div>

        {/* Statistics */}
        <div className="space-y-0 mx-50">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`
                group relative overflow-hidden
                border-y border-zinc-800
                py-12 md:py-10
                transition-all duration-1000 ease-out
                hover:border-zinc-600
                ${
                  started
                    ? "translate-x-0 opacity-100"
                    : "translate-x-12 opacity-0"
                }
              `}
              style={{
                transitionDelay: `${index * 200}ms`,
              }}
            >
              {/* Horizontal layout */}
              <div className="grid items-center gap-8 md:grid-cols-[280px_1fr] lg:grid-cols-[340px_1fr]">
                {/* Percentage */}
                <div className="relative">
                  <div className="flex items-baseline">
                    <span className="font-mono text-9xl font-black tracking-tighter md:text-8xl bg-linear-to-b from-white to-zinc-500 bg-clip-text text-transparent transition-transform duration-700 group-hover:scale-105 origin-left inline-block">
                      {counts[index]}
                    </span>

                    <span className="ml-2 font-mono text-3xl font-bold text-zinc-600">
                      %
                    </span>
                  </div>

                  {/* Progress indicator */}
                  <div className="mt-6 h-0.5 w-full max-w-64 bg-zinc-800">
                    <div
                      className="h-0.5 bg-linear-to-r from-zinc-400 to-white transition-all duration-100"
                      style={{
                        width: `${counts[index]}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Information */}
                <div className="relative">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="font-mono text-[10px] font-bold tracking-[0.3em] text-zinc-600">
                      0{index + 1}
                    </span>

                    <span className="h-px w-8 bg-zinc-700" />

                    <span className="font-mono text-[10px] font-bold tracking-[0.3em] text-zinc-600">
                      SECURITY METRIC
                    </span>
                  </div>

                  <h3 className="text-3xl font-black tracking-tight sm:text-4xl">
                    {stat.label}
                  </h3>

                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-400 group-hover:text-zinc-300 transition-colors duration-500">
                    {stat.description}
                  </p>
                </div>
              </div>

              {/* Subtle hover sweep */}
              <div className="pointer-events-none absolute inset-y-0 -left-full w-1/3 bg-linear-to-r from-transparent via-white/5 to-transparent transition-all duration-1000 group-hover:left-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
