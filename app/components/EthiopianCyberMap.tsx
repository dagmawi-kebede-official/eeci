"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import {
  ETHIOPIA_GEOMETRY,
  ETHIOPIA_RENDER_ORDER,
  ETHIOPIA_VIEWBOX,
  ETHIOPIAN_REGIONS,
} from "ethiopia-regions-map";

/* ============================================================
   COUNT UP  —  hoisted to module scope so it never remounts
   ============================================================ */

interface CountUpProps {
  target: number;
  duration?: number;
  className?: string;
  suffix?: string;
}

function CountUp({
  target,
  duration = 1600,
  className,
  suffix = "",
}: CountUpProps) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const hasAnimatedRef = useRef(false);

  // Latest target without restarting the effect
  const targetRef = useRef(target);
  targetRef.current = target;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    if (!Number.isFinite(targetRef.current)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        if (hasAnimatedRef.current) return;

        hasAnimatedRef.current = true;
        observer.disconnect();

        const finalValue = targetRef.current;
        const start = performance.now();

        const tick = (now: number) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);

          // easeOutExpo — snappy start, gentle settle
          const eased =
            progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

          setCount(Math.round(eased * finalValue));

          if (progress < 1) {
            animFrameRef.current = requestAnimationFrame(tick);
          } else {
            setCount(finalValue); // exact landing
            animFrameRef.current = null;
          }
        };

        animFrameRef.current = requestAnimationFrame(tick);
      },
      { threshold: 0.25 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [duration]);

  return (
    <span ref={elementRef} className={className}>
      {count}
      {suffix}
    </span>
  );
}

/* ============================================================
   TYPES & DATA
   ============================================================ */

type ThreatLevel = "critical" | "elevated" | "secure";

type RegionThreat = {
  score: number;
  detections: number;
  blocked: number;
  investigating: number;
  trend: number;
};

const regionThreats: Record<string, RegionThreat> = {
  TI: { score: 72, detections: 318, blocked: 241, investigating: 27, trend: 12.4 },
  AF: { score: 41, detections: 146, blocked: 118, investigating: 9, trend: -4.8 },
  AM: { score: 67, detections: 286, blocked: 219, investigating: 18, trend: 7.2 },
  BG: { score: 32, detections: 94, blocked: 81, investigating: 5, trend: -8.1 },
  OR: { score: 88, detections: 642, blocked: 491, investigating: 43, trend: 18.7 },
  SO: { score: 76, detections: 384, blocked: 301, investigating: 24, trend: 9.8 },
  HA: { score: 38, detections: 86, blocked: 71, investigating: 4, trend: -3.1 },
  GA: { score: 29, detections: 72, blocked: 61, investigating: 3, trend: -6.4 },
  AA: { score: 96, detections: 821, blocked: 637, investigating: 61, trend: 22.8 },
  DD: { score: 58, detections: 213, blocked: 166, investigating: 14, trend: 5.7 },
  SI: { score: 46, detections: 132, blocked: 104, investigating: 8, trend: -1.9 },
  SW: { score: 35, detections: 91, blocked: 75, investigating: 4, trend: -5.3 },
  CE: { score: 61, detections: 187, blocked: 146, investigating: 12, trend: 6.1 },
  SE: { score: 44, detections: 121, blocked: 97, investigating: 7, trend: 2.6 },
};

const fallbackThreat: RegionThreat = {
  score: 50,
  detections: 0,
  blocked: 0,
  investigating: 0,
  trend: 0,
};

/* ============================================================
   HELPERS
   ============================================================ */

function getThreatLevel(score: number): ThreatLevel {
  if (score >= 80) return "critical";
  if (score >= 50) return "elevated";
  return "secure";
}

function getThreatLabel(level: ThreatLevel) {
  switch (level) {
    case "critical": return "HIGH ACTIVITY";
    case "elevated": return "MONITORED";
    case "secure":   return "LOW ACTIVITY";
  }
}

function getRegionFill(level: ThreatLevel) {
  switch (level) {
    case "critical": return "rgba(239, 68, 68, 0.24)";
    case "elevated": return "rgba(245, 158, 11, 0.16)";
    case "secure":   return "rgba(34, 197, 94, 0.10)";
  }
}

function getRegionStroke(level: ThreatLevel) {
  switch (level) {
    case "critical": return "rgba(248, 113, 113, 0.72)";
    case "elevated": return "rgba(251, 191, 36, 0.62)";
    case "secure":   return "rgba(74, 222, 128, 0.48)";
  }
}

function getRegionAccent(level: ThreatLevel) {
  switch (level) {
    case "critical":
      return { solid: "#f87171", soft: "rgba(248, 113, 113, 0.78)" };
    case "elevated":
      return { solid: "#fbbf24", soft: "rgba(251, 191, 36, 0.78)" };
    case "secure":
      return { solid: "#4ade80", soft: "rgba(74, 222, 128, 0.78)" };
  }
}

function getThreatText(level: ThreatLevel) {
  switch (level) {
    case "critical": return "text-red-400";
    case "elevated": return "text-amber-400";
    case "secure":   return "text-emerald-400";
  }
}

function getRoutePath(
  startX: number,
  startY: number,
  endX: number,
  endY: number
) {
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;
  const dx = endX - startX;
  const dy = endY - startY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const bend = Math.min(115, Math.max(45, distance * 0.2));

  const controlX = midX - dy * 0.16;
  const controlY = midY + dx * 0.16 - bend;

  return `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

export default function EthiopiaCyberMap() {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [visibleLabels, setVisibleLabels] = useState<Record<string, boolean>>({});

  const routeRegions = useMemo(
    () => ETHIOPIA_RENDER_ORDER.filter((code) => code !== "AA"),
    []
  );

  useEffect(() => {
    if (routeRegions.length === 0) return;

    const timers: number[] = [];

    routeRegions.forEach((code, index) => {
      const schedule = () => {
        const initialDelay = index * 360;

        const showTimer = window.setTimeout(() => {
          setVisibleLabels((previous) => ({ ...previous, [code]: true }));

          const hideTimer = window.setTimeout(() => {
            setVisibleLabels((previous) => ({ ...previous, [code]: false }));
          }, 2500);

          timers.push(hideTimer);

          const nextTimer = window.setTimeout(
            schedule,
            3200 + (index % 5) * 260
          );

          timers.push(nextTimer);
        }, initialDelay);

        timers.push(showTimer);
      };

      schedule();
    });

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [routeRegions]);

  const hoveredRegionData = useMemo(() => {
    if (!hoveredRegion) return null;

    const region = ETHIOPIAN_REGIONS.find((item) => item.code === hoveredRegion);
    if (!region) return null;

    const threat = regionThreats[hoveredRegion] ?? fallbackThreat;

    return {
      region,
      threat,
      level: getThreatLevel(threat.score),
    };
  }, [hoveredRegion]);

  const totals = useMemo(() => {
    return Object.values(regionThreats).reduce(
      (acc, item) => {
        acc.detections += item.detections;
        acc.blocked += item.blocked;
        acc.investigating += item.investigating;
        return acc;
      },
      { detections: 0, blocked: 0, investigating: 0 }
    );
  }, []);

  const { highActivityPercentage, monitoredPercentage, lowActivityPercentage } =
    useMemo(() => {
      const values = Object.values(regionThreats);
      const critical = values.filter((item) => item.score >= 80).length;
      const monitored = values.filter(
        (item) => item.score >= 50 && item.score < 80
      ).length;
      const secure = values.filter((item) => item.score < 50).length;

      const total = critical + monitored + secure;

      return {
        highActivityPercentage:
          total > 0 ? Math.round((critical / total) * 100) : 0,
        monitoredPercentage:
          total > 0 ? Math.round((monitored / total) * 100) : 0,
        lowActivityPercentage:
          total > 0 ? Math.round((secure / total) * 100) : 0,
      };
    }, []);

  const mapNodes = useMemo(() => {
    return ETHIOPIA_RENDER_ORDER.map((code) => {
      const region = ETHIOPIAN_REGIONS.find((item) => item.code === code);
      if (!region) return null;

      const geometry = ETHIOPIA_GEOMETRY[region.code];
      if (!geometry) return null;

      const threat = regionThreats[region.code] ?? fallbackThreat;

      return {
        code: region.code,
        region,
        geometry,
        threat,
        level: getThreatLevel(threat.score),
        x: geometry.centroid[0],
        y: geometry.centroid[1],
      };
    }).filter((node): node is NonNullable<typeof node> => node !== null);
  }, []);

  const origin = mapNodes.find((node) => node.code === "AA");

  const routePaths = useMemo(() => {
    if (!origin) return [];

    return mapNodes
      .filter((node) => node.code !== "AA")
      .map((node) => ({
        ...node,
        path: getRoutePath(origin.x, origin.y, node.x, node.y),
      }));
  }, [mapNodes, origin]);

  return (
    <section className="relative overflow-hidden bg-black mt-40">
      <style jsx>{`
        .cyber-map-grid {
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.028) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.028) 1px, transparent 1px);
          background-size: 56px 56px;
        }

        .map-scan {
          position: absolute;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.12), transparent);
          animation: map-scan 8s linear infinite;
          pointer-events: none;
        }

        @keyframes map-scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }

        .map-region {
          cursor: pointer;
          transition: fill 220ms ease, stroke 220ms ease, opacity 220ms ease, filter 220ms ease;
        }

        .map-region:hover { filter: brightness(1.65); }

        .region-node { pointer-events: none; }

        .region-node-core { animation: node-breathe 2.6s ease-in-out infinite; }

        @keyframes node-breathe {
          0%, 100% { opacity: 0.45; }
          50% { opacity: 1; }
        }

        .destination-pulse {
          transform-box: fill-box;
          transform-origin: center;
          animation: destination-pulse 900ms ease-out forwards;
        }

        @keyframes destination-pulse {
          0% { transform: scale(0.4); opacity: 1; }
          70% { transform: scale(2.8); opacity: 0; }
          100% { transform: scale(2.8); opacity: 0; }
        }

        .route-line {
          fill: none;
          stroke-width: 1.8;
          stroke-linecap: round;
          stroke-linejoin: round;
          vector-effect: non-scaling-stroke;
        }

        .travel-node {
          pointer-events: none;
          filter: url(#route-glow);
        }

        .arrival-label { pointer-events: none; }

        .arrival-label-text {
          font-family: monospace;
          font-size: 14px;
          letter-spacing: 1.25px;
          fill: rgba(255, 255, 255, 0.78);
          opacity: 0;
          animation: region-label 2.9s ease-in-out forwards;
        }

        @keyframes region-label {
          0% { opacity: 0; }
          18% { opacity: 0.86; }
          72% { opacity: 0.86; }
          100% { opacity: 0; }
        }

        .origin-node { animation: origin-node 1.8s ease-in-out infinite; }

        @keyframes origin-node {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }

        .live-dot { animation: live-dot 1.8s ease-in-out infinite; }

        @keyframes live-dot {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .map-scan,
          .region-node-core,
          .origin-node,
          .live-dot,
          .destination-pulse,
          .travel-node,
          .arrival-label-text {
            animation: none;
          }
          .travel-node { opacity: 0.8; }
          .arrival-label-text { opacity: 1; animation: none; }
        }
      `}</style>

      <div className="mx-auto w-full max-w-375 px-5 sm:px-8 lg:px-12">
        <div className="mb-15 flex flex-col items-center text-center">
          <h2 className="text-5xl font-black tracking-tighter sm:text-7xl md:text-8xl bg-linear-to-b from-white via-zinc-200 to-zinc-600 bg-clip-text text-transparent leading-[0.9] max-w-6xl">
            Ethiopia&apos;s Cyber Threat Landscape.
          </h2>

          <p className="mt-8 max-w-2xl text-base leading-relaxed text-zinc-400 md:text-lg">
            Monitor cyber activity across Ethiopia&apos;s regions, identify
            emerging threats, and understand where security attention is
            required.
          </p>
        </div>

        <div className="relative -mt-20 min-h-190 overflow-hidden">
          <div className="cyber-map-grid pointer-events-none absolute inset-0 opacity-40" />
          <div className="map-scan z-10" />

          <div className="absolute right-25 top-25 z-30">
            <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-white">
              National threat monitoring
            </div>

            <div className="mt-3 flex items-baseline gap-3">
              <span className="font-mono text-6xl font-black text-white">
                {totals.detections.toLocaleString()}
              </span>

              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/70">
                detections
              </span>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 top-16 flex items-center justify-center">
            <svg
              viewBox={`0 0 ${ETHIOPIA_VIEWBOX.width} ${ETHIOPIA_VIEWBOX.height}`}
              className="h-full w-full max-h-172.5 max-w-262.5"
              role="img"
              aria-label="Ethiopia cyber threat intelligence map"
            >
              <defs>
                <filter id="region-glow" x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <filter id="route-glow" x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {mapNodes.map((node) => {
                const isHovered = hoveredRegion === node.code;

                return (
                  <path
                    key={node.code}
                    d={node.geometry.d}
                    className="map-region"
                    fill={getRegionFill(node.level)}
                    stroke={isHovered ? "white" : getRegionStroke(node.level)}
                    strokeWidth={isHovered ? 1.2 : 0.9}
                    strokeOpacity={isHovered ? 1 : 0.75}
                    filter={isHovered ? "url(#region-glow)" : undefined}
                    onMouseEnter={() => setHoveredRegion(node.code)}
                    onMouseLeave={() => setHoveredRegion(null)}
                    onFocus={() => setHoveredRegion(node.code)}
                    onBlur={() => setHoveredRegion(null)}
                    role="button"
                    tabIndex={0}
                    aria-label={`${node.region.name} — ${getThreatLabel(node.level)}`}
                  />
                );
              })}

              {routePaths.map((route) => {
                const accent = getRegionAccent(route.level);

                return (
                  <g key={`route-${route.code}`}>
                    <path
                      id={`route-${route.code}`}
                      d={route.path}
                      className="route-line"
                      stroke={accent.soft}
                    />

                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <circle
                        key={`${route.code}-travel-${index}`}
                        r={index === 0 ? 3.2 : 2.5}
                        fill={accent.solid}
                        className="travel-node"
                      >
                        <animateMotion
                          dur="4.2s"
                          begin={`${index * 0.45}s`}
                          repeatCount="indefinite"
                        >
                          <mpath href={`#route-${route.code}`} />
                        </animateMotion>

                        <animate
                          attributeName="opacity"
                          values="0;1;1;0"
                          keyTimes="0;0.08;0.72;1"
                          dur="4.2s"
                          begin={`${index * 0.45}s`}
                          repeatCount="indefinite"
                        />
                      </circle>
                    ))}
                  </g>
                );
              })}

              {mapNodes.map((node) => {
                const isOrigin = node.code === "AA";
                const isLabelVisible = Boolean(visibleLabels[node.code]);
                const accent = getRegionAccent(node.level);

                return (
                  <g key={`node-${node.code}`} className="region-node">
                    {isLabelVisible && !isOrigin && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="5"
                        fill="none"
                        stroke={accent.solid}
                        strokeWidth="2"
                        className="destination-pulse"
                      />
                    )}

                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isOrigin ? 5 : 3.5}
                      fill="rgba(0,0,0,0.9)"
                      stroke={isOrigin ? "rgba(255,255,255,1)" : accent.solid}
                      strokeWidth={isOrigin ? 1.8 : 1.1}
                    />

                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isOrigin ? 2.5 : 1.8}
                      fill={isOrigin ? "#ffffff" : accent.solid}
                      className="region-node-core"
                    />

                    {!isOrigin && isLabelVisible && (
                      <g
                        className="arrival-label"
                        transform={`translate(${node.x + 9} ${node.y - 7})`}
                      >
                        <text
                          textAnchor="start"
                          dominantBaseline="middle"
                          className="arrival-label-text"
                        >
                          {node.region.name}
                        </text>
                      </g>
                    )}

                    {isOrigin && (
                      <>
                        <line
                          x1={node.x}
                          y1={node.y}
                          x2={node.x + 40}
                          y2={node.y - 22}
                          stroke="white"
                          strokeWidth="2"
                        />

                        <text
                          x={node.x + 39}
                          y={node.y - 24}
                          fill="white"
                          fontSize="20"
                          fontFamily="monospace"
                          letterSpacing="2.6"
                        >
                          EECI
                        </text>

                        <text
                          x={node.x + 39}
                          y={node.y - 13}
                          fill="white"
                          fontSize="12"
                          fontFamily="monospace"
                          letterSpacing="2.2"
                        >
                          ADDIS ABABA
                        </text>
                      </>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="absolute right-10 bottom-10 z-30">
            <div className="text-right font-mono text-[9px] uppercase tracking-[0.3em] text-white/25">
              Regional activity
            </div>

            <div className="mt-3 flex flex-col flex-wrap justify-end gap-x-5 gap-y-2">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/45">High</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/45">Monitor</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/45">Low</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-white" />
                <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/45">EECI</span>
              </div>
            </div>
          </div>

          {hoveredRegionData && (
            <div className="absolute top-50 right-30 z-40 w-70 max-w-[calc(100%-24px)]">
              <div className="border border-white/10 bg-black/90 p-5 backdrop-blur-md">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-mono text-[8px] uppercase tracking-[0.25em] text-white/25">
                      Regional intelligence
                    </div>

                    <h3 className="mt-2 text-lg font-medium text-white">
                      {hoveredRegionData.region.name}
                    </h3>

                    <div
                      className={`mt-1 font-mono text-[8px] uppercase tracking-[0.2em] ${getThreatText(
                        hoveredRegionData.level
                      )}`}
                    >
                      {getThreatLabel(hoveredRegionData.level)}
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-4">
                  <div>
                    <div className="font-mono text-lg text-white">
                      {hoveredRegionData.threat.detections}
                    </div>
                    <div className="mt-1 font-mono text-[7px] uppercase tracking-[0.15em] text-white/25">
                      Detected
                    </div>
                  </div>

                  <div>
                    <div className="font-mono text-lg text-blue-400">
                      {hoveredRegionData.threat.blocked}
                    </div>
                    <div className="mt-1 font-mono text-[7px] uppercase tracking-[0.15em] text-white/25">
                      Blocked
                    </div>
                  </div>

                  <div>
                    <div className="font-mono text-lg text-amber-400">
                      {hoveredRegionData.threat.investigating}
                    </div>
                    <div className="mt-1 font-mono text-[7px] uppercase tracking-[0.15em] text-white/25">
                      Active
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-white/25">
                    Activity trend
                  </span>

                  <span
                    className={`font-mono text-xs ${
                      hoveredRegionData.threat.trend >= 0
                        ? "text-red-400"
                        : "text-emerald-400"
                    }`}
                  >
                    {hoveredRegionData.threat.trend >= 0 ? "+" : ""}
                    {hoveredRegionData.threat.trend.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================
            REGIONAL SECURITY DISTRIBUTION
            ============================================================ */}

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* High activity */}
          <div className="relative rounded-xl overflow-hidden border border-red-400/20 bg-red-400/[0.035] px-6 py-7">
            <div className="absolute left-0 top-0 h-px w-full bg-red-400/50" />

            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/30">
                  High activity
                </div>

                <div className="mt-3 font-mono text-5xl font-medium tracking-tight text-red-400 sm:text-6xl">
                  <CountUp target={highActivityPercentage} suffix="%" />
                </div>
              </div>
            </div>
          </div>

          {/* Monitored */}
          <div className="relative rounded-xl overflow-hidden border border-amber-400/20 bg-amber-400/[0.035] px-6 py-7">
            <div className="absolute left-0 top-0 h-px w-full bg-amber-400/50" />

            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/30">
                  Monitored
                </div>

                <div className="mt-3 font-mono text-5xl font-medium tracking-tight text-amber-400 sm:text-6xl">
                  <CountUp target={monitoredPercentage} suffix="%" />
                </div>
              </div>
            </div>
          </div>

          {/* Low activity */}
          <div className="relative rounded-xl overflow-hidden border border-emerald-400/20 bg-emerald-400/[0.035] px-6 py-7">
            <div className="absolute left-0 top-0 h-px w-full bg-emerald-400/50" />

            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/30">
                  Low activity
                </div>

                <div className="mt-3 font-mono text-5xl font-medium tracking-tight text-emerald-400 sm:text-6xl">
                  <CountUp target={lowActivityPercentage} suffix="%" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
