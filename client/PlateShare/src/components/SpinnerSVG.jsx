import React from "react";


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
