import { useEffect } from "react";
import type { Room } from "../lib/api";

type Props = {
  room: Room | null;
  onClose: () => void;
  onReserve: (room: Room) => void;
};

export default function RoomDetailModal({ room, onClose, onReserve }: Props) {
  useEffect(() => {
    if (room) {
      document.body.style.overflow = "hidden";
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
      window.addEventListener("keydown", onKey);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", onKey);
      };
    }
  }, [room, onClose]);

  if (!room) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center sm:p-4 bg-stone-950/70 backdrop-blur-sm animate-[fadeIn_0.2s]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image header */}
        <div className="relative h-56 sm:h-80 flex-shrink-0">
          <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/95 hover:bg-white text-stone-800 rounded-full p-2 shadow-lg transition-colors"
            aria-label="Fermer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>

          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs uppercase tracking-wider text-emerald-800">
            {room.type}
          </div>

          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white">
            <h2 className="font-serif text-3xl sm:text-4xl leading-tight">{room.name}</h2>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-6">
          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 pb-5 sm:pb-6 border-b border-stone-200">
            <Stat
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
              }
              label="Capacité"
              value={`${room.capacity} pers.`}
            />
            <Stat
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                </svg>
              }
              label="Surface"
              value={`${room.size} m²`}
            />
            <Stat
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M12 2v20M2 12h20" />
                </svg>
              }
              label="Type"
              value={room.type.split(" ")[0]}
            />
          </div>

          {/* Description */}
          <div className="py-5 sm:py-6">
            <h3 className="text-xs uppercase tracking-[0.2em] text-emerald-700 mb-3">
              Description
            </h3>
            <p className="text-stone-700 leading-relaxed text-sm sm:text-base whitespace-pre-line">
              {room.description}
            </p>
          </div>

          {/* Amenities */}
          {room.amenities.length > 0 && (
            <div className="pb-5 sm:pb-6">
              <h3 className="text-xs uppercase tracking-[0.2em] text-emerald-700 mb-3">
                Équipements & services
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {room.amenities.map((a) => (
                  <li key={a} className="flex items-center gap-2 text-sm text-stone-700">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.5">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer with price + CTA */}
        <div className="border-t border-stone-200 bg-stone-50 px-5 sm:px-8 py-4 sm:py-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 flex-shrink-0">
          <div>
            <div className="font-serif text-3xl text-stone-800 leading-none">
              {room.price}€
              <span className="text-sm text-stone-500 font-sans ml-1">/ nuit</span>
            </div>
            <div className="text-xs text-stone-500 mt-1">Petit-déjeuner inclus · Annulation gratuite</div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-5 py-3 rounded-full border border-stone-300 hover:bg-white text-stone-700 text-sm flex-1 sm:flex-none"
            >
              Fermer
            </button>
            <button
              onClick={() => onReserve(room)}
              className="px-6 py-3 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium flex-1 sm:flex-none transition-colors"
            >
              Réserver maintenant →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center text-center gap-1.5 sm:gap-2 text-stone-600">
      <div className="text-emerald-700">{icon}</div>
      <div className="text-xs uppercase tracking-widest text-stone-400">{label}</div>
      <div className="font-medium text-stone-800 text-sm sm:text-base">{value}</div>
    </div>
  );
}
