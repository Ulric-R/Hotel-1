import type { Room } from "../lib/api";

type Props = {
  rooms: Room[];
  onShowDetails: (room: Room) => void;
};

export default function Rooms({ rooms, onShowDetails }: Props) {
  return (
    <section id="rooms" className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-[0.3em] text-emerald-700">
            Hébergements
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl mt-4 text-stone-800">
            Choisissez votre refuge
          </h2>
          <p className="mt-4 text-stone-600 text-sm sm:text-base">
            Chacune de nos chambres a son caractère. Toutes partagent le même
            engagement : vous offrir un cocon de calme.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {rooms.map((room) => (
            <article
              key={room.id}
              onClick={() => onShowDetails(room)}
              className="group bg-stone-50 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer"
            >
              <div className="relative h-72 overflow-hidden">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs uppercase tracking-wider text-emerald-800">
                  {room.type}
                </div>
              </div>

              <div className="p-7">
                <h3 className="font-serif text-2xl text-stone-800">{room.name}</h3>
                <p className="mt-2 text-sm text-stone-600 line-clamp-2">
                  {room.description}
                </p>

                <div className="mt-5 flex items-center gap-4 text-xs text-stone-500">
                  <span className="flex items-center gap-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                    </svg>
                    {room.capacity} pers.
                  </span>
                  <span className="flex items-center gap-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                    </svg>
                    {room.size} m²
                  </span>
                </div>

                <div className="mt-6 flex items-end justify-between border-t border-stone-200 pt-5">
                  <div>
                    <div className="font-serif text-3xl text-stone-800">
                      {room.price}€
                    </div>
                    <div className="text-xs text-stone-500">/ nuit</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onShowDetails(room);
                    }}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-full text-sm transition-colors"
                  >
                    Détails & Réserver
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
