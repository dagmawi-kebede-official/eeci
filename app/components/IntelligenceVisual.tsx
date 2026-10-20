"use client";

import { useEffect, useRef } from "react";

export default function IntelligenceVisual() {
  const image = "/Dashboard_Screenshot.png";

  const frameRef = useRef<HTMLDivElement>(null);

useEffect(() => {
    let rafId = 0;

    const updateScrollAnimation = () => {
      const frame = frameRef.current;
      if (!frame) return;

      // Get current page scroll distance
      const scrollY = window.scrollY;

      const maxScroll = 800; // Distance over which the motion takes place
      const progress = Math.min(1, Math.max(0, scrollY / maxScroll));

      // Ease-out curve: fast smooth start, slowing down as you scroll further
      const easedProgress = 1 - Math.pow(1 - progress, 2);

      const translateY = easedProgress * -75;

      frame.style.transform = `translate3d(0, ${translateY}px, 0)`;

      rafId = requestAnimationFrame(updateScrollAnimation);
    };

    // Attach scroll listener for direct response during active scrolling
    window.addEventListener("scroll", updateScrollAnimation, { passive: true });
    updateScrollAnimation(); // Initial position check

    return () => {
      window.removeEventListener("scroll", updateScrollAnimation);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section className="relative -mt-20 -z-100 w-full bg-transparent">
      <style jsx>{`
        .security-frame {
          position: relative;
          width: 100%;
          border: 1px solid rgba(255, 255, 255, 0.42);
          background: transparent;

          box-shadow:
            /* subtle all-around aura */
            0 0 3px rgba(255, 255, 255, 0.16),
            0 0 8px rgba(255, 255, 255, 0.07),

            /* stronger aura directly above the top edge */
            0 -4px 8px rgba(255, 255, 255, 0.24),
            0 -10px 20px rgba(255, 255, 255, 0.20),
            0 -22px 42px rgba(255, 255, 255, 0.14),
            0 -42px 70px rgba(255, 255, 255, 0.07),

            /* very subtle inner edge */
            inset 0 0 8px rgba(255, 255, 255, 0.015);
        }

        /*
         * A very subtle upward aura gives the frame a restrained
         * heaven-like ascension without becoming a separate shape.
         */
        .security-frame::after {
          content: "";
          position: absolute;
          left: 12%;
          right: 12%;
          top: -240px;
          height: 250px;

          pointer-events: none;
          z-index: 5;

          background:
            radial-gradient(
              ellipse 42% 100% at 50% 100%,
              rgba(255, 255, 255, 0.28) 0%,
              rgba(255, 255, 255, 0.16) 20%,
              rgba(255, 255, 255, 0.075) 42%,
              rgba(255, 255, 255, 0.028) 65%,
              rgba(255, 255, 255, 0.008) 82%,
              rgba(255, 255, 255, 0) 100%
            );

          filter: blur(24px);
          opacity: 1;
        }

        /* Single pulse, exactly on the top-center of the rectangle. */
        .pulse-origin {
          position: absolute;
          left: 50%;
          top: 0;
          z-index: 80;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          background: #fff;
          box-shadow:
            0 0 5px rgba(255, 255, 255, 1),
            0 0 14px rgba(255, 255, 255, 1),
            0 0 32px rgba(255, 255, 255, 0.95),
            0 0 68px rgba(255, 255, 255, 0.78);
          animation: pulse-origin 6s ease-in-out infinite;
        }

        @keyframes pulse-origin {
          0%, 6% {
            transform: translate(-50%, -50%) scale(0.65);
            opacity: 0;
          }

          8% {
            transform: translate(-50%, -50%) scale(1.35);
            opacity: 1;
          }

          12% {
            transform: translate(-50%, -50%) scale(1.05);
            opacity: 0.95;
          }

          16% {
            transform: translate(-50%, -50%) scale(0.88);
            opacity: 0.65;
          }

          20% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
          }

          100% {
            transform: translate(-50%, -50%) scale(0.65);
            opacity: 0;
          }
        }

        .beam {
          position: absolute;
          z-index: 70;
          display: block;
          background: linear-gradient(90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.72) 22%,
            rgba(255, 255, 255, 1) 50%,
            rgba(255, 255, 255, 0.72) 78%,
            rgba(255, 255, 255, 0) 100%
          );
          opacity: 0;
          pointer-events: none;
          box-shadow:
            0 0 3px rgba(255, 255, 255, 1),
            0 0 8px rgba(255, 255, 255, 1),
            0 0 18px rgba(255, 255, 255, 0.9),
            0 0 32px rgba(255, 255, 255, 0.5);
          will-change: transform, opacity;
        }

        .beam-top-left,
        .beam-top-right {
          position: absolute;
          top: -2px;
          width: 80px;
          height: 2px;
          opacity: 0;
        }

        .beam-top-left {
          left: calc(50% - 80px);
          animation: beam-top-left 6s linear infinite;
        }

        .beam-top-right {
          left: 50%;
          animation: beam-top-right 6s linear infinite;
        }

        .beam-side-left,
        .beam-side-right {
          top: 0;
          width: 2px;
          height: 80px;
          opacity: 0;
          background: linear-gradient(180deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.72) 22%,
            rgba(255, 255, 255, 1) 50%,
            rgba(255, 255, 255, 0.72) 78%,
            rgba(255, 255, 255, 0) 100%
          );
        }

        .beam-side-left {
          left: -2px;
          animation: beam-side-left 6s linear infinite;
        }

        .beam-side-right {
          right: -2px;
          animation: beam-side-right 6s linear infinite;
        }

        @keyframes beam-top-left {
          0%, 7% {
            left: calc(50% - 80px);
            opacity: 0;
          }

          8% {
            left: calc(50% - 80px);
            opacity: 1;
          }

          38% {
            left: 0;
            opacity: 1;
          }

          40% {
            left: 0;
            opacity: 0;
          }

          100% {
            left: 0;
            opacity: 0;
          }
        }

        @keyframes beam-top-right {
          0%, 7% {
            left: 50%;
            opacity: 0;
          }

          8% {
            left: 50%;
            opacity: 1;
          }

          38% {
            left: calc(100% - 80px);
            opacity: 1;
          }

          40% {
            left: calc(100% - 80px);
            opacity: 0;
          }

          100% {
            left: calc(100% - 80px);
            opacity: 0;
          }
        }

        @keyframes beam-side-left {
          0%, 37% {
            top: 0;
            opacity: 0;
          }

          38% {
            top: 0;
            opacity: 1;
          }

          68% {
            top: 55%;
            opacity: 1;
          }

          72% {
            top: 55%;
            opacity: 0;
          }

          100% {
            top: 72%;
            opacity: 0;
          }
        }

        @keyframes beam-side-right {
          0%, 37% {
            top: 0;
            opacity: 0;
          }

          38% {
            top: 0;
            opacity: 1;
          }

          68% {
            top: 55%;
            opacity: 1;
          }

          72% {
            top: 55%;
            opacity: 0;
          }

          100% {
            top: 72%;
            opacity: 0;
          }
        }

        .corner-bracket {
          position: absolute;
          z-index: 90;
          width: 15px;
          height: 15px;
          border-color: rgba(255, 255, 255, 0.78);
          border-width: 3px;
          border-style: none;
          pointer-events: none;
        }

        .corner-tl {
          left: -2px;
          top: -2px;
          border-left-style: solid;
          border-top-style: solid;
          border-color: darkgrey;
        }

        .corner-tr {
          right: -2px;
          top: -2px;
          border-right-style: solid;
          border-top-style: solid;
          border-color: darkgrey;
        }

        .corner-bl {
          left: -2px;
          bottom: -2px;
          border-left-style: solid;
          border-bottom-style: solid;
          border-color: darkgrey;
        }

        .corner-br {
          right: -2px;
          bottom: -2px;
          border-right-style: solid;
          border-bottom-style: solid;
          border-color: darkgrey;
        }

        @media (prefers-reduced-motion: reduce) {
          .pulse-origin {
            animation: none;
          }

          .beam {
            animation: none;
            opacity: 0;
          }
        }
      `}</style>

      <div className="relative mx-auto flex min-h-screen w-full max-w-350 items-center px-5 py-24 sm:px-8 lg:px-12">
        <div className="relative mx-auto w-full max-w-295">
          <div
            ref={frameRef}
            className="relative border-3 border-mist-800 w-full will-change-transform"
          >
            <div className="security-frame overflow-visible">
              <img
                src={image}
                alt="EECI security intelligence platform"
                className="relative p-2 z-10 block h-auto w-full"
                draggable={false}
              />

              <span className="beam beam-top-left" aria-hidden="true" />
              <span className="beam beam-side-left" aria-hidden="true" />

              <span className="beam beam-top-right" aria-hidden="true" />
              <span className="beam beam-side-right" aria-hidden="true" />

              <span className="pulse-origin" aria-hidden="true" />
            </div>

            <span className="corner-bracket corner-tl" aria-hidden="true" />
            <span className="corner-bracket corner-tr" aria-hidden="true" />
            <span className="corner-bracket corner-bl" aria-hidden="true" />
            <span className="corner-bracket corner-br" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
