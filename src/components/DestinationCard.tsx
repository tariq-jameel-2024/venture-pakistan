import { Heart, ArrowRight, ArrowUpRight, Clock } from "lucide-react";
import { getDestination, formatPKR } from "../data/travel";
import { Stars } from "./ui";

export function DestinationCard({
  id, variant, isFav, ping, onFav, onOpen, onPlan,
}: {
  id: string;
  variant: "feature" | "standard" | "wide" | "wideReverse" | "tall" | "mobile";
  isFav: boolean;
  ping: boolean;
  onFav: (id: string) => void;
  onOpen: (id: string) => void;
  onPlan: (id: string) => void;
}) {
  const d = getDestination(id);

  const favBtn = (
    <button
      onClick={(e) => { e.stopPropagation(); onFav(d.id); }}
      aria-label={isFav ? `Remove ${d.name} from favorites` : `Save ${d.name} to favorites`}
      className={`btn-press z-10 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md ${
        isFav ? "bg-champagne text-gray-950" : "bg-white/80 text-gray-900 shadow hover:text-amber-700 dark:bg-ink/55 dark:text-ivory dark:hover:text-champagne"
      } ${ping ? "heart-pop" : ""}`}
    >
      <Heart size={17} className={isFav ? "fill-gray-950" : ""} />
    </button>
  );

  if (variant === "mobile") {
    return (
      <article className="card-lift w-[78vw] max-w-[320px] shrink-0 snap-start overflow-hidden rounded-xl border border-gray-200 bg-white text-gray-950 shadow-sm dark:border-ivory/10 dark:bg-coal dark:text-ivory dark:shadow-none">
        <div className="img-frame img-duotone relative h-44">
          <img src={d.image} alt={d.name} className="h-full w-full object-cover" loading="lazy" decoding="async" />
          <div className="absolute right-3 top-3">{favBtn}</div>
          <span className="absolute left-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-amber-800 shadow-sm backdrop-blur-md dark:bg-ink/65 dark:text-champagne">{d.region}</span>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-[22px] font-semibold leading-tight text-gray-950 dark:text-ivory">{d.name}</h3>
            <Stars rating={d.rating} />
          </div>
          <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-gray-600 dark:text-ivory/60">{d.description}</p>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-[12px] text-gray-500 dark:text-ivory/50">From <span className="font-display text-[19px] font-semibold text-amber-700 dark:text-champagne tabular">{formatPKR(d.startingPrice)}</span></p>
            <span className="text-[12px] font-bold text-gray-500 dark:text-ivory/50">{d.duration}</span>
          </div>
          <button onClick={() => onOpen(d.id)} className="glow-champagne group mt-3 flex w-full items-center justify-center gap-1.5 rounded-full bg-gray-950 py-3 text-[12px] font-extrabold uppercase tracking-[0.1em] text-white hover:bg-champagne hover:text-gray-950 dark:bg-ivory dark:text-ink dark:hover:bg-champagne">
            <span>Explore</span>
            <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
      </article>
    );
  }

  if (variant === "feature") {
    return (
      <article className="card-lift group relative h-[540px] cursor-pointer overflow-hidden rounded-xl border border-gray-300 dark:border-ivory/10" onClick={() => onOpen(d.id)}>
        <img src={d.image} alt={d.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-105" loading="lazy" decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/95 via-gray-950/40 to-transparent" />
        <div className="absolute left-5 top-5 flex items-center gap-2">
          <span className="rounded-full bg-champagne px-3 py-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-gray-950 shadow">No. 01 — Most loved</span>
        </div>
        <div className="absolute right-5 top-5" onClick={(e) => e.stopPropagation()}>{favBtn}</div>
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 text-white">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-champagne">{d.region}</p>
          <h3 className="mt-2 font-display text-[44px] font-medium leading-none text-white">{d.name}</h3>
          <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-white/85">{d.description}</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] font-semibold text-white/80">
            <Stars rating={d.rating} className="[&_span]:text-white" />
            <span className="inline-flex items-center gap-1.5"><Clock size={13} /> {d.duration}</span>
            <span>From <b className="font-display text-[20px] text-champagne tabular">{formatPKR(d.startingPrice)}</b></span>
          </div>
          <div className="mt-5 flex gap-3">
            <span className="glow-champagne group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[12.5px] font-extrabold uppercase tracking-[0.1em] text-gray-950 group-hover:bg-champagne">
              <span>Explore journey</span>
              <ArrowUpRight size={15} className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
            <button onClick={(e) => { e.stopPropagation(); onPlan(d.id); }}
              className="btn-press rounded-full border border-white/40 px-6 py-3 text-[12.5px] font-extrabold uppercase tracking-[0.1em] text-white backdrop-blur-sm hover:border-champagne hover:bg-white/10">
              Plan this trip
            </button>
          </div>
        </div>
      </article>
    );
  }

  if (variant === "standard") {
    return (
      <article className="card-lift group grid cursor-pointer grid-cols-[150px_1fr] overflow-hidden rounded-xl border border-gray-200 bg-white text-gray-950 shadow-sm transition-all hover:border-amber-500/50 dark:border-ivory/10 dark:bg-coal dark:text-ivory dark:shadow-none dark:hover:border-champagne/45" onClick={() => onOpen(d.id)}>
        <div className="img-frame relative min-h-[190px]">
          <img src={d.image} alt={d.name} className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
        </div>
        <div className="relative p-5">
          <div className="absolute right-4 top-4" onClick={(e) => e.stopPropagation()}>{favBtn}</div>
          <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-amber-700 dark:text-champagne">{d.region}</p>
          <h3 className="mt-1 font-display text-[26px] font-semibold leading-tight text-gray-950 dark:text-ivory">{d.name}</h3>
          <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-gray-600 dark:text-ivory/60">{d.description}</p>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-[12px] text-gray-500 dark:text-ivory/50">From <span className="font-display text-[19px] font-semibold text-amber-700 dark:text-champagne tabular">{formatPKR(d.startingPrice)}</span></p>
            <span className="inline-flex items-center gap-1 text-[12px] font-extrabold uppercase tracking-[0.08em] text-gray-600 group-hover:text-amber-700 dark:text-ivory/60 dark:group-hover:text-champagne">
              <span>Explore</span>
              <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </article>
    );
  }

  if (variant === "wide" || variant === "wideReverse") {
    const reverse = variant === "wideReverse";
    return (
      <article
        className={`card-lift group grid cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white text-gray-950 shadow-sm transition-all hover:border-amber-500/50 dark:border-ivory/10 dark:bg-coal dark:text-ivory dark:shadow-none dark:hover:border-champagne/45 md:grid-cols-2`}
        onClick={() => onOpen(d.id)}
      >
        <div className={`img-frame relative min-h-[260px] md:min-h-[300px] ${reverse ? "md:order-2" : ""}`}>
          <img src={d.image} alt={d.name} className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
          <span className="absolute left-5 top-5 rounded-full bg-white/85 px-3 py-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-amber-800 shadow-sm backdrop-blur-md dark:bg-ink/65 dark:text-champagne">
            {reverse ? "Coastal escape" : "Cultural icon"}
          </span>
        </div>
        <div className={`relative flex flex-col justify-center p-6 md:p-10 ${reverse ? "md:order-1" : ""}`}>
          <div className="absolute right-5 top-5" onClick={(e) => e.stopPropagation()}>{favBtn}</div>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-amber-700 dark:text-champagne">{d.region} · {d.altitude}</p>
          <h3 className="mt-2 font-display text-[38px] font-medium leading-none text-gray-950 dark:text-ivory">{d.name}</h3>
          <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-gray-600 dark:text-ivory/65">{d.description}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {d.highlights.slice(0, 4).map((h) => (
              <span key={h} className="rounded-full border border-gray-300 bg-gray-50 px-2.5 py-1 text-[11.5px] font-bold text-gray-700 dark:border-ivory/12 dark:bg-transparent dark:text-ivory/60">{h}</span>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-5">
            <Stars rating={d.rating} />
            <span className="text-[13px] font-semibold text-gray-600 dark:text-ivory/60">{d.duration} · {d.bestSeason}</span>
          </div>
          <div className="mt-5 flex items-center gap-4">
            <p className="text-[12px] text-gray-500 dark:text-ivory/50">From <span className="font-display text-[24px] font-semibold text-amber-700 dark:text-champagne tabular">{formatPKR(d.startingPrice)}</span></p>
            <button onClick={(e) => { e.stopPropagation(); onPlan(d.id); }}
              className="glow-champagne group ml-auto inline-flex items-center gap-2 rounded-full bg-gray-950 px-6 py-3 text-[12px] font-extrabold uppercase tracking-[0.1em] text-white hover:bg-champagne hover:text-gray-950 dark:bg-ivory dark:text-ink dark:hover:bg-champagne">
              <span>Plan this trip</span>
              <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </article>
    );
  }

  // tall
  return (
    <article className="card-lift group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-gray-200 bg-white text-gray-950 shadow-sm transition-all hover:border-amber-500/50 dark:border-ivory/10 dark:bg-coal dark:text-ivory dark:shadow-none dark:hover:border-champagne/45" onClick={() => onOpen(d.id)}>
      <div className="img-frame img-duotone relative h-64">
        <img src={d.image} alt={d.name} className="h-full w-full object-cover" loading="lazy" decoding="async" />
        <span className="absolute left-4 top-4 rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-amber-800 shadow-sm backdrop-blur-md dark:bg-ink/65 dark:text-champagne">{d.region}</span>
        <div className="absolute right-4 top-4" onClick={(e) => e.stopPropagation()}>{favBtn}</div>
        <div className="absolute bottom-3 left-4 z-10"><Stars rating={d.rating} className="bg-white/80 dark:bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm" /></div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-[27px] font-semibold leading-tight text-gray-950 dark:text-ivory">{d.name}</h3>
        <p className="mt-1.5 flex-1 text-[13.5px] leading-relaxed text-gray-600 dark:text-ivory/60">{d.description}</p>
        <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3.5 dark:border-ivory/10">
          <p className="text-[12px] text-gray-500 dark:text-ivory/50">From <span className="font-display text-[20px] font-semibold text-amber-700 dark:text-champagne tabular">{formatPKR(d.startingPrice)}</span></p>
          <span className="text-[12px] font-bold text-gray-500 dark:text-ivory/50">{d.duration}</span>
        </div>
        <button onClick={(e) => { e.stopPropagation(); onPlan(d.id); }}
          className="glow-champagne group mt-3 flex w-full items-center justify-center gap-1.5 rounded-full border border-gray-300 py-3 text-[12px] font-extrabold uppercase tracking-[0.1em] text-gray-900 hover:border-amber-600 hover:bg-amber-50 hover:text-amber-800 dark:border-ivory/20 dark:text-ivory dark:hover:border-champagne dark:hover:bg-transparent dark:hover:text-champagne">
          <span>Plan this trip</span>
          <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
        </button>
      </div>
    </article>
  );
}
