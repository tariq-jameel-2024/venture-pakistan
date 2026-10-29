"use client";
/* Venture Pakistan — brand mark.
   Compass ring + mountain ridge + subtle geometry. */

export function LogoMark({ size = 40 }: { size?: number; light?: boolean }) {
  const ring = "var(--champagne, #C9A86A)";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      role="img"
      aria-label="Venture Pakistan logo"
    >
      {/* compass ring */}
      <circle cx="32" cy="32" r="29" stroke={ring} strokeWidth="2.4" />
      <circle cx="32" cy="32" r="23.5" stroke={ring} strokeWidth="0.8" opacity="0.45" />
      {/* cardinal ticks */}
      <path d="M32 1.5v5M32 57.5v5M1.5 32h5M57.5 32h5" stroke={ring} strokeWidth="1.6" strokeLinecap="round" />
      {/* north needle */}
      <path d="M27.5 8.5h9L32 14.5l-4.5-6z" fill={ring} />
      {/* mountain ridge forming peak geometry */}
      <path
        d="M13 41.5 23 27l6.5 8L36 25l6 9.5 4.5-5.5L53 41.5"
        className="stroke-gray-950 dark:stroke-ivory"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* center pillar */}
      <path d="M32 30v11.5" stroke={ring} strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="32" cy="32" r="1.6" fill={ring} />
    </svg>
  );
}

export function LogoLockup({
  compact = false,
  light = true,
}: {
  compact?: boolean;
  light?: boolean;
}) {
  return (
    <span className="flex items-center gap-3">
      <LogoMark size={compact ? 34 : 40} light={light} />
      <span className="flex flex-col leading-none">
        <span
          className={`font-display font-semibold tracking-wide ${
            compact ? "text-[19px]" : "text-[22px]"
          } text-gray-950 dark:text-ivory`}
        >
          Venture <span className="italic font-medium text-champagne">Pakistan</span>
        </span>
        {!compact && (
          <span
            className="mt-1 text-[9px] font-bold uppercase text-gray-500 dark:text-ivory/50"
            style={{ letterSpacing: "0.34em" }}
          >
            Curated Pakistan Experiences
          </span>
        )}
      </span>
    </span>
  );
}

