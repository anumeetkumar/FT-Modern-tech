"use client";

import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  Notifications,
  Schedule,
  LocationOn,
  Archive,
  Code,
  LocalShipping,
  VerifiedUser,
  Memory,
  BarChart,
  type SvgIconComponent,
} from "@mui/icons-material";

type NodeSpec = { label: string; icon: SvgIconComponent };

const NODES: NodeSpec[] = [
  { label: "Alerts", icon: Notifications },
  { label: "Reminders", icon: Schedule },
  { label: "Live Tracking", icon: LocationOn },
  { label: "History Tracking", icon: Archive },
  { label: "Developers / API", icon: Code },
  { label: "Logistics", icon: LocalShipping },
  { label: "Drivers Behaviour", icon: VerifiedUser },
  { label: "Sensors", icon: Memory },
  { label: "Reports", icon: BarChart },
];

const NODE_DIAM = 64;
const NODE_R = NODE_DIAM / 2;

export default function LoginAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 900, h: 600 });
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [centerHovered, setCenterHovered] = useState(false);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setDims({
        w: Math.max(360, r.width),
        h: Math.max(360, r.height),
      });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const layout = useMemo(() => computeLayout(NODES, dims), [dims]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[50vh] md:min-h-[70vh] rounded-3xl text-neutral-900 overflow-hidden"
    >
      {/* SVG connectors */}
      <svg
        viewBox={`0 0 ${dims.w} ${dims.h}`}
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="xMidYMid meet"
      >
        {layout.map((p, i) => (
          <g key={i}>
            <path
              d={p.path}
              className={`link ${i % 3 === 0 ? "delayed" : ""} ${
                hoveredNode === i ? "active" : ""
              } stroke-neutral-700`}
              stroke="currentColor"
              strokeWidth={hoveredNode === i ? "3" : "1.6"}
            />
            <circle
              r={hoveredNode === i ? 6 : 4}
              className="orb fill-neutral-700"
            >
              <animateMotion
                dur={`${
                  hoveredNode === i ? 1.5 : (2.2 + (i % 4) * 0.35).toFixed(2)
                }s`}
                repeatCount="indefinite"
                keyPoints="0;1;0"
                keyTimes="0;0.6;1"
                calcMode="spline"
                keySplines="0.25 0.1 0.25 1; 0.25 0.1 0.25 1"
                path={p.path}
                begin={`${i * 0.16}s`}
              />
            </circle>
          </g>
        ))}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle
          cx={dims.w / 2}
          cy={dims.h / 2}
          r={centerHovered ? 45 : 38}
          className={`transition-all duration-300 ${
            centerHovered ? "fill-gray-700" : "fill-neutral-700"
          }`}
          filter={centerHovered ? "url(#glow)" : "none"}
        />
      </svg>

      {/* Center widget */}
      <div
        className="absolute grid place-items-center select-none cursor-pointer"
        style={{
          left: dims.w / 2,
          top: dims.h / 2,
          transform: "translate(-50%,-50%)",
        }}
        onMouseEnter={() => setCenterHovered(true)}
        onMouseLeave={() => setCenterHovered(false)}
      >
        <div
          className={`relative rounded-full bg-primary text-background grid place-items-center shadow-[0_22px_60px_-10px_rgba(0,0,0,0.55)] transition-all duration-500 ${
            centerHovered
              ? "size-[140px] shadow-[0_30px_80px_-10px_rgba(0,0,0,0.7)] bg-primary"
              : "size-[120px]"
          }`}
        >
          <LocationOn
            sx={{ fontSize: centerHovered ? 48 : 40 }}
            className={`transition-all duration-300 ${
              centerHovered ? "scale-110" : ""
            }`}
          />
        </div>
      </div>

      {/* Nodes */}
      {layout.map((p, i) => {
        const Icon = NODES[i].icon;
        const isHovered = hoveredNode === i;
        return (
          <div
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2 select-none text-center cursor-pointer group"
            style={{ left: p.x, top: p.y }}
            onMouseEnter={() => setHoveredNode(i)}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <div
              className={`rounded-full bg-background flex items-center justify-center mx-auto shadow-md   transition-all duration-500 ${
                isHovered
                  ? "w-20 h-20 bg-primary text-background shadow-xl  ring-neutral-400 scale-110 -translate-y-2"
                  : "w-16 h-16 text-primary hover:bg-primary hover:text-white hover:scale-105 hover:shadow-lg ring-1 ring-black/10"
              }`}
            >
              <Icon
                sx={{ fontSize: isHovered ? 32 : 24 }}
                className="transition-all duration-300"
              />
            </div>
            <div
              className={`mt-2 typo-p500  whitespace-nowrap transition-all duration-300 ${
                isHovered
                  ? "text-primary font-semibold transform -translate-y-1 scale-105"
                  : "group-hover:text-primary/70"
              }`}
            >
              {NODES[i].label}
            </div>
          </div>
        );
      })}

      <style jsx>{`
        .link {
          fill: none;
          stroke-linecap: round;
          stroke-dasharray: 0 10;
          animation: dash 2.3s linear infinite;
          opacity: 0.86;
          transition: all 0.3s ease;
        }
        .link.active {
          stroke-dasharray: 0 8;
          animation: dash-fast 1.5s linear infinite;
          opacity: 1;
          filter: drop-shadow(0 0 8px rgba(0, 0, 0, 0.6));
        }
        .link.delayed {
          animation-delay: 0.35s;
        }
        @keyframes dash {
          to {
            stroke-dashoffset: -150;
          }
        }
        @keyframes dash-fast {
          to {
            stroke-dashoffset: -120;
          }
        }
      `}</style>
    </div>
  );
}

function computeLayout(nodes: NodeSpec[], dims: { w: number; h: number }) {
  const { w, h } = dims;
  const cx = w / 2;
  const cy = h / 2;
  const radius = Math.min(w, h) * 0.36;
  const step = (Math.PI * 2) / nodes.length;
  const startAngle = -Math.PI / 2;

  return nodes.map((n, i) => {
    const angle = startAngle + i * step;
    const nx = cx + radius * Math.cos(angle);
    const ny = cy + radius * Math.sin(angle);

    const ux = Math.cos(angle);
    const uy = Math.sin(angle);
    const ex = nx - ux * NODE_R;
    const ey = ny - uy * NODE_R;

    const midX = (cx + ex) / 2;
    const midY = (cy + ey) / 2;
    const ctrlX = midX + Math.cos(angle - Math.PI / 2) * 60 * (i % 2 ? 1 : -1);
    const ctrlY = midY + Math.sin(angle - Math.PI / 2) * 60 * (i % 2 ? 1 : -1);

    const path = `M ${cx} ${cy} Q ${ctrlX} ${ctrlY}, ${ex} ${ey}`;
    return { label: n.label, x: nx, y: ny, path };
  });
}
