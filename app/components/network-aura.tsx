"use client";

import { useEffect, useRef } from "react";

type NodeType =
  | "normal"
  | "security"
  | "database"
  | "lock";

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  type: NodeType;
  pulse: number;
};

type Label = {
  text: string;
  subtext?: string;
  x: number;
  y: number;
  delay: number;
  duration: number;
};

export default function NetworkAura() {
  const canvasRef =
    useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    let animationFrame: number;

    /*
     * ============================================================
     * RESIZE
     * ============================================================
     */

    const resize = () => {
      const dpr = Math.min(
        window.devicePixelRatio || 1,
        2
      );

      canvas.width =
        window.innerWidth * dpr;

      canvas.height =
        window.innerHeight * dpr;

      canvas.style.width =
        `${window.innerWidth}px`;

      canvas.style.height =
        `${window.innerHeight}px`;

      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      );
    };

    resize();

    window.addEventListener(
      "resize",
      resize
    );

    /*
     * ============================================================
     * NETWORK NODES
     * ============================================================
     */

    const nodes: Node[] =
      Array.from(
        { length: 82 },
        (_, i) => {
          let type: NodeType =
            "normal";

          /*
           * Main security hub
           */

          if (i === 0) {
            type = "security";
          }

          /*
           * Security infrastructure
           */

          if (
            i === 12 ||
            i === 29 ||
            i === 51 ||
            i === 69
          ) {
            type = "database";
          }

          if (
            i === 19 ||
            i === 38 ||
            i === 61 ||
            i === 76
          ) {
            type = "lock";
          }

          return {
            x:
              Math.random() *
              window.innerWidth,

            y:
              Math.random() *
              window.innerHeight,

            vx:
              (Math.random() -
                0.5) *
              0.045,

            vy:
              (Math.random() -
                0.5) *
              0.045,

            radius:
              type === "security"
                ? 5
                : type ===
                      "database" ||
                    type === "lock"
                  ? 3
                  : Math.random() *
                        1.4 +
                      0.8,

            type,

            pulse:
              Math.random() *
              Math.PI *
              2,
          };
        }
      );

    /*
     * Central cybersecurity intelligence hub
     */

    nodes[0].x =
      window.innerWidth *
      0.58;

    nodes[0].y =
      window.innerHeight *
      0.5;

    /*
     * ============================================================
     * CYBERSECURITY LABELS
     * ============================================================
     */

    const labels: Label[] = [
      {
        text: "THREAT INTELLIGENCE",
        subtext:
          "DETECTION · ANALYSIS · RESPONSE",
        x: 6,
        y: 18,
        delay: 0,
        duration: 7,
      },

      {
        text: "NETWORK SECURITY",
        subtext:
          "MONITOR · ANALYZE · PROTECT",
        x: 76,
        y: 25,
        delay: 1.5,
        duration: 8,
      },

      {
        text: "RISK ASSESSMENT",
        subtext:
          "IDENTIFY · EVALUATE · MITIGATE",
        x: 8,
        y: 51,
        delay: 0.8,
        duration: 9,
      },

      {
        text: "IDENTITY & ACCESS",
        subtext:
          "AUTHENTICATION · AUTHORIZATION",
        x: 76,
        y: 51,
        delay: 2,
        duration: 8,
      },

      {
        text: "VULNERABILITY",
        subtext:
          "DISCOVERY · TESTING · REMEDIATION",
        x: 7,
        y: 76,
        delay: 2.5,
        duration: 9,
      },

      {
        text: "INCIDENT RESPONSE",
        subtext:
          "DETECT · CONTAIN · RECOVER",
        x: 73,
        y: 76,
        delay: 1,
        duration: 8,
      },

      {
        text: "COMPLIANCE",
        subtext:
          "GOVERNANCE · CONTROL · ASSURANCE",
        x: 38,
        y: 12,
        delay: 3,
        duration: 10,
      },

      {
        text: "DATA PROTECTION",
        subtext:
          "ENCRYPTION · PRIVACY · RESILIENCE",
        x: 38,
        y: 88,
        delay: 2,
        duration: 9,
      },
    ];

    /*
     * ============================================================
     * GLOW
     * ============================================================
     */

    const drawGlow = (
      x: number,
      y: number,
      radius: number,
      opacity: number
    ) => {
      const gradient =
        ctx.createRadialGradient(
          x,
          y,
          0,
          x,
          y,
          radius
        );

      gradient.addColorStop(
        0,
        `rgba(255,255,255,${opacity})`
      );

      gradient.addColorStop(
        1,
        "rgba(255,255,255,0)"
      );

      ctx.beginPath();

      ctx.arc(
        x,
        y,
        radius,
        0,
        Math.PI * 2
      );

      ctx.fillStyle = gradient;

      ctx.fill();
    };

    /*
     * ============================================================
     * NORMAL NODE
     * ============================================================
     */

    const drawNormalNode = (
      node: Node
    ) => {
      ctx.beginPath();

      ctx.arc(
        node.x,
        node.y,
        node.radius,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        "rgba(255,255,255,0.7)";

      ctx.fill();
    };

    /*
     * ============================================================
     * LOCK NODE
     * ============================================================
     */

    const drawLock = (
      node: Node,
      time: number
    ) => {
      const pulse =
        Math.sin(
          time * 0.001 +
            node.pulse
        ) *
          0.5 +
        0.5;

      drawGlow(
        node.x,
        node.y,
        55,
        0.06 +
          pulse * 0.035
      );

      /*
       * Outer ring
       */

      ctx.beginPath();

      ctx.arc(
        node.x,
        node.y,
        19 +
          pulse * 2,
        0,
        Math.PI * 2
      );

      ctx.strokeStyle =
        "rgba(255,255,255,0.3)";

      ctx.lineWidth = 0.8;

      ctx.stroke();

      /*
       * Lock body
       */

      ctx.beginPath();

      ctx.roundRect(
        node.x - 6,
        node.y - 1,
        12,
        10,
        1.5
      );

      ctx.strokeStyle =
        "rgba(255,255,255,0.9)";

      ctx.lineWidth = 1.2;

      ctx.stroke();

      /*
       * Shackle
       */

      ctx.beginPath();

      ctx.arc(
        node.x,
        node.y - 1,
        4.5,
        Math.PI,
        0
      );

      ctx.strokeStyle =
        "rgba(255,255,255,0.9)";

      ctx.lineWidth = 1.2;

      ctx.stroke();
    };

    /*
     * ============================================================
     * DATABASE NODE
     * ============================================================
     */

    const drawDatabase = (
      node: Node,
      time: number
    ) => {
      const pulse =
        Math.sin(
          time * 0.001 +
            node.pulse
        ) *
          0.5 +
        0.5;

      drawGlow(
        node.x,
        node.y,
        55,
        0.055 +
          pulse * 0.03
      );

      /*
       * Outer HUD ring
       */

      ctx.beginPath();

      ctx.arc(
        node.x,
        node.y,
        20,
        0,
        Math.PI * 2
      );

      ctx.strokeStyle =
        "rgba(255,255,255,0.3)";

      ctx.lineWidth = 0.8;

      ctx.stroke();

      /*
       * Database
       */

      const width = 13;
      const height = 12;

      ctx.beginPath();

      ctx.ellipse(
        node.x,
        node.y - 5,
        width / 2,
        3.5,
        0,
        0,
        Math.PI * 2
      );

      ctx.strokeStyle =
        "rgba(255,255,255,0.9)";

      ctx.lineWidth = 1;

      ctx.stroke();

      ctx.beginPath();

      ctx.moveTo(
        node.x -
          width / 2,
        node.y - 5
      );

      ctx.lineTo(
        node.x -
          width / 2,
        node.y + 6
      );

      ctx.moveTo(
        node.x +
          width / 2,
        node.y - 5
      );

      ctx.lineTo(
        node.x +
          width / 2,
        node.y + 6
      );

      ctx.stroke();

      ctx.beginPath();

      ctx.ellipse(
        node.x,
        node.y + 6,
        width / 2,
        3.5,
        0,
        0,
        Math.PI * 2
      );

      ctx.stroke();
    };

    /*
     * ============================================================
     * MAIN SECURITY HUB
     * ============================================================
     */

    const drawSecurityHub = (
      node: Node,
      time: number
    ) => {
      const pulse =
        Math.sin(
          time * 0.001 +
            node.pulse
        ) *
          0.5 +
        0.5;

      /*
       * Large atmospheric glow
       */

      drawGlow(
        node.x,
        node.y,
        260,
        0.07 +
          pulse * 0.03
      );

      /*
       * Large concentric rings
       */

      const rings = [
        105,
        82,
        61,
        43,
      ];

      rings.forEach(
        (radius, index) => {
          ctx.beginPath();

          ctx.arc(
            node.x,
            node.y,
            radius +
              (index === 0
                ? pulse * 5
                : 0),
            0,
            Math.PI * 2
          );

          ctx.strokeStyle = `rgba(
            255,
            255,
            255,
            ${
              0.08 +
              index * 0.04
            }
          )`;

          ctx.lineWidth =
            index === 0
              ? 0.9
              : 0.7;

          ctx.stroke();
        }
      );

      /*
       * Outer rotating markers
       */

      for (
        let i = 0;
        i < 8;
        i++
      ) {
        const angle =
          time * 0.00012 +
          (Math.PI * 2 * i) /
            8;

        const radius = 96;

        const x =
          node.x +
          Math.cos(angle) *
            radius;

        const y =
          node.y +
          Math.sin(angle) *
            radius;

        ctx.beginPath();

        ctx.arc(
          x,
          y,
          2.2,
          0,
          Math.PI * 2
        );

        ctx.fillStyle =
          "rgba(255,255,255,0.8)";

        ctx.fill();
      }

      /*
       * Shield
       */

      const x = node.x;
      const y = node.y;

      const width = 46;
      const height = 56;

      ctx.beginPath();

      ctx.moveTo(
        x,
        y - height / 2
      );

      ctx.lineTo(
        x + width / 2,
        y - height / 4
      );

      ctx.lineTo(
        x + width / 2 - 3,
        y + 10
      );

      ctx.quadraticCurveTo(
        x,
        y + height / 2,
        x - width / 2 + 3,
        y + 10
      );

      ctx.lineTo(
        x - width / 2,
        y - height / 4
      );

      ctx.closePath();

      ctx.strokeStyle =
        "rgba(255,255,255,0.95)";

      ctx.lineWidth = 1.6;

      ctx.stroke();

      /*
       * Shield lock
       */

      ctx.beginPath();

      ctx.roundRect(
        x - 7,
        y - 1,
        14,
        12,
        2
      );

      ctx.strokeStyle =
        "rgba(255,255,255,0.95)";

      ctx.lineWidth = 1.3;

      ctx.stroke();

      ctx.beginPath();

      ctx.arc(
        x,
        y - 1,
        5,
        Math.PI,
        0
      );

      ctx.stroke();

      /*
       * Center pulse
       */

      ctx.beginPath();

      ctx.arc(
        x,
        y + 5,
        1.8,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        "rgba(255,255,255,0.95)";

      ctx.fill();
    };

    /*
     * ============================================================
     * STRONG NEURAL CONNECTION
     * ============================================================
     */

    const drawConnection = (
      a: Node,
      b: Node,
      opacity: number,
      major = false
    ) => {
      const dx =
        b.x - a.x;

      const dy =
        b.y - a.y;

      const distance =
        Math.sqrt(
          dx * dx +
            dy * dy
        );

      const midX =
        (a.x + b.x) / 2;

      const midY =
        (a.y + b.y) / 2;

      /*
       * Large sweeping curve
       */

      const curve = Math.min(
        distance * 0.3,
        major ? 120 : 75
      );

      const controlX =
        midX - dy * 0.14;

      const controlY =
        midY + dx * 0.14;

      /*
       * Glow underneath major neural paths
       */

      if (major) {
        ctx.beginPath();

        ctx.moveTo(
          a.x,
          a.y
        );

        ctx.quadraticCurveTo(
          controlX,
          controlY - curve,
          b.x,
          b.y
        );

        ctx.strokeStyle =
          `rgba(255,255,255,${
            opacity * 0.35
          })`;

        ctx.lineWidth = 5;

        ctx.stroke();
      }

      /*
       * Main neural path
       */

      ctx.beginPath();

      ctx.moveTo(
        a.x,
        a.y
      );

      ctx.quadraticCurveTo(
        controlX,
        controlY - curve,
        b.x,
        b.y
      );

      ctx.strokeStyle =
        `rgba(255,255,255,${opacity})`;

      ctx.lineWidth =
        major ? 1.8 : 0.65;

      ctx.stroke();

      /*
       * Secondary parallel neural strand
       */

      if (major) {
        ctx.beginPath();

        ctx.moveTo(
          a.x,
          a.y
        );

        ctx.quadraticCurveTo(
          controlX + 8,
          controlY -
            curve +
            10,
          b.x,
          b.y
        );

        ctx.strokeStyle =
          `rgba(255,255,255,${
            opacity * 0.28
          })`;

        ctx.lineWidth = 0.7;

        ctx.stroke();
      }
    };

    /*
     * ============================================================
     * DATA PACKET
     * ============================================================
     */

    const drawDataPacket = (
      a: Node,
      b: Node,
      time: number
    ) => {
      const progress =
        (time * 0.000045 +
          a.pulse) %
        1;

      const x =
        a.x +
        (b.x - a.x) *
          progress;

      const y =
        a.y +
        (b.y - a.y) *
          progress;

      /*
       * Packet glow
       */

      drawGlow(
        x,
        y,
        18,
        0.12
      );

      ctx.beginPath();

      ctx.arc(
        x,
        y,
        2,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        "rgba(255,255,255,0.95)";

      ctx.fill();
    };

    /*
     * ============================================================
     * LARGE NEURAL WAVES
     * ============================================================
     */

    const drawNeuralWave = (
      time: number,
      offset: number
    ) => {
      ctx.beginPath();

      const amplitude = 75;

      const frequency = 0.004;

      for (
        let x = -100;
        x <
        window.innerWidth +
          100;
        x += 12
      ) {
        const y =
          window.innerHeight *
            offset +
          Math.sin(
            x * frequency +
              time * 0.00012
          ) *
            amplitude;

        if (x === -100) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.strokeStyle =
        "rgba(255,255,255,0.07)";

      ctx.lineWidth = 1.2;

      ctx.stroke();
    };

    /*
     * ============================================================
     * ANIMATION
     * ============================================================
     */

    const animate = (
      time: number
    ) => {
      ctx.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
      );

      /*
       * Large neural waves
       */

      drawNeuralWave(
        time,
        0.28
      );

      drawNeuralWave(
        time,
        0.55
      );

      drawNeuralWave(
        time,
        0.76
      );

      /*
       * Slow node movement
       */

      nodes.forEach(
        (node) => {
          if (
            node.type ===
            "security"
          ) {
            return;
          }

          node.x += node.vx;
          node.y += node.vy;

          if (
            node.x < -100 ||
            node.x >
              window.innerWidth +
                100
          ) {
            node.vx *= -1;
          }

          if (
            node.y < -100 ||
            node.y >
              window.innerHeight +
                100
          ) {
            node.vy *= -1;
          }
        }
      );

      /*
       * Draw network
       */

      nodes.forEach(
        (node, index) => {
          nodes
            .slice(index + 1)
            .forEach(
              (other) => {
                const dx =
                  node.x -
                  other.x;

                const dy =
                  node.y -
                  other.y;

                const distance =
                  Math.sqrt(
                    dx * dx +
                      dy * dy
                  );

                const connectedToHub =
                  node.type ===
                    "security" ||
                  other.type ===
                    "security";

                /*
                 * Main neural paths
                 */

                const maxDistance =
                  connectedToHub
                    ? 420
                    : 210;

                if (
                  distance <
                  maxDistance
                ) {
                  const strength =
                    1 -
                    distance /
                      maxDistance;

                  /*
                   * Stronger opacity
                   */

                  const opacity =
                    strength *
                    (connectedToHub
                      ? 0.38
                      : 0.16);

                  /*
                   * Some connections
                   * become major paths
                   */

                  const major =
                    connectedToHub &&
                    distance < 270;

                  drawConnection(
                    node,
                    other,
                    opacity,
                    major
                  );

                  /*
                   * Data movement
                   */

                  if (
                    connectedToHub &&
                    distance <
                      360
                  ) {
                    drawDataPacket(
                      node,
                      other,
                      time
                    );
                  }
                }
              }
            );
        }
      );

      /*
       * Draw nodes
       */

      nodes.forEach(
        (node) => {
          switch (
            node.type
          ) {
            case "security":
              drawSecurityHub(
                node,
                time
              );
              break;

            case "database":
              drawDatabase(
                node,
                time
              );
              break;

            case "lock":
              drawLock(
                node,
                time
              );
              break;

            default:
              drawNormalNode(
                node
              );
          }
        }
      );

      animationFrame =
        requestAnimationFrame(
          animate
        );
    };

    animate(0);

    return () => {
      cancelAnimationFrame(
        animationFrame
      );

      window.removeEventListener(
        "resize",
        resize
      );
    };
  }, []);

  /*
   * ============================================================
   * COMPONENT
   * ============================================================
   */

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">

      {/* Neural network */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-90"
      />

      {/* Floating cybersecurity intelligence */}
      <div className="absolute inset-0">

        {[
          {
            text: "THREAT INTELLIGENCE",
            sub:
              "DETECTION · ANALYSIS · RESPONSE",
            className:
              "left-[5%] top-[17%]",
            delay:
              "0s",
          },

          {
            text: "NETWORK SECURITY",
            sub:
              "MONITOR · ANALYZE · PROTECT",
            className:
              "right-[5%] top-[22%]",
            delay:
              "1.5s",
          },

          {
            text: "RISK ASSESSMENT",
            sub:
              "IDENTIFY · EVALUATE · MITIGATE",
            className:
              "left-[7%] top-[49%]",
            delay:
              "2s",
          },

          {
            text: "IDENTITY & ACCESS",
            sub:
              "AUTHENTICATION · AUTHORIZATION",
            className:
              "right-[7%] top-[49%]",
            delay:
              "0.8s",
          },

          {
            text: "VULNERABILITY",
            sub:
              "DISCOVERY · TESTING · REMEDIATION",
            className:
              "left-[6%] bottom-[21%]",
            delay:
              "2.5s",
          },

          {
            text: "INCIDENT RESPONSE",
            sub:
              "DETECT · CONTAIN · RECOVER",
            className:
              "right-[6%] bottom-[21%]",
            delay:
              "1.2s",
          },

          {
            text: "COMPLIANCE",
            sub:
              "GOVERNANCE · CONTROL · ASSURANCE",
            className:
              "left-[39%] top-[9%]",
            delay:
              "1.8s",
          },

          {
            text: "DATA PROTECTION",
            sub:
              "ENCRYPTION · PRIVACY · RESILIENCE",
            className:
              "left-[38%] bottom-[10%]",
            delay:
              "3s",
          },
        ].map(
          (
            item,
            index
          ) => (
            <div
              key={index}
              className={`absolute ${item.className} animate-[cyberFloat_8s_ease-in-out_infinite]`}
              style={{
                animationDelay:
                  item.delay,
              }}
            >
              {/* HUD line */}
              <div className="mb-2 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full border border-white/60" />

                <div className="h-px w-8 bg-white/30" />

                <span className="font-mono text-sm font-medium tracking-[0.28em] text-white/65 sm:text-base">
                  {item.text}
                </span>
              </div>

              {/* Supporting terminology */}
              <div className="ml-5 font-mono text-[8px] tracking-[0.18em] text-white/30 sm:text-[9px]">
                {item.sub}
              </div>
            </div>
          )
        )}

        {/* Small floating intelligence terms */}

        <span className="absolute left-[25%] top-[34%] font-mono text-[10px] tracking-[0.25em] text-white/30 animate-[cyberFloat_7s_ease-in-out_infinite]">
          FIREWALL
        </span>

        <span className="absolute right-[27%] top-[34%] font-mono text-[10px] tracking-[0.25em] text-white/30 animate-[cyberFloat_9s_ease-in-out_infinite] [animation-delay:1s]">
          SIEM
        </span>

        <span className="absolute left-[25%] bottom-[34%] font-mono text-[10px] tracking-[0.25em] text-white/30 animate-[cyberFloat_8s_ease-in-out_infinite] [animation-delay:2s]">
          ZERO TRUST
        </span>

        <span className="absolute right-[24%] bottom-[34%] font-mono text-[10px] tracking-[0.25em] text-white/30 animate-[cyberFloat_10s_ease-in-out_infinite] [animation-delay:3s]">
          ENDPOINT SECURITY
        </span>

        <span className="absolute left-[48%] top-[25%] font-mono text-[10px] tracking-[0.25em] text-white/30 animate-[cyberFloat_8s_ease-in-out_infinite] [animation-delay:1.5s]">
          AI ANALYSIS
        </span>

        <span className="absolute right-[42%] bottom-[25%] font-mono text-[10px] tracking-[0.25em] text-white/30 animate-[cyberFloat_9s_ease-in-out_infinite] [animation-delay:2.5s]">
          SECURITY CONTROLS
        </span>

        <span className="absolute left-[17%] top-[66%] font-mono text-[10px] tracking-[0.25em] text-white/25 animate-[cyberFloat_11s_ease-in-out_infinite]">
          THREAT DETECTION
        </span>

        <span className="absolute right-[16%] top-[66%] font-mono text-[10px] tracking-[0.25em] text-white/25 animate-[cyberFloat_8s_ease-in-out_infinite] [animation-delay:2s]">
          SECURITY MONITORING
        </span>
      </div>

      {/* Floating animation */}
      <style jsx>{`
        @keyframes cyberFloat {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
            opacity: 0.55;
          }

          50% {
            transform: translate3d(
              0,
              -10px,
              0
            );
            opacity: 0.85;
          }
        }
      `}</style>
    </div>
  );
}
