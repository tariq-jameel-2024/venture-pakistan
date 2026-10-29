import { useParams, useNavigate } from "react-router-dom";
import { getDestination, formatPKR } from "../data/travel";
import { useTravelStore } from "../store/useTravelStore";
import { Heart, ArrowRight, ArrowLeft, Mountain, Stars as StarsIcon } from "lucide-react";
import { Stars } from "../components/ui";

export default function DestinationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const store = useTravelStore();
  
  if (!id) return null;
  
  const d = getDestination(id);
  const isFav = store.favorites.has(id);
  
  if (!d) {
    return (
      <main className="flex min-h-[100svh] items-center justify-center bg-[#faf8f5] text-gray-950 dark:bg-ink dark:text-ivory">
        <p>Destination not found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-[100svh] bg-[#faf8f5] text-gray-950 pb-20 md:pb-0 dark:bg-coal dark:text-ivory">
      <div className="relative h-[40vh] md:h-[50vh] w-full">
        <img src={d.image} alt={d.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/70 via-transparent to-[#faf8f5] dark:from-ink/60 dark:to-coal" />
        
        <button onClick={() => navigate(-1)} aria-label="Go back"
          className="btn-press absolute left-5 top-24 md:top-28 flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-black/50 text-white backdrop-blur-md hover:border-white">
          <ArrowLeft size={20} />
        </button>

        <div className="absolute bottom-6 left-5 right-5 mx-auto max-w-4xl md:bottom-10 md:left-8">
          <p className="text-[12px] font-bold uppercase tracking-[0.3em] text-amber-700 dark:text-champagne">{d.region} · {d.altitude}</p>
          <h1 className="mt-2 font-display text-[42px] font-medium leading-none text-gray-950 dark:text-ivory md:text-[56px]">{d.name}</h1>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-5 py-8 md:px-8 md:py-12">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[14px] font-semibold text-gray-600 dark:text-ivory/70">
          <Stars rating={d.rating} />
          <span>{d.reviews} traveler reviews</span>
          <span>Best season: <b className="text-gray-950 dark:text-ivory">{d.bestSeason}</b></span>
        </div>
        
        <p className="mt-8 text-[16px] leading-relaxed text-gray-800 dark:text-ivory/85 md:text-[18px]">
          {d.longDescription}
        </p>

        <div className="mt-8 flex flex-wrap gap-2.5">
          {d.tags.map((t) => (
            <span key={t} className="rounded-full border border-gray-300 bg-white px-4 py-1.5 text-[13px] font-bold text-gray-700 shadow-sm dark:border-ivory/15 dark:bg-ink/40 dark:text-ivory/70 dark:shadow-none">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-12">
          <h2 className="text-[12px] font-extrabold uppercase tracking-[0.24em] text-gray-500 dark:text-ivory/50">Highlights</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {d.highlights.map((h) => (
              <li key={h} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 text-[14px] font-semibold text-gray-800 shadow-sm dark:border-ivory/10 dark:bg-ink dark:text-ivory/85 dark:shadow-none">
                <Mountain size={16} className="shrink-0 text-amber-700 dark:text-champagne" /> {h}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-ivory/10 dark:bg-ink dark:shadow-none">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-teal-700 dark:text-teal">Stay</p>
            <p className="mt-2 text-[14px] leading-relaxed text-gray-700 dark:text-ivory/75">{d.stay}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-ivory/10 dark:bg-ink dark:shadow-none">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-teal-700 dark:text-teal">Transport</p>
            <p className="mt-2 text-[14px] leading-relaxed text-gray-700 dark:text-ivory/75">{d.transport}</p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg md:flex-row md:p-8 dark:border-ivory/10 dark:bg-ink/80 dark:shadow-none">
          <div className="mr-auto">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-ivory/40">Starting from</p>
            <p className="font-display text-[28px] font-semibold text-amber-700 dark:text-champagne tabular md:text-[34px]">{formatPKR(d.startingPrice)}</p>
          </div>
          
          <button onClick={() => store.toggleFav(d.id)} aria-label="Toggle favorite"
            className={`btn-press flex h-14 w-14 shrink-0 items-center justify-center rounded-full border ${isFav ? "border-champagne bg-champagne text-gray-950" : "border-gray-300 text-gray-800 hover:border-amber-600 dark:border-ivory/20 dark:text-ivory dark:hover:border-champagne"}`}>
            <Heart size={22} className={isFav ? "fill-gray-950" : ""} />
          </button>
          
          <button onClick={() => store.openPlanner(d.id)}
            className="btn-press flex w-full items-center justify-center gap-2 rounded-full bg-gray-950 px-8 py-4 text-[13.5px] font-extrabold uppercase tracking-[0.1em] text-white hover:bg-champagne hover:text-gray-950 md:w-auto dark:bg-ivory dark:text-ink dark:hover:bg-champagne">
            Plan this trip <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </main>
  );
}
