import { useState } from "react";
import { api, type Article } from "../lib/api";
import { useApiData } from "../lib/useApi";

const FALLBACK: Article[] = [
  {
    id: "art-1",
    title: "L'art du bain de forêt",
    excerpt: "Découvrez le shinrin-yoku, cette pratique japonaise qui invite à se reconnecter à la nature.",
    content:
      "Le shinrin-yoku, ou bain de forêt, est bien plus qu'une simple promenade. C'est une immersion sensorielle complète qui apaise le système nerveux et renforce l'immunité.",
    image: "/images/hero.jpg",
    author: "Marie Dubois",
    category: "Bien-être",
    created_at: "2026-01-15T10:00:00",
  },
  {
    id: "art-2",
    title: "Cuisine de saison : automne en forêt",
    excerpt: "Notre chef partage sa philosophie de la cuisine forestière et ses produits du moment.",
    content:
      "L'automne est une saison généreuse en forêt. Champignons, châtaignes, baies sauvages composent une palette de saveurs uniques.",
    image: "/images/restaurant.jpg",
    author: "Chef Laurent",
    category: "Gastronomie",
    created_at: "2026-02-03T14:30:00",
  },
];

export default function Articles() {
  const { data: articles } = useApiData<Article[]>(() => api.articles(), FALLBACK);
  const [open, setOpen] = useState<Article | null>(null);

  if (articles.length === 0) return null;

  return (
    <section id="articles" className="py-20 md:py-28 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-[0.3em] text-emerald-700">
            Le journal
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl mt-4 text-stone-800">
            Histoires & inspirations
          </h2>
          <p className="mt-4 text-stone-600 text-sm sm:text-base">
            Plongez dans nos récits sur la nature, le bien-être et la gastronomie.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {articles.slice(0, 6).map((a) => (
            <article
              key={a.id}
              onClick={() => setOpen(a)}
              className="group bg-white rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-all"
            >
              <div className="h-52 overflow-hidden">
                <img
                  src={a.image}
                  alt={a.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-6">
                <div className="text-xs uppercase tracking-widest text-emerald-700">
                  {a.category}
                </div>
                <h3 className="font-serif text-xl text-stone-800 mt-2 leading-snug">
                  {a.title}
                </h3>
                <p className="text-sm text-stone-600 mt-3 line-clamp-3">{a.excerpt}</p>
                <div className="mt-4 text-xs text-stone-400 flex items-center justify-between">
                  <span>Par {a.author}</span>
                  <span className="text-emerald-700 group-hover:underline">Lire →</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Article reader modal */}
      {open && (
        <div
          className="fixed inset-0 z-[100] bg-stone-950/70 backdrop-blur-sm flex items-start sm:items-center justify-center p-4 overflow-y-auto"
          onClick={() => setOpen(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full my-4 sm:my-0 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={open.image} alt={open.title} className="w-full h-56 sm:h-72 object-cover" />
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-emerald-700">
                  {open.category}
                </span>
                <button onClick={() => setOpen(null)} className="text-stone-400 hover:text-stone-700">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 6l12 12M6 18L18 6" />
                  </svg>
                </button>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-stone-800 mt-3">
                {open.title}
              </h2>
              <div className="text-xs text-stone-500 mt-2">
                Par {open.author} · {open.created_at?.split("T")[0]}
              </div>
              <p className="text-stone-700 leading-relaxed mt-6 whitespace-pre-line">
                {open.content}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
