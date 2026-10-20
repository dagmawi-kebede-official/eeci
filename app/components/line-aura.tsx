import React from "react";

type EECIAuraProps = {
  className?: string;
};

const paths = [
  "M-100 180 H180 L260 100 H520 L590 170 H850",
  "M-80 500 H230 L310 420 H470 L540 350 H790",
  "M180 760 L310 630 H570 L650 550 H1050",
  "M600 -40 L600 120 L680 200 H920 L1000 120 H1250",
  "M900 800 L900 650 L980 570 H1220 L1300 490 H1700",
  "M1200 80 H1400 L1470 150 H1740",
  "M1450 360 H1280 L1200 440 H1020 L950 510",
  "M-80 650 H80 L150 580 H330",
];

const secondaryPaths = [
  "M0 300 H130 L200 230 H360",
  "M420 820 V680 L500 600",
  "M760 0 V100 L820 160",
  "M1080 820 V690 L1150 620 H1300",
  "M1550 650 H1430 L1370 590",
  "M1700 220 H1530 L1460 290",
];

const nodes = [
  { x: 180, y: 180 },
  { x: 260, y: 100 },
  { x: 520, y: 100 },
  { x: 590, y: 170 },
  { x: 850, y: 170 },
  { x: 230, y: 500 },
  { x: 310, y: 420 },
  { x: 540, y: 350 },
  { x: 790, y: 350 },
  { x: 310, y: 630 },
  { x: 570, y: 630 },
  { x: 650, y: 550 },
  { x: 1000, y: 120 },
  { x: 1220, y: 570 },
  { x: 1300, y: 490 },
  { x: 1470, y: 150 },
  { x: 1200, y: 440 },
  { x: 1020, y: 510 },
];

export default function LineAura({
  className = "",
}: EECIAuraProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1600 800"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Primary intelligence network */}
        <g
          stroke="white"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          opacity="0.32"
        >
          {paths.map((path, index) => (
            <path
              key={index}
              d={path}
              className="eeci-line"
              style={{
                animationDelay: `${index * -1.7}s`,
              }}
            />
          ))}
        </g>

        {/* Secondary structural network */}
        <g
          stroke="white"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          opacity="0.14"
        >
          {secondaryPaths.map((path, index) => (
            <path
              key={index}
              d={path}
              className="eeci-secondary-line"
              style={{
                animationDelay: `${index * -1.1}s`,
              }}
            />
          ))}
        </g>

        {/* Intelligence nodes */}
        <g fill="white">
          {nodes.map((node, index) => (
            <g
              key={index}
              className="eeci-node"
              style={{
                animationDelay: `${index * -0.45}s`,
              }}
            >
              {/* Active node */}
              <rect
                x={node.x - 2.5}
                y={node.y - 2.5}
                width="5"
                height="5"
              />

              {/* Node boundary */}
              <rect
                x={node.x - 8}
                y={node.y - 8}
                width="16"
                height="16"
                fill="none"
                stroke="white"
                strokeWidth="1"
                opacity="0.22"
              />
            </g>
          ))}
        </g>

        {/* Moving intelligence/data signals */}
        <g
          stroke="white"
          strokeWidth="2"
          strokeLinecap="square"
        >
          <path
            d="M-100 180 H180 L260 100 H520 L590 170 H850"
            className="eeci-pulse eeci-pulse-1"
          />

          <path
            d="M-80 500 H230 L310 420 H470 L540 350 H790"
            className="eeci-pulse eeci-pulse-2"
          />

          <path
            d="M900 800 L900 650 L980 570 H1220 L1300 490 H1700"
            className="eeci-pulse eeci-pulse-3"
          />
        </g>

        {/* Small system markers */}
        <g fill="white" opacity="0.28">
          <rect x="120" y="260" width="32" height="3" />
          <rect x="158" y="260" width="12" height="3" />

          <rect x="680" y="270" width="24" height="3" />
          <rect x="710" y="270" width="8" height="3" />

          <rect x="1180" y="320" width="30" height="3" />
          <rect x="1218" y="320" width="14" height="3" />

          <rect x="1370" y="610" width="26" height="3" />
          <rect x="1404" y="610" width="10" height="3" />
        </g>
      </svg>

      <style>{`
        .eeci-line {
          stroke-dasharray: 900 1800;
          animation: eeci-flow 12s linear infinite;
        }

        .eeci-secondary-line {
          stroke-dasharray: 500 1400;
          animation: eeci-secondary-flow 16s linear infinite;
        }

        .eeci-node {
          animation: eeci-node-pulse 3s steps(2, end) infinite;
        }

        .eeci-pulse {
          stroke-dasharray: 4 900;
        }

        .eeci-pulse-1 {
          animation: eeci-data-flow 16s linear infinite;
        }

        .eeci-pulse-2 {
          animation: eeci-data-flow 10s linear infinite;
          animation-delay: -2s;
        }

        .eeci-pulse-3 {
          animation: eeci-data-flow 6s linear infinite;
          animation-delay: -4s;
        }

        @keyframes eeci-flow {
          from {
            stroke-dashoffset: 0;
          }

          to {
            stroke-dashoffset: -2700;
          }
        }

        @keyframes eeci-secondary-flow {
          from {
            stroke-dashoffset: 0;
          }

          to {
            stroke-dashoffset: -1900;
          }
        }

        @keyframes eeci-data-flow {
          from {
            stroke-dashoffset: 0;
          }

          to {
            stroke-dashoffset: -1400;
          }
        }

        @keyframes eeci-node-pulse {
          0%,
          70%,
          100% {
            opacity: 0.35;
          }

          75%,
          82% {
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .eeci-line,
          .eeci-secondary-line,
          .eeci-node,
          .eeci-pulse {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
