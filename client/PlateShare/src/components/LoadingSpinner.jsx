import React from "react";


function LoadingSpinner({
  size = 48,
  thickness = 6,
  colorClass = "text-green-600",
  trackClass = "text-green-200",
  label,
  className = "",
}) {
 
  const r = 40;
  const center = 50;

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
