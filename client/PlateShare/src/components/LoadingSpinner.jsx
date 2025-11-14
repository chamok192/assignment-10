import React from "react";

/**
 * LoadingSpinner
 * A reusable green dotted loading spinner.
 *
 * Props:
 * - size: number (px). Overall width/height. Default: 48
 * - thickness: number (in SVG units relative to 100 viewBox). Default: 6
 * - colorClass: string. Tailwind text color for the spinner. Default: "text-green-600"
 * - trackClass: string. Tailwind text color for the track. Default: "text-green-200"
 * - label: string. Optional accessible label text (also visually shown if provided).
 * - className: string. Optional extra classes for the wrapper.
 */
function LoadingSpinner({
  size = 48,
  thickness = 6,
  colorClass = "text-green-600",
  trackClass = "text-green-200",
  label,
  className = "",
}) {
  // SVG uses viewBox 0..100, so radius 40 fits well with stroke thickness.
  const r = 40;
  const center = 50;

  // Dotted effect via strokeDasharray with round linecap.
  // Adjust these for denser/sparser dots.
  const dash = 1.5;
  const gap = 12;

  // Accessible label
  const ariaLabel = label || "Loading";

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
      className={`inline-flex flex-col items-center justify-center ${className}`}
      style={{ inlineSize: size, blockSize: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="block"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Track (static, light green dots) */}
        <circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          className={trackClass}
          stroke="currentColor"
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${gap}`}
          opacity="0.5"
        />
        {/* Spinner (rotating, solid green dots) */}
        <g className="animate-spin origin-center" style={{ transformOrigin: "50% 50%" }}>
          <circle
            cx={center}
            cy={center}
            r={r}
            fill="none"
            className={colorClass}
            stroke="currentColor"
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${gap}`}
          />
        </g>
      </svg>

      {label ? (
        <div className="mt-2 text-xs font-medium text-gray-600">{label}</div>
      ) : null}
    </div>
  );
}

export default LoadingSpinner;
