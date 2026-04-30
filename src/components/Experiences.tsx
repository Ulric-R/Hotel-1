import { api, type Activity } from "../lib/api";
import { useApiData } from "../lib/useApi";

const FALLBACK: Activity[] = [
  { id: "act-spa", title: "Spa & Bien-être", description: "Bain nordique en plein air, sauna finlandais et massages aux huiles essentielles de la forêt.", icon: "♨️", image: "/images/spa.jpg", featured: true, order: 1 },
  { id: "act-resto", title: "Table Forestière", description: "Cuisine de saison signée par notre chef, avec des produits cueillis chaque matin.", icon: "🍽️", image: "/images/restaurant.jpg", featured: true, order: 2 },
  { id: "act-1", title: "Randonnées guidées", description: "", icon: "🥾", featured: false, order: 10 },
  { id: "act-2", title: "Yoga en forêt", description: "", icon: "🧘", featured: false, order: 11 },
  { id: "act-3", title: "VTT électrique", description: "", icon: "🚴", featured: false, order: 12 },
  { id: "act-4", title: "Observation faune", description: "", icon: "🦌", featured: false, order: 13 },
  { id: "act-5", title: "Soirées au feu", description: "", icon: "🔥", featured: false, order: 14 },
  { id: "act-6", title: "Bain de canopée", description: "", icon: "⭐", featured: false, order: 15 },
];

export default function Experiences() {
  const { data: all } = useApiData<Activity[]>(() => api.activities(), FALLBACK);
  const featured = all.filter((a) => a.featured).sort((a, b) => a.order - b.order);
  const tiles = all.filter((a) => !a.featured).sort((a, b) => a.order - b.order);

  if (all.length === 0) return null;

  return (
    <section id="experiences" className="py-20 md:py-32 bg-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-[0.3em] text-emerald-700">
            Expériences
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl mt-4 text-stone-800">
            Vivre Sylvana
          </h2>
        </div>

        {featured.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16">
            {featured.map((it) => (
              <div
                key={it.id}
                className="relative h-72 sm:h-96 rounded-2xl overflow-hidden group cursor-pointer"
              >
                {it.image ? (
                  <img
                    src={it.image}
                    alt={it.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-700 to-emerald-900 flex items-center justify-center text-7xl">
                    {it.icon}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
                  <span className="text-2xl">{it.icon}</span>
                  <h3 className="font-serif text-2xl sm:text-3xl mt-2">{it.title}</h3>
                  <p className="mt-3 text-white/85 text-sm max-w-md">{it.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {tiles.length > 0 && (
          <div className="bg-white rounded-2xl p-6 sm:p-10 md:p-14">
            <h3 className="font-serif text-xl sm:text-2xl md:text-3xl text-stone-800 text-center mb-8 md:mb-10">
              Activités incluses ou sur-mesure
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
              {tiles.map((a) => (
                <div
                  key={a.id}
                  title={a.description}
                  className="flex flex-col items-center text-center gap-3 p-4 rounded-xl hover:bg-stone-50 transition-colors"
                >
                  <span className="text-4xl">{a.icon}</span>
                  <span className="text-sm text-stone-700">{a.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
