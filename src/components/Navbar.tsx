import { useState, useEffect } from "react";

type Props = {
  onNavigate: (id: string) => void;
  onReserve: () => void;
};

export default function Navbar({ onNavigate, onReserve }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { id: "rooms", label: "Hébergements" },
    { id: "promos", label: "Offres" },
    { id: "experiences", label: "Expériences" },
    { id: "articles", label: "Journal" },
    { id: "gallery", label: "Galerie" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-stone-50/95 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <button
          onClick={() => onNavigate("hero")}
          className={`flex items-center gap-2 font-serif text-2xl tracking-wide ${
            scrolled ? "text-emerald-900" : "text-white"
          }`}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 2L4 14h5v8h6v-8h5L12 2z" />
          </svg>
          <span>Sylvana</span>
        </button>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => onNavigate(l.id)}
              className={`text-sm tracking-wide transition-colors hover:text-emerald-600 ${
                scrolled ? "text-stone-700" : "text-white/90"
              }`}
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={onReserve}
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-full text-sm tracking-wide transition-colors"
          >
            Réserver
          </button>
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className={`md:hidden ${scrolled ? "text-stone-800" : "text-white"}`}
          aria-label="Menu"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-stone-50 border-t border-stone-200">
          <div className="px-6 py-4 flex flex-col gap-4">
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => {
                  onNavigate(l.id);
                  setOpen(false);
                }}
                className="text-left text-stone-700 py-2"
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => {
                onReserve();
                setOpen(false);
              }}
              className="bg-emerald-700 text-white px-5 py-3 rounded-full"
            >
              Réserver
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
