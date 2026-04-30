import { api, type Photo } from "../lib/api";
import { useApiData } from "../lib/useApi";

const FALLBACK: Photo[] = [
  { id: "p1", url: "/images/hero.jpg", caption: "Vue extérieure", category: "exterior" },
  { id: "p2", url: "/images/room-cabin.jpg", caption: "Cabane des Pins", category: "rooms" },
  { id: "p3", url: "/images/spa.jpg", caption: "Spa nordique", category: "spa" },
  { id: "p4", url: "/images/room-treehouse.jpg", caption: "Cabane perchée", category: "rooms" },
  { id: "p5", url: "/images/restaurant.jpg", caption: "Restaurant", category: "dining" },
  { id: "p6", url: "/images/room-suite.jpg", caption: "Suite Forêt", category: "rooms" },
];

export default function Gallery() {
  const { data: photos } = useApiData<Photo[]>(() => api.photos(), FALLBACK);
  const items = photos.slice(0, 6);

  return (
    <section id="gallery" className="py-20 md:py-32 bg-stone-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-[0.3em] text-emerald-300">
            Galerie
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl mt-4">
            Un avant-goût de Sylvana
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {items.map((p, i) => (
            <div
              key={p.id}
              className={`relative overflow-hidden rounded-xl group ${
                i === 0 ? "col-span-2 md:row-span-2 h-64 md:h-auto" : "h-40 sm:h-48 md:h-64"
              }`}
            >
              <img
                src={p.url}
                alt={p.caption || ""}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              {p.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-900/80 to-transparent p-3 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  {p.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
