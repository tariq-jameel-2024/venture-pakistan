import { useState, useMemo } from "react";
import { ArrowRight, ArrowUpRight, CalendarDays, Users, Wallet, MapPin, Clock, Headset, BedDouble, Route, Search, Compass, MessageCircle, ShieldCheck, Sparkles, Quote, Mountain, Heart, ChevronRight, BadgeCheck, UtensilsCrossed } from "lucide-react";
import { Reveal, SectionHeading, Stars, AnimatedNumber } from "../components/ui";
import { DestinationCard } from "../components/DestinationCard";
import ExplorerMap from "../components/ExplorerMap";
import { PlannerSection } from "../components/Planner";
import { StyleIcon } from "../components/Drawers";
import { QuickSearchDock } from "../components/QuickSearchDock";
import { useTravelStore } from "../store/useTravelStore";
import { WhatsAppIcon } from "../components/WhatsAppIcon";
import {
  DESTINATIONS, TRAVEL_STYLES, IMAGES, formatPKR, getDestination, generateMockItinerary,
  type PlannerInput, type GeneratedTrip, whatsappLink
} from "../data/travel";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const store = useTravelStore();
  const {
    favorites,
    toggleFav,
    openPlanner,
    setSearchOpen,
    explorerId,
    setExplorerId,
    heartPing,
    saveTrip,
  } = store;

  // We can just define talkToTariq here or import it if needed.
  const talkToTariq = (destination?: string) => {
    const msg = destination
      ? `Hello Venture Pakistan,\nI would like to plan a trip to ${destination}.\nPlease share options and availability.`
      : `Hello Venture Pakistan,\nI found Venture Pakistan and would like help planning a journey across Pakistan.`;
    window.open(whatsappLink(msg), "_blank", "noopener");
  };

  const [qp, setQp] = useState({ dest: "hunza", date: "", duration: "5", travelers: "2", budget: "Comfort" });

  const signatureTrip = useMemo(
    () => generateMockItinerary({
      destinationId: "hunza", days: 5, travelers: 2,
      budget: "Premium", travelStyle: "Culture", pace: "Balanced",
      interests: ["Mountains", "History", "Photography"],
    }),
    []
  );

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const openDestination = (id: string) => navigate(`/destination/${id}`);

  return (
    <main className="pb-20 lg:pb-0">
      {/* ================= HERO ================= */}
      <section className="relative flex min-h-[100svh] flex-col overflow-hidden" aria-label="Introduction">
        <div className="absolute inset-0">
          <picture>
            <source media="(max-width: 768px)" srcSet={IMAGES.heroMobile} type="image/webp" />
            <source srcSet={IMAGES.heroSrcSet} type="image/webp" />
            <img
              src={IMAGES.hero}
              srcSet={IMAGES.heroSrcSet}
              sizes="100vw"
              alt="Autumn in Hunza Valley with snow-capped Karakoram peaks"
              className="h-full w-full object-cover object-center"
              // @ts-expect-error Next.js supports fetchPriority
              fetchpriority="high"
              decoding="async"
              onError={(e) => { (e.target as HTMLImageElement).src = IMAGES.heroFallback; }}
            />
          </picture>
          {/* Multi-layered cinematic vignette & contrast gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/70 via-55% to-[#faf8f5] dark:from-ink/85 dark:via-ink/40 dark:to-ink" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_45%,rgba(255,255,255,0.92)_0%,rgba(255,255,255,0.65)_55%,transparent_100%)] dark:bg-[radial-gradient(ellipse_at_20%_45%,rgba(11,14,20,0.85)_0%,rgba(11,14,20,0.45)_55%,transparent_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent dark:from-ink/85 dark:via-ink/40 dark:to-transparent" />
        </div>

        <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 pb-10 pt-32 md:px-8 lg:pt-36">
          <div className="grid items-end gap-10 lg:grid-cols-[1.25fr_0.75fr]">
            <div>
              <Reveal>
                <div className="inline-flex items-center gap-2.5 rounded-full border border-champagne/40 bg-white/85 px-4 py-1.5 shadow-sm backdrop-blur-md dark:border-champagne/35 dark:bg-ink/70">
                  <span className="inline-block h-2 w-2 rounded-full bg-champagne pulse-status" aria-hidden="true" />
                  <p className="eyebrow text-amber-800 text-[11px] font-bold tracking-[0.26em] dark:text-champagne">
                    Curated Pakistan Journeys · Venture Pakistan
                  </p>
                </div>
              </Reveal>
              <Reveal delay={90}>
                <h1 className="mt-5 font-display text-[clamp(2.9rem,8vw,5.6rem)] font-medium leading-[0.98] text-gray-950 dark:text-ivory dark:drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
                  Pakistan,<br />
                  <span className="italic text-amber-600 dark:text-champagnelight">Beautifully</span> Unfiltered.
                </h1>
              </Reveal>
              <Reveal delay={170}>
                <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-gray-800 dark:text-ivory/90 dark:drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] md:text-[17.5px]">
                  Discover mountains, valleys, heritage and coastlines through journeys designed around you — not around a bus schedule.
                </p>
              </Reveal>
              <Reveal delay={240}>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => openPlanner("hunza")}
                    className="glow-champagne group inline-flex items-center justify-center gap-2 rounded-full bg-champagne px-8 py-4 text-[13px] font-extrabold uppercase tracking-[0.12em] text-gray-950 hover:bg-champagnelight"
                  >
                    <span>Plan my journey</span>
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                  </button>
                  <button
                    onClick={() => scrollTo("destinations")}
                    className="btn-press inline-flex items-center justify-center gap-2 rounded-full border border-gray-950/25 px-8 py-4 text-[13px] font-extrabold uppercase tracking-[0.12em] text-gray-950 backdrop-blur-sm hover:border-gray-950 hover:bg-gray-950/5 dark:border-ivory/30 dark:text-ivory dark:hover:border-ivory dark:hover:bg-ivory/10"
                  >
                    Explore Pakistan
                  </button>
                </div>
              </Reveal>
              <Reveal delay={300}>
                <div className="mt-8 flex items-center gap-4 text-[12.5px] font-semibold text-gray-700 dark:text-ivory/60">
                  <span className="flex -space-x-2" aria-hidden="true">
                    {[IMAGES.kalash, IMAGES.attabad, IMAGES.lahoreFood].map((s, i) => (
                      <img key={i} src={s} alt="" className="h-8 w-8 rounded-full border-2 border-white dark:border-ink object-cover" loading="lazy" />
                    ))}
                  </span>
                  <span><b className="text-gray-950 dark:text-ivory">500+ travelers</b> guided since 2019 · ★ 4.9 average</span>
                </div>
              </Reveal>
            </div>

            {/* floating trip preview */}
            <Reveal delay={260} scale className="hidden lg:block">
              <article className="overflow-hidden rounded-xl border border-gray-200/90 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-ivory/15 dark:bg-ink/70">
                <div className="img-frame relative h-52">
                  <img src={getDestination("hunza").image} alt="Hunza Valley in autumn" className="h-full w-full object-cover" />
                  <span className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-amber-800 shadow-sm backdrop-blur-md dark:bg-ink/70 dark:text-champagne">
                    Featured journey
                  </span>
                  <button
                    onClick={() => toggleFav("hunza")}
                    aria-label="Save Hunza to favorites"
                    className={`btn-press absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md ${favorites.has("hunza") ? "bg-champagne text-gray-950" : "bg-white/80 text-gray-900 shadow hover:text-amber-700 dark:bg-ink/60 dark:text-ivory dark:hover:text-champagne"} ${heartPing === "hunza" ? "heart-pop" : ""}`}
                  >
                    <Heart size={17} className={favorites.has("hunza") ? "fill-gray-950" : ""} />
                  </button>
                </div>
                <div className="p-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-500 dark:text-ivory/50">Hunza Valley</p>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-[14px] font-bold text-gray-950 dark:text-ivory">5 Days / 4 Nights</p>
                    <Stars rating={4.9} />
                  </div>
                  <div className="mt-1 flex items-end justify-between">
                    <p className="text-[13px] text-gray-600 dark:text-ivory/55">From <span className="font-display text-[22px] font-semibold text-amber-700 dark:text-champagne tabular">PKR 85,000</span></p>
                  </div>
                  <button
                    onClick={() => openDestination("hunza")}
                    className="btn-press mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gray-950 py-3 text-[12.5px] font-extrabold uppercase tracking-[0.1em] text-white hover:bg-champagne hover:text-gray-950 dark:bg-ivory dark:text-ink dark:hover:bg-champagne"
                  >
                    Explore journey <ArrowUpRight size={15} />
                  </button>
                </div>
              </article>
            </Reveal>
          </div>

          {/* ---------- quick planner bar ---------- */}
          <Reveal delay={320}>
            <QuickSearchDock
              initialValues={qp}
              onBuildTrip={({ dest, days, travelers, budget, date }) => {
                setQp({ dest, date: date || qp.date, duration: String(days), travelers: String(travelers), budget });
                openPlanner(dest, {
                  days,
                  travelers,
                  budget,
                });
              }}
            />
          </Reveal>
        </div>
      </section>

      {/* ================= TRUST BAR ================= */}
      <section className="border-y border-gray-200/90 bg-white dark:border-ivory/10 dark:bg-coal" aria-label="Why travel with us">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-gray-200/90 px-0 md:grid-cols-4 dark:divide-ivory/10">
          {[
            { icon: Users, big: "500+", small: "Travelers guided" },
            { icon: Headset, big: "24/7", small: "Local support" },
            { icon: BedDouble, big: "120+", small: "Handpicked stays" },
            { icon: Route, big: "100%", small: "Custom itineraries" },
          ].map((t, i) => (
            <Reveal key={t.small} delay={i * 80} className="flex items-center justify-center gap-3 px-4 py-5">
              <t.icon size={19} className="shrink-0 text-amber-600 dark:text-champagne" strokeWidth={1.8} />
              <span className="text-left">
                <span className="block font-display text-[21px] font-semibold leading-none text-gray-950 dark:text-ivory tabular">{t.big}</span>
                <span className="mt-1 block text-[11px] font-bold uppercase tracking-[0.16em] text-gray-500 dark:text-ivory/45">{t.small}</span>
              </span>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= FEATURED DESTINATIONS ================= */}
      <section id="destinations" className="scroll-mt-20 bg-[#faf8f5] dark:bg-ink py-20 md:py-28" aria-label="Featured destinations">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow="Explore Pakistan"
              title={<>Places Worth Taking<br />the <span className="italic text-amber-600 dark:text-champagne">Long Way</span> To.</>}
              copy="From the highest valleys to the Arabian Sea — eight regions, each with its own rhythm, each planned around yours."
            />
            <Reveal delay={120}>
              <button onClick={() => setSearchOpen(true)}
                className="btn-press inline-flex shrink-0 items-center gap-2 rounded-full border border-gray-300 bg-white/80 px-5 py-3 text-[12.5px] font-extrabold uppercase tracking-[0.1em] text-gray-900 shadow-sm hover:border-amber-600 hover:text-amber-700 dark:border-ivory/20 dark:bg-transparent dark:text-ivory dark:shadow-none dark:hover:border-champagne dark:hover:text-champagne">
                <Search size={15} /> Search all places
              </button>
            </Reveal>
          </div>

          {/* mobile: horizontal snap scroller */}
          <div className="no-scrollbar -mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 lg:hidden">
            {DESTINATIONS.slice(0, 8).map((d) => (
              <DestinationCard key={d.id} id={d.id} variant="mobile" isFav={favorites.has(d.id)}
                ping={heartPing === d.id} onFav={toggleFav} onOpen={openDestination} onPlan={openPlanner} />
            ))}
          </div>

          {/* desktop: editorial asymmetric grid */}
          <div className="mt-12 hidden lg:block">
            <div className="grid grid-cols-12 gap-5">
              <Reveal className="col-span-7">
                <DestinationCard id="hunza" variant="feature" isFav={favorites.has("hunza")}
                  ping={heartPing === "hunza"} onFav={toggleFav} onOpen={openDestination} onPlan={openPlanner} />
              </Reveal>
              <div className="col-span-5 flex flex-col gap-5">
                <Reveal delay={100}><DestinationCard id="skardu" variant="standard" isFav={favorites.has("skardu")} ping={heartPing === "skardu"} onFav={toggleFav} onOpen={openDestination} onPlan={openPlanner} /></Reveal>
                <Reveal delay={160}><DestinationCard id="fairy-meadows" variant="standard" isFav={favorites.has("fairy-meadows")} ping={heartPing === "fairy-meadows"} onFav={toggleFav} onOpen={openDestination} onPlan={openPlanner} /></Reveal>
              </div>
            </div>

            <Reveal className="mt-5">
              <DestinationCard id="lahore" variant="wide" isFav={favorites.has("lahore")} ping={heartPing === "lahore"} onFav={toggleFav} onOpen={openDestination} onPlan={openPlanner} />
            </Reveal>

            <div className="mt-5 grid grid-cols-3 gap-5">
              {(["swat", "chitral", "neelum"] as const).map((id, i) => (
                <Reveal key={id} delay={i * 90}>
                  <DestinationCard id={id} variant="tall" isFav={favorites.has(id)} ping={heartPing === id} onFav={toggleFav} onOpen={openDestination} onPlan={openPlanner} />
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-5">
              <DestinationCard id="gwadar" variant="wideReverse" isFav={favorites.has("gwadar")} ping={heartPing === "gwadar"} onFav={toggleFav} onOpen={openDestination} onPlan={openPlanner} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ================= EXPLORER MAP ================= */}
      <ExplorerMap
        activeId={explorerId}
        onSelect={setExplorerId}
        favorites={favorites}
        onToggleFav={toggleFav}
        onPlan={(id) => openPlanner(id)}
        onOpenDetail={openDestination}
      />

      {/* ================= TRAVEL STYLES ================= */}
      <section id="styles" className="scroll-mt-20 bg-white dark:bg-coal py-20 md:py-28" aria-label="Travel styles">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHeading
            eyebrow="Travel your way"
            title={<>Travel <span className="italic text-amber-600 dark:text-champagne">Your Way.</span></>}
            copy="Six ways to see the same country — pick the rhythm that fits you, and we'll handle the route."
          />
          <div className="no-scrollbar -mx-5 mt-10 flex snap-x gap-4 overflow-x-auto px-5 pb-2 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0">
            {TRAVEL_STYLES.map((s, i) => (
              <Reveal key={s.id} delay={(i % 3) * 90} className="w-[82vw] max-w-[340px] shrink-0 snap-start lg:w-auto lg:max-w-none">
                <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-[#faf8f5] shadow-sm transition-colors hover:border-amber-500/50 dark:border-ivory/10 dark:bg-ink dark:shadow-none dark:hover:border-champagne/35">
                  <div className="img-frame img-duotone relative h-48">
                    <img src={s.image} alt={s.title} className="h-full w-full object-cover" loading="lazy" />
                    <span className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-amber-800 shadow-md backdrop-blur-md dark:bg-ink/70 dark:text-champagne">
                      <StyleIcon icon={s.icon} />
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-[24px] font-semibold text-gray-950 dark:text-ivory">{s.title}</h3>
                    <p className="mt-1.5 flex-1 text-[13.5px] leading-relaxed text-gray-600 dark:text-ivory/60">{s.description}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {s.destinations.map((d) => (
                        <button key={d} onClick={() => openDestination(d)}
                          className="btn-press rounded-full border border-gray-300 bg-white px-2.5 py-1 text-[11.5px] font-bold text-gray-700 hover:border-amber-600 hover:text-amber-700 dark:border-ivory/12 dark:bg-transparent dark:text-ivory/65 dark:hover:border-champagne/60 dark:hover:text-champagne">
                          {getDestination(d).shortName}
                        </button>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3.5 dark:border-ivory/10">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-ivory/40">{s.duration}</p>
                        <p className="text-[13.5px] font-bold text-amber-700 dark:text-champagne tabular">from {formatPKR(s.startingCost)}</p>
                      </div>
                      <button onClick={() => openPlanner(s.destinations[0])} aria-label={`Plan a ${s.title} trip`}
                        className="btn-press inline-flex items-center gap-1.5 rounded-full bg-gray-950 px-4 py-2.5 text-[11.5px] font-extrabold uppercase tracking-[0.08em] text-white hover:bg-champagne hover:text-gray-950 dark:bg-ivory dark:text-ink dark:hover:bg-champagne">
                        Plan <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how" className="scroll-mt-20 bg-[#faf8f5] dark:bg-ink py-20 md:py-28" aria-label="How it works">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <SectionHeading
                eyebrow="How it works"
                title={<>No Ordinary <span className="italic text-amber-600 dark:text-champagne">Tours.</span></>}
                copy="You don't just book a trip with Venture Pakistan. You get a carefully planned way to experience Pakistan — built around your time, style and budget."
              />
              <Reveal delay={150}>
                <button onClick={() => openPlanner("hunza")}
                  className="btn-press mt-8 inline-flex items-center gap-2 rounded-full bg-champagne px-7 py-3.5 text-[12.5px] font-extrabold uppercase tracking-[0.1em] text-gray-950 hover:bg-champagnelight">
                  Start with step one <ArrowRight size={15} />
                </button>
              </Reveal>
            </div>
            <ol className="divide-y divide-gray-200 border-y border-gray-200 dark:divide-ivory/10 dark:border-ivory/10">
              {[
                { n: "01", t: "Tell us your style", d: "Destination, days, travelers, budget and pace — sixty seconds in the planner, or one WhatsApp message.", icon: Compass },
                { n: "02", t: "Get your itinerary", d: "A day-by-day travel document with honest PKR budgeting, stays and insider notes.", icon: Sparkles },
                { n: "03", t: "Refine with Us", d: "Adjust anything over WhatsApp. Routes, hotels, pace — nothing is fixed until you love it.", icon: WhatsAppIcon },
                { n: "04", t: "Travel with backup", d: "Local drivers, trusted stays and 24/7 support from the ground — not a call centre.", icon: ShieldCheck },
              ].map((s, i) => (
                <Reveal key={s.n} delay={i * 80}>
                  <li className="group flex gap-5 py-6">
                    <span className="chapter-number text-[44px] font-bold leading-none md:text-[54px] text-amber-600/40 dark:text-champagne/30">{s.n}</span>
                    <div className="flex-1">
                      <h3 className="flex items-center gap-2 font-display text-[22px] font-semibold text-gray-950 dark:text-ivory">
                        <s.icon size={17} className="text-amber-600 dark:text-champagne" /> {s.t}
                      </h3>
                      <p className="mt-1 max-w-md text-[14px] leading-relaxed text-gray-600 dark:text-ivory/60">{s.d}</p>
                    </div>
                    <ChevronRight size={18} className="mt-2 shrink-0 text-gray-400 transition-all group-hover:translate-x-1 group-hover:text-amber-600 dark:text-ivory/20 dark:group-hover:text-champagne" />
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ================= AI PLANNER PROMO ================= */}
      <PlannerSection onOpen={() => openPlanner(explorerId)} />

      {/* ================= ABOUT TARIQ ================= */}
      <section id="about" className="scroll-mt-20 bg-[#f4efe6] py-20 text-gray-950 md:py-28 dark:bg-[#121620] dark:text-ivory" aria-label="About Tariq Jameel">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <Reveal>
              <div className="relative">
                <div className="overflow-hidden rounded-xl border border-gray-300/80 shadow-md dark:border-ivory/10">
                  <img src={IMAGES.tariq} alt="Tariq Jameel — founder and travel curator" className="aspect-[4/5] w-full object-cover" loading="lazy" />
                </div>
                <div className="absolute -bottom-6 -right-3 hidden w-52 rotate-2 overflow-hidden rounded-lg border-4 border-white shadow-xl sm:block md:-right-6 dark:border-[#121620]">
                  <img src={IMAGES.tariqAlt} alt="On the road in Pakistan" className="aspect-square w-full object-cover" loading="lazy" />
                </div>
                <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3.5 py-2 text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-amber-800 shadow-md backdrop-blur-md dark:bg-ink/80 dark:text-champagne">
                  Since 2019 · 500+ journeys
                </div>
              </div>
            </Reveal>
            <div>
              <Reveal>
                <p className="eyebrow text-amber-700 dark:text-champagne">About Tariq</p>
                <h2 className="mt-4 font-display text-[clamp(2rem,4.6vw,3.4rem)] font-medium leading-[1.05] text-gray-950 dark:text-ivory">
                  Your Local Travel Contact <span className="italic text-amber-600 dark:text-champagne">in Pakistan.</span>
                </h2>
                <p className="mt-2 text-[13px] font-extrabold uppercase tracking-[0.2em] text-gray-500 dark:text-ivory/50">Tariq Jameel — Founder & Lead Curator</p>
              </Reveal>
              <Reveal delay={120}>
                <p className="drop-cap mt-6 text-[15.5px] leading-relaxed text-gray-800 dark:text-ivory/75">
                  I'm Tariq. For six years I've been doing one thing: helping travelers see the Pakistan I know — the orchard terraces above Karimabad, the quiet hour at Badshahi Mosque, the roadside dhabas where the chai is always worth the stop. No scripts, no commission-driven detours. Just careful planning, honest pricing and people on the ground I trust with my own family.
                </p>
                <p className="mt-4 border-l-2 border-amber-600 pl-4 font-display text-[20px] italic leading-snug text-gray-900 dark:border-champagne dark:text-ivory/90">
                  “Most companies sell you seats. I plan you days you'll still talk about in ten years.”
                </p>
              </Reveal>
              <Reveal delay={180}>
                <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                  {[
                    { icon: Compass, t: "Local knowledge", d: "Routes walked personally, not copied." },
                    { icon: BadgeCheck, t: "Reliable partners", d: "Vetted drivers, stays & guides." },
                    { icon: Wallet, t: "Transparent planning", d: "PKR breakdowns, no hidden margins." },
                    { icon: Headset, t: "24/7 support", d: "One message away, on the ground." },
                  ].map((v) => (
                    <li key={v.t} className="flex gap-3 rounded-lg border border-gray-300/80 bg-white/80 p-3.5 shadow-sm dark:border-ivory/10 dark:bg-ink/50 dark:shadow-none">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-950 text-amber-400 dark:bg-coal dark:text-champagne"><v.icon size={16} /></span>
                      <span><b className="block text-[14px] text-gray-950 dark:text-ivory">{v.t}</b><span className="text-[12.5px] text-gray-600 dark:text-ivory/60">{v.d}</span></span>
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={230}>
                <div className="mt-7 flex flex-wrap items-center gap-6">
                  <div className="flex gap-8">
                    <span><b className="block font-display text-[30px] font-semibold tabular text-gray-950 dark:text-ivory"><AnimatedNumber value={6} /></b><span className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-500 dark:text-ivory/50">Years guiding</span></span>
                    <span><b className="block font-display text-[30px] font-semibold tabular text-gray-950 dark:text-ivory"><AnimatedNumber value={500} suffix="+" /></b><span className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-500 dark:text-ivory/50">Travelers</span></span>
                    <span><b className="block font-display text-[30px] font-semibold tabular text-gray-950 dark:text-ivory">4.9</b><span className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-500 dark:text-ivory/50">Avg rating</span></span>
                  </div>
                </div>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button onClick={() => talkToTariq()}
                    className="btn-press inline-flex items-center justify-center gap-2 rounded-full bg-gray-950 px-7 py-3.5 text-[12.5px] font-extrabold uppercase tracking-[0.1em] text-white hover:bg-gray-800 dark:bg-ivory dark:text-ink dark:hover:bg-champagne">
                    <WhatsAppIcon size={15} /> WhatsApp Us
                  </button>
                  <p className="flex items-center justify-center font-display text-[26px] italic text-gray-600 sm:justify-start dark:text-ivory/60">— Venture Pakistan</p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SIGNATURE JOURNEY ================= */}
      <section id="signature" className="relative scroll-mt-20 overflow-hidden bg-white dark:bg-ink py-20 md:py-28" aria-label="Signature Hunza journey">
        <div className="absolute inset-0 opacity-[0.14]">
          <img src={IMAGES.signature} alt="" aria-hidden="true" className="h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-white dark:from-ink dark:via-ink/60 dark:to-ink" />
        </div>
        <div className="relative mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <Reveal>
                <p className="eyebrow text-amber-700 dark:text-champagne">The signature journey</p>
                <h2 className="mt-4 font-display text-[clamp(2.2rem,5vw,3.8rem)] font-medium leading-[1.02] text-gray-950 dark:text-ivory">
                  Hunza —<br />The <span className="italic text-amber-600 dark:text-champagne">Signature</span> Journey
                </h2>
                <p className="mt-3 text-[14px] font-bold uppercase tracking-[0.18em] text-gray-500 dark:text-ivory/55">5 Days / 4 Nights · Most loved since 2019</p>
              </Reveal>
              <ol className="mt-8 space-y-0">
                {[
                  { d: "Day 01", t: "Islamabad → Hunza", s: "Karakoram Highway with Nanga Parbat viewpoint stops" },
                  { d: "Day 02", t: "Karimabad", s: "Baltit & Altit Forts, bazaar, Eagle's Nest sunset" },
                  { d: "Day 03", t: "Attabad Lake", s: "Boating, Gulmit village & Hussaini Bridge" },
                  { d: "Day 04", t: "Passu & Khunjerab", s: "Passu Cones, Sost, the 4,693m border crossing" },
                  { d: "Day 05", t: "Return journey", s: "Sunrise viewpoint, Rakaposhi stop, fly or drive back" },
                ].map((s, i) => (
                  <Reveal key={s.d} delay={i * 70}>
                    <li className="group flex gap-4 border-l border-gray-300/80 pb-6 pl-0 last:pb-0 dark:border-ivory/15">
                      <span className="relative flex flex-col items-center pl-0">
                        <span className="z-10 -ml-[7px] mt-1 h-3.5 w-3.5 rounded-full border-2 border-amber-600 bg-white transition-colors group-hover:bg-amber-600 dark:border-champagne dark:bg-ink dark:group-hover:bg-champagne" aria-hidden="true" />
                      </span>
                      <div className="-mt-0.5 flex-1 rounded-lg border border-transparent p-3 transition-colors group-hover:border-gray-200 group-hover:bg-gray-50 dark:group-hover:border-ivory/10 dark:group-hover:bg-coal/60">
                        <p className="text-[10.5px] font-extrabold uppercase tracking-[0.24em] text-amber-700 dark:text-champagne">{s.d}</p>
                        <p className="font-display text-[21px] font-semibold text-gray-950 dark:text-ivory">{s.t}</p>
                        <p className="text-[13px] text-gray-600 dark:text-ivory/55">{s.s}</p>
                      </div>
                    </li>
                  </Reveal>
                ))}
              </ol>
            </div>

            <div className="lg:pt-24">
              <Reveal delay={120} scale>
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-ivory/12 dark:bg-coal/90 dark:backdrop-blur-md">
                  <div className="img-frame img-duotone relative h-56">
                    <img src={IMAGES.passuRoad} alt="Passu Cones in Upper Hunza" className="h-full w-full object-cover" loading="lazy" />
                    <div className="absolute bottom-4 left-5 z-10">
                      <Stars rating={4.9} />
                      <p className="mt-1 text-[12px] font-semibold text-white drop-shadow">412 traveler reviews · 98% would repeat</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-px bg-gray-200 dark:bg-ivory/10">
                    {[
                      { icon: Mountain, t: "Highlights", d: "Forts, lakes, glaciers, Khunjerab" },
                      { icon: BedDouble, t: "Stay", d: "Fort-view boutique hotels" },
                      { icon: Route, t: "Transport", d: "Private Prado + driver" },
                      { icon: UtensilsCrossed, t: "Food", d: "Local kitchens + 1 BBQ night" },
                    ].map((f) => (
                      <div key={f.t} className="bg-gray-50 p-4 dark:bg-coal">
                        <p className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-amber-700 dark:text-champagne"><f.icon size={13} /> {f.t}</p>
                        <p className="mt-1 text-[13px] font-semibold text-gray-800 dark:text-ivory/75">{f.d}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-5">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gray-500 dark:text-ivory/40">Starting from · per person</p>
                        <p className="font-display text-[34px] font-semibold text-amber-700 dark:text-champagne tabular">PKR 85,000</p>
                      </div>
                      <p className="pb-1.5 text-right text-[12px] font-semibold text-gray-500 dark:text-ivory/45">Twin sharing<br />Seasonal rates apply</p>
                    </div>
                    <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
                      <button
                        onClick={() => { saveTrip({ ...signatureTrip, id: `trip_sig_${Date.now().toString(36)}` }); }}
                        className="btn-press inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-gray-300 py-3.5 text-[12.5px] font-extrabold uppercase tracking-[0.1em] text-gray-900 hover:border-amber-600 hover:text-amber-700 dark:border-ivory/25 dark:text-ivory dark:hover:border-champagne dark:hover:text-champagne">
                        Save this journey
                      </button>
                      <button onClick={() => openPlanner("hunza")}
                        className="btn-press inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-champagne py-3.5 text-[12.5px] font-extrabold uppercase tracking-[0.1em] text-gray-950 hover:bg-champagnelight">
                        <Sparkles size={15} /> Customize with AI
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="bg-[#faf8f5] dark:bg-coal py-20 md:py-24" aria-label="Traveler stories">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHeading
            eyebrow="Traveler stories"
            title={<>Journeys That <span className="italic text-amber-600 dark:text-champagne">Stay With You.</span></>}
            align="center"
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              { q: "We stopped planning and started experiencing. Tariq rerouted our Hunza days around the weather and it saved the trip.", n: "Ayesha & Daniyal", m: "Hunza · 5 days · Oct 2025" },
              { q: "The Kalash valleys felt like a different century. Our guide knew every family we met. Nothing about it felt touristy.", n: "Marcus T.", m: "Chitral · 6 days · May 2025" },
              { q: "Traveling with kids and my mother sounded impossible. It wasn't — gentle pacing, great stays, zero stress.", n: "The Sheikh Family", m: "Swat & Neelum · 7 days · Aug 2025" },
            ].map((t, i) => (
              <Reveal key={t.n} delay={i * 90}>
                <figure className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-ivory/10 dark:bg-ink dark:shadow-none">
                  <Quote size={22} className="text-amber-600/60 dark:text-champagne/60" />
                  <blockquote className="mt-4 flex-1 font-display text-[19px] italic leading-snug text-gray-800 dark:text-ivory/85">“{t.q}”</blockquote>
                  <figcaption className="mt-5 border-t border-gray-200 pt-4 dark:border-ivory/10">
                    <p className="text-[14px] font-bold text-gray-950 dark:text-ivory">{t.n}</p>
                    <p className="mt-0.5 text-[12px] font-bold uppercase tracking-[0.1em] text-gray-500 dark:text-ivory/40">{t.m}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA BAND ================= */}
      <section className="relative overflow-hidden" aria-label="Request a custom tour">
        <img src={IMAGES.night} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-ink/75" />
        <div className="relative mx-auto max-w-4xl px-5 py-20 text-center md:py-28">
          <Reveal>
            <p className="eyebrow text-champagne">Custom tours · Honeymoons · Groups · Corporate</p>
            <h2 className="mt-4 font-display text-[clamp(2.2rem,5.5vw,3.8rem)] font-medium leading-[1.05] text-ivory">
              Have Dates in Mind?<br /><span className="italic text-champagnelight">Let's Build It Together.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-ivory/80">
              One message is enough. Tell Venture Pakistan where, when and how many — you'll have a plan within a day.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button onClick={() => talkToTariq()}
                className="btn-press inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 py-4 text-[13px] font-extrabold uppercase tracking-[0.1em] text-white hover:brightness-105 transition-all">
                <WhatsAppIcon size={18} /> Request custom tour
              </button>
              <button onClick={() => openPlanner("hunza")}
                className="btn-press inline-flex items-center justify-center gap-2 rounded-full border border-ivory/30 px-8 py-4 text-[13px] font-extrabold uppercase tracking-[0.1em] text-ivory hover:border-champagne">
                <Sparkles size={16} /> Try the AI planner
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
