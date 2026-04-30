type Props = { onAdminClick?: () => void };

export default function Footer({ onAdminClick }: Props) {
  return (
    <footer className="bg-stone-950 text-stone-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 text-white font-serif text-2xl">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 2L4 14h5v8h6v-8h5L12 2z" />
            </svg>
            Sylvana
          </div>
          <p className="mt-4 text-sm">L'art de vivre au cœur de la nature.</p>
        </div>
        <div>
          <h4 className="text-white text-sm uppercase tracking-widest mb-4">Hôtel</h4>
          <ul className="space-y-2 text-sm">
            <li>Hébergements</li>
            <li>Spa & Bien-être</li>
            <li>Restaurant</li>
            <li>Activités</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white text-sm uppercase tracking-widest mb-4">Infos</h4>
          <ul className="space-y-2 text-sm">
            <li>Conditions générales</li>
            <li>Politique de confidentialité</li>
            <li>Mentions légales</li>
            <li>Plan d'accès</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white text-sm uppercase tracking-widest mb-4">Newsletter</h4>
          <p className="text-sm mb-3">Recevez nos offres saisonnières.</p>
          <div className="flex">
            <input
              type="email"
              placeholder="email"
              className="flex-1 bg-stone-900 px-3 py-2 rounded-l text-sm outline-none"
            />
            <button className="bg-emerald-700 hover:bg-emerald-600 px-4 rounded-r text-white text-sm">
              OK
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-10 pt-6 border-t border-stone-800 text-xs text-stone-500 flex flex-col sm:flex-row justify-between gap-3 items-center text-center sm:text-left">
        <span>© 2026 Sylvana — Tous droits réservés</span>
        <div className="flex items-center gap-4">
          <button
            onClick={onAdminClick}
            className="text-stone-500 hover:text-emerald-400 transition-colors"
            title="Espace administration (authentification requise)"
          >
            🔒 Admin
          </button>
          <span>Conçu avec ♥ au cœur des Alpes</span>
        </div>
      </div>
    </footer>
  );
}
