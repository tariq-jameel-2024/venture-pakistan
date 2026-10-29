"use client";
import { useEffect, useRef, type ReactNode, type CSSProperties } from "react";
import { Star } from "lucide-react";

/* ---------- scroll reveal wrapper ---------- */
export function Reveal({
  children,
  delay = 0,
  className = "",
  scale = false,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  scale?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`${scale ? "reveal-scale" : "reveal"} ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

/* ---------- section heading ---------- */
export function SectionHeading({
  eyebrow,
  title,
  copy,
  align = "left",
  light = false,
}: {
  eyebrow: string;
  title: ReactNode;
  copy?: string;
  align?: "left" | "center";
  light?: boolean;
}) {
  return (
    <Reveal className={align === "center" ? "text-center mx-auto" : ""}>
      <p className="eyebrow text-amber-700 dark:text-champagne">{eyebrow}</p>
      <h2
        className={`mt-4 font-display font-medium leading-[1.05] text-[clamp(2rem,4.6vw,3.4rem)] ${
          light ? "text-gray-950" : "text-gray-950 dark:text-ivory"
        }`}
      >
        {title}
      </h2>
      {copy && (
        <p className={`mt-4 max-w-xl text-[15px] leading-relaxed ${light ? "text-gray-700" : "text-gray-700 dark:text-ivory/70"} ${align === "center" ? "mx-auto" : ""}`}>
          {copy}
        </p>
      )}
    </Reveal>
  );
}

/* ---------- stars ---------- */
export function Stars({ rating, className = "" }: { rating: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`} aria-label={`Rated ${rating} out of 5`}>
      <Star size={13} className="fill-champagne text-champagne" strokeWidth={1.5} />
      <span className="text-[13px] font-bold text-gray-950 dark:text-ivory tabular">{rating.toFixed(1)}</span>
    </span>
  );
}

/* ---------- toast ---------- */
export interface ToastItem {
  id: number;
  message: string;
  kind: "success" | "info" | "warn";
}

export function ToastStack({ toasts }: { toasts: ToastItem[] }) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-[138px] z-[120] flex flex-col items-center gap-2 px-4 md:bottom-8"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="toast-enter pointer-events-auto flex max-w-md items-center gap-3 rounded-full border border-gray-200 bg-white/95 py-2.5 pl-4 pr-5 shadow-2xl backdrop-blur-md dark:border-ivory/12 dark:bg-coal/95"
        >
          <span
            className={`h-2 w-2 shrink-0 rounded-full ${
              t.kind === "success" ? "bg-teal" : t.kind === "warn" ? "bg-copper" : "bg-champagne"
            }`}
          />
          <p className="text-[13.5px] font-semibold text-gray-900 dark:text-ivory">{t.message}</p>
        </div>
      ))}
    </div>
  );
}

/* ---------- modal shell (accessible, scroll-locked, ESC) ---------- */
export function useModalLifecycle(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);
}

/* ---------- counter animation ---------- */
export function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          io.disconnect();
          if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            el.textContent = `${value.toLocaleString()}${suffix}`;
            return;
          }
          const start = performance.now();
          const dur = 1400;
          const tick = (t: number) => {
            const p = Math.min(1, (t - start) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = `${Math.round(value * eased).toLocaleString()}${suffix}`;
            if (p < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
        });
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, suffix]);
  return (
    <span ref={ref} className="tabular">
      0{suffix}
    </span>
  );
}

