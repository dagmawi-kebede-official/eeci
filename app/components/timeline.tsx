"use client";

import { useEffect } from "react";

export default function Timeline() {
  useEffect(() => {
    const items = document.querySelectorAll(".timeline-item");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("timeline-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden px-6 py-28 text-white sm:py-40">
      {/* Background ambient mesh */}
      <div className="absolute top-1/4 left-0 -z-10 h-125 w-175 rounded-full bg-blue-500/5 blur-[160px]" />
      <div className="absolute bottom-0 right-0 -z-10 h-125 w-175 rounded-full bg-indigo-500/5 blur-[160px]" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="mx-auto max-w-7xl">
        {/* Centered Header */}
        <div className="mb-24 flex flex-col items-center text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-zinc-500">
            The roadmap
          </p>
          <h2 className="text-5xl font-black tracking-tighter sm:text-7xl md:text-8xl bg-linear-to-b from-white via-zinc-200 to-zinc-600 bg-clip-text text-transparent leading-[0.9]">
            Why Timing Matters
          </h2>
        </div>

        <ul className="timeline timeline-snap-icon timeline-vertical max-md:timeline-compact">
          {/* Item 1 */}
          <li className="timeline-item">
            <div className="timeline-middle">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 transition-all duration-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  className="h-4 w-4 fill-white"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <div className="timeline-start mb-10 md:text-end w-full max-w-150">
              <time className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                Now is your time!
              </time>
              <div className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                Why Us?
              </div>
              <p className="mt-4 text-base leading-relaxed text-zinc-400">
                Most Ethiopian organizations lack dedicated cybersecurity teams, resulting in limited security monitoring, incident response, and risk management capabilities. Our platform could be the best answer you were looking for.
              </p>
            </div>

            <hr className="border-zinc-800" />
          </li>

          {/* Item 2 */}
          <li className="timeline-item">
            <hr className="border-zinc-800" />

            <div className="timeline-middle">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  className="h-4 w-4 fill-white"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <div className="timeline-end md:mb-10 w-full max-w-150">
              <time className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                2026
              </time>
              <div className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                Ethiopian Cybersecurity Proclamation
              </div>
              <p className="mt-4 text-base leading-relaxed text-zinc-400">
                Given Ethiopia's evolving cybersecurity regulation, the new Critical Infrastructure Cybersecurity Proclamation No. 1426/2026 covers sectors including finance, ICT, healthcare, education, energy, transport, agriculture, trade and government services, and introduces obligations around risk assessment, cybersecurity audits, incident response, supply-chain security and SOCs. Our platform provides these services.
              </p>
            </div>

            <hr className="border-zinc-800" />
          </li>

          {/* Item 3 */}
          <li className="timeline-item">
            <hr className="border-zinc-800" />

            <div className="timeline-middle">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  className="h-4 w-4 fill-white"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <div className="timeline-start mb-10 md:text-end w-full max-w-150">
              <time className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                2030
              </time>
              <div className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                Digital Ethiopia 2030
              </div>
              <p className="mt-4 text-base leading-relaxed text-zinc-400">
                Ethiopia's Digital Ethiopia 2030 strategy also explicitly identifies cybersecurity data risks and institutional capacity gaps as challenges. Our platform can close that gap with our dedicated learning platform and security products.
              </p>
            </div>

            <hr className="border-zinc-800" />
          </li>

          {/* Item 4 */}
          <li className="timeline-item">
            <hr className="border-zinc-800" />

            <div className="timeline-middle">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  className="h-4 w-4 fill-white"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <div className="timeline-end md:mb-10 w-full max-w-150">
              <time className="font-mono text-4xl font-black text-white">
                ∞
              </time>
              <div className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                Future Proof!
              </div>
              <p className="mt-4 text-base leading-relaxed text-zinc-400">
                Understand your organization's cyber risk, respond to threats, and continuously improve your organizational security posture with us.
              </p>
            </div>

            <hr className="border-zinc-800" />
          </li>
        </ul>
      </div>

      <style jsx>{`
        .timeline-item {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 1200ms ease, transform 1200ms ease;
        }

        .timeline-item.timeline-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .timeline-item.timeline-visible .timeline-middle > div {
          box-shadow: 0 0 20px -5px rgba(255, 255, 255, 0.15);
        }
      `}</style>
    </section>
  );
}
