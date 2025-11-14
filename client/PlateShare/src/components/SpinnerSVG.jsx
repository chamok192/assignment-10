import React from "react";

/**
 * SpinnerSVG
 * A small reusable green dotted SVG spinner component.
 *
 * Props:
 * - size: number | string - width/height in px (number) or CSS size (string). Default: 32
 * - strokeWidth: number - thickness of the dots. Default: 5
 * - colorClass: string - Tailwind class for the spinner color. Default: "text-green-600"
 * - trackClass: string - Tailwind class for the track color. Default: "text-green-200"
 * - dash: number - dot length along the circle path. Default: 1.5
 * - gap: number - gap length between dots along the path. Default: 11
 * - duration: string - CSS time for a full spin (e.g., "0.9s", "1.2s"). Default: "0.9s"
 * - label: string - accessible label (also used as <title>); defaults to "Loading"
 * - className: string - extra classes for the wrapper
 */
function SpinnerSVG({
  size = 32,
  strokeWidth = 5,
  colorClass = "text-green-600",
  trackClass = "text-green-200",
  dash = 1.5,
  gap = 11,
  duration = "0.9s",
  label = "Loading",
  className = "",
}) {
  // Normalize numeric size to px
  const dim = typeof size === "number" ? `${size}px` : size;
  const r = 40;
  const center = 50;

  return (
    <div
      role="status"
      aria-label={label}
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: dim, height: dim }}
      data-testid="spinner-svg"
    >
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 100 100"
        className="block"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>{label}</title>

        {/* Track (static, light green dotted circle) */}
        <circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          className={trackClass}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${gap}`}
          opacity="0.5"
        />

        {/* Spinner (rotating, solid green dotted circle) */}
        <g
          className="animate-spin origin-center"
          style={{ transformOrigin: "50% 50%", animationDuration: duration }}
        >
          <circle
            cx={center}
            cy={center}
            r={r}
            fill="none"
            className={colorClass}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${gap}`}
          />
        </g>
      </svg>
    </div>
  );
}

export default SpinnerSVG;
