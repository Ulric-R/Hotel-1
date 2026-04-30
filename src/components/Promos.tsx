import { api, type Promo } from "../lib/api";
import { useApiData } from "../lib/useApi";

const FALLBACK: Promo[] = [
  {
    id: "promo-1",
    title: "Escapade hivernale",
    description: "2 nuits offertes pour toute réservation de 5 nuits dans nos suites.",
    discount_percent: 30,
    valid_until: "2026-12-31",
    image: "/images/room-suite.jpg",
    active: true,
  },
];

type Props = { onReserve: () => void };

export default function Promos({ onReserve }: Props) {
  const { data: promos } = useApiData<Promo[]>(() => api.promos(), FALLBACK);
  const visible = promos.filter((p) => p.active);
  if (visible.length === 0) return null;

  return (
    <section id="promos" className="py-20 md:py-28 bg-gradient-to-br from-amber-50 to-rose-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-[0.3em] text-rose-700">
            Offres limitées
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl mt-4 text-stone-800">
            Nos promotions du moment
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((p) => (
            <article
              key={p.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow flex flex-col"
            >
              {p.image && (
                <div className="relative h-48">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-rose-600 text-white font-serif text-2xl rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
                    -{p.discount_percent}%
                  </div>
                </div>
              )}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-serif text-2xl text-stone-800">{p.title}</h3>
                <p className="text-sm text-stone-600 mt-2 flex-1">{p.description}</p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs text-stone-500">
                    Jusqu'au {new Date(p.valid_until).toLocaleDateString("fr-FR")}
                  </span>
                  <button
                    onClick={onReserve}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white text-sm px-4 py-2 rounded-full transition-colors"
                  >
                    En profiter
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
