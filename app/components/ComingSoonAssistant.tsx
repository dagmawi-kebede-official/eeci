
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Sparkles, X } from "lucide-react";

export default function ComingSoonAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      {/* Assistant Window */}
      {isOpen && (
        <section
          id="eeci-assistant-panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby="eeci-assistant-title"
          className="fixed right-4 bottom-24 z-60 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl shadow-black/50 sm:right-6"
        >
          {/* Header */}
          <div className="relative border-b border-white/10 bg-linear-to-br from-white/6 via-zinc-950 to-zinc-950 p-5">
            <div className="flex items-center justify-between gap-4">
              <Image
                src="/eeci-logo-white.svg"
                alt="EECI"
                width={100}
                height={20}
                className="h-auto w-24"
              />

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close AI assistant"
                className="cursor-pointer flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-7 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white">
                <Sparkles className="h-5 w-5" />
              </div>

              <div>
                <h2
                  id="eeci-assistant-title"
                  className="text-lg font-semibold text-white"
                >
                  EECI AI Assistant
                </h2>

                <p className="text-xs text-zinc-500">
                  Your future security companion
                </p>
              </div>
            </div>
          </div>

          {/* Coming Soon Message */}
          <div className="p-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/4 px-3 py-1.5 text-xs font-semibold text-zinc-200">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              Coming soon
            </span>

            <p className="mt-4 text-sm leading-7 text-zinc-300">
              We&apos;re working on an intelligent assistant to help you
              understand security findings, explore compliance requirements,
              and discover practical ways to strengthen your organization&apos;s
              security.
            </p>

            <p className="mt-3 mb-30 text-xs leading-6 text-zinc-500">
              More intelligence. Clearer guidance. Stronger security.
            </p>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="cursor-pointer mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-zinc-950 transition-colors hover:bg-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Got it
            </button>
          </div>
        </section>
      )}

      {/* Floating Assistant Trigger */}
        <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={
            isOpen ? "Close EECI AI assistant" : "Open EECI AI assistant"
        }
        aria-expanded={isOpen}
        aria-controls={isOpen ? "eeci-assistant-panel" : undefined}
        className={`cursor-pointer group fixed right-4 bottom-4 z-60 flex h-14 items-center gap-3 rounded-full border bg-zinc-950/95 px-4 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:right-6 sm:bottom-6 motion-safe:hover:animate-none ${
            isOpen
            ? "border-white/30 shadow-white/5"
            : "border-white/15 shadow-black/30 animate-[micro-bounce_3s_infinite,pulse-glow_3s_infinite]"
        }`}
        >
        {/* CSS Injection for custom premium keyframes */}
        <style>{`
            @keyframes micro-bounce {
            0%, 100% { transform: translateY(0); animation-timing-function: cubic-bezier(0.8,0,1,1); }
            50% { transform: translateY(-4px); animation-timing-function: cubic-bezier(0,0,0.2,1); }
            }

            /* Angelic glow: layered halos + soft inner light */
            @keyframes pulse-glow {
            0%, 100% {
                box-shadow:
                0 10px 15px -3px rgba(0,0,0,0.3),
                0 0 0px 0px rgba(255,255,255,0.0),
                inset 0 0 0px 0px rgba(255,255,255,0.0);
                border-color: rgba(255,255,255,0.15);
            }
            50% {
                box-shadow:
                0 10px 15px -3px rgba(0,0,0,0.3),
                0 0 24px 4px rgba(255,255,255,0.35),
                0 0 48px 12px rgba(255,255,255,0.18),
                inset 0 0 16px 0px rgba(255,255,255,0.12);
                border-color: rgba(255,255,255,0.45);
            }
            }

            /* Soft blurred halo outside the button */
            @keyframes halo-breathe {
            0%, 100% { opacity: 0.25; transform: scale(0.98); }
            50%      { opacity: 0.75; transform: scale(1.08); }
            }
        `}</style>

        {/* Soft outer halo (rendered behind the button content) */}
        {!isOpen && (
            <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-white/20 blur-xl animate-[halo-breathe_3s_infinite_ease-in-out]"
            />
        )}

        <Image
            src="/eeci-logo-white.svg"
            alt=""
            width={100}
            height={20}
            className="h-auto w-17"
        />

        <span className="h-6 w-px bg-white/15" />

        {isOpen ? (
            <X className="h-4 w-4 text-zinc-300" />
        ) : (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200">
            <Sparkles className="h-3.5 w-3.5" />
            AI
            </span>
        )}
        </button>


    </>
  );
}
