import { useTravelStore } from "../store/useTravelStore";
import { getDestination, GeneratedTrip, formatPKR, BUSINESS_WHATSAPP } from "../data/travel";
import { ArrowRight, MapPin, CalendarDays, Users, Wallet, Eye, MessageCircle, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Stars } from "../components/ui";
import { WhatsAppIcon } from "../components/WhatsAppIcon";

const STATUS_STYLES: Record<GeneratedTrip["status"], string> = {
  Planning: "bg-ivory/10 text-ivory/70 border-ivory/15",
  "Ready to Book": "bg-champagne/15 text-champagne border-champagne/40",
  Confirmed: "bg-teal/15 text-teal border-teal/40",
};

export default function MyTrips() {
  const store = useTravelStore();
  const navigate = useNavigate();
  const { trips, setDetailId, deleteTrip, updateStatus, openPlanner, setActiveTrip, setItineraryOpen } = store;

  return (
    <main className="min-h-[100svh] bg-coal pb-20 pt-24 md:pt-32">
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <div>
          <p className="eyebrow text-champagne">Your travel file</p>
          <h1 className="mt-1 font-display text-[32px] font-semibold text-ivory md:text-[42px]">
            My Trips {trips.length > 0 && <span className="text-champagne tabular">({trips.length})</span>}
          </h1>
        </div>

        <div className="mt-10">
          {trips.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-ivory/10 bg-ink px-8 text-center shadow-xl">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-ivory/12 text-ivory/30">
                <MapPin size={24} />
              </span>
              <h4 className="mt-5 font-display text-[24px] font-medium text-ivory">No journeys saved yet.</h4>
              <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-ivory/55">Generate an itinerary and it will be kept here — ready to view, edit or book.</p>
              <button onClick={() => { navigate("/"); openPlanner("hunza"); }} className="btn-press mt-6 inline-flex items-center gap-2 rounded-full bg-champagne px-6 py-3 text-[12.5px] font-extrabold uppercase tracking-[0.1em] text-ink hover:bg-champagnelight">
                Plan your first journey <ArrowRight size={15} />
              </button>
            </div>
          ) : (
            <ul className="grid gap-5 md:grid-cols-2">
              {trips.map((t) => {
                const d = getDestination(t.destinationId);
                return (
                  <li key={t.id} className="overflow-hidden rounded-xl border border-ivory/12 bg-ink shadow-xl">
                    <div className="relative h-40">
                      <img src={d.image} alt="" className="h-full w-full object-cover" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                      <span className={`absolute left-4 top-4 rounded-full border px-2.5 py-1 text-[10.5px] font-extrabold uppercase tracking-[0.12em] backdrop-blur-md ${STATUS_STYLES[t.status]}`}>
                        {t.status}
                      </span>
                      <div className="absolute inset-x-4 bottom-3 flex items-end justify-between">
                        <div>
                          <p className="font-display text-[24px] font-semibold leading-none text-ivory">{t.destination}</p>
                          <p className="mt-1 text-[12px] font-semibold text-ivory/60">
                            {new Date(t.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </div>
                        <p className="font-display text-[20px] font-semibold text-champagne tabular">{formatPKR(t.costing.total)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 border-b border-ivory/5 bg-coal/30 px-5 py-3 text-[12px] font-bold text-ivory/60">
                      <span className="inline-flex items-center gap-1.5"><CalendarDays size={13} /> {t.duration}d</span>
                      <span className="inline-flex items-center gap-1.5"><Users size={13} /> {t.travelers}</span>
                      <span className="inline-flex items-center gap-1.5"><Wallet size={13} /> {t.budget}</span>
                      <select
                        value={t.status}
                        onChange={(e) => updateStatus(t.id, e.target.value as GeneratedTrip["status"])}
                        aria-label="Trip status"
                        className="ml-auto rounded-full border border-ivory/15 bg-ink px-2.5 py-1 text-[11.5px] font-bold text-ivory/70 focus:outline-none"
                      >
                        <option>Planning</option>
                        <option>Ready to Book</option>
                        <option>Confirmed</option>
                      </select>
                    </div>
                    <div className="flex gap-2 p-4">
                      <button onClick={() => { setActiveTrip(t); setItineraryOpen(true); }} className="btn-press inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-ivory/20 py-2.5 text-[12px] font-extrabold uppercase tracking-[0.08em] text-ivory hover:border-champagne hover:bg-ivory/5">
                        <Eye size={14} /> View
                      </button>
                      <button onClick={() => window.open(`https://wa.me/${BUSINESS_WHATSAPP}?text=Hello Venture Pakistan, I would like to book my trip to ${t.destination}.`, "_blank")} className="btn-press inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#25D366] py-2.5 text-[12px] font-extrabold uppercase tracking-[0.08em] text-white hover:brightness-105 transition-all">
                        <WhatsAppIcon size={14} /> Book
                      </button>
                      <button onClick={() => deleteTrip(t.id)} aria-label={`Delete trip to ${t.destination}`}
                        className="btn-press flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ivory/15 text-ivory/60 hover:border-copper hover:text-copper">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
