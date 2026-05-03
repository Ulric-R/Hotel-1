import { useEffect, useState } from "react";
import { adminApi } from "../lib/api";
import Icon from "./icons";

type Tab =
  | "dashboard"
  | "rooms"
  | "activities"
  | "articles"
  | "promos"
  | "photos"
  | "reservations";

type Props = {
  active: Tab;
  onChange: (t: Tab) => void;
  onExit: () => void;
  children: React.ReactNode;
};

export default function AdminLayout({ active, onChange, onExit, children }: Props) {
  const [user, setUser] = useState<string>("admin");
  const [apiReachable, setApiReachable] = useState<boolean | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    adminApi
      .me()
      .then((r) => {
        setUser(r.user);
        setApiReachable(true);
      })
      .catch(() => setApiReachable(false));
  }, []);

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "dashboard", label: "Tableau de bord", icon: "news" },
    { id: "rooms", label: "Hébergements", icon: "home" },
    { id: "activities", label: "Expériences", icon: "leaf" },
    { id: "articles", label: "Articles", icon: "news" },
    { id: "promos", label: "Promotions", icon: "gift" },
    { id: "photos", label: "Galerie photos", icon: "gallery" },
    { id: "reservations", label: "Réservations", icon: "calendar" },
  ];

  const activeLabel = tabs.find((t) => t.id === active)?.label ?? "Admin";

  const Sidebar = (
    <div className="h-full flex flex-col bg-stone-900 text-stone-100 w-64">
      <div className="p-6 border-b border-stone-800">
        <div className="flex items-center gap-2 font-serif text-2xl">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 2L4 14h5v8h6v-8h5L12 2z" />
          </svg>
          Fanja
        </div>
        <div className="text-xs uppercase tracking-widest text-emerald-400 mt-1">
          Administration
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              onChange(t.id);
              setDrawerOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors text-left ${
              active === t.id
                ? "bg-emerald-700 text-white"
                : "text-stone-300 hover:bg-stone-800"
            }`}
          >
            <span className="w-5 h-5"><Icon name={t.icon} size={18} /></span>
            {t.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-stone-800 text-xs">
        <div className="flex items-center gap-2 mb-2">
          <div
            className={`w-2 h-2 rounded-full ${
              apiReachable === null
                ? "bg-stone-500"
                : apiReachable
                ? "bg-emerald-400"
                : "bg-red-500"
            }`}
          />
          <span className="text-stone-400">
            API {apiReachable === null ? "..." : apiReachable ? "connectée" : "indisponible"}
          </span>
        </div>
        <div className="text-stone-300">
          Connecté : <strong>{user}</strong>
        </div>
        <button
          onClick={onExit}
          className="mt-3 text-emerald-400 hover:text-emerald-300 text-xs underline"
        >
          ← Voir le site public
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-100 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block flex-shrink-0">{Sidebar}</aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-stone-900/60"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="relative h-full">{Sidebar}</div>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Mobile topbar */}
        <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-stone-200 flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 -ml-2 text-stone-700"
            aria-label="Ouvrir le menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
          <div className="font-serif text-lg text-stone-800">{activeLabel}</div>
          <button
            onClick={onExit}
            className="text-xs text-emerald-700 underline"
            title="Site public"
          >
            Site
          </button>
        </header>

        <div className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8 max-w-6xl">{children}</div>
        </div>
      </main>
    </div>
  );
}
