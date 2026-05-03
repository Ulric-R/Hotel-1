export default function Contact() {
  return (
    <section id="contact" className="py-20 md:py-32 bg-emerald-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-emerald-300 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-amber-200 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-10 md:gap-16">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-emerald-300">
            Contact & Accès
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl mt-4 leading-tight">
            Venez vous perdre, repartez transformés.
          </h2>
          <p className="mt-6 text-emerald-100/80">
            Notre équipe est à votre écoute pour préparer votre séjour
            sur-mesure et répondre à toutes vos questions.
          </p>

          <div className="mt-10 space-y-5">
            <div className="flex items-start gap-4">
              <div className="bg-emerald-800 p-3 rounded-full">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <div className="font-medium">Domaine de Fanja</div>
                <div className="text-sm text-emerald-200/80">
                  Route Forestière, 73120 Massif des Alpes, France
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-emerald-800 p-3 rounded-full">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
              </div>
              <div>
                <div className="font-medium">+33 4 79 00 00 00</div>
                <div className="text-sm text-emerald-200/80">
                  7j/7 — 9h à 20h
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-emerald-800 p-3 rounded-full">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <path d="M22 6l-10 7L2 6" />
                </svg>
              </div>
              <div>
                <div className="font-medium">contact@Fanja-hotel.fr</div>
                <div className="text-sm text-emerald-200/80">
                  Réponse sous 24h
                </div>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Merci ! Votre message a bien été envoyé.");
          }}
          className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 space-y-5"
        >
          <h3 className="font-serif text-2xl">Envoyez-nous un message</h3>
          <div>
            <label className="text-xs uppercase tracking-widest text-emerald-200">
              Nom
            </label>
            <input
              required
              type="text"
              className="w-full mt-2 bg-transparent border-b border-white/30 focus:border-white outline-none py-2 text-white placeholder-white/40"
              placeholder="Votre nom"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-emerald-200">
              Email
            </label>
            <input
              required
              type="email"
              className="w-full mt-2 bg-transparent border-b border-white/30 focus:border-white outline-none py-2 text-white placeholder-white/40"
              placeholder="vous@exemple.com"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-emerald-200">
              Message
            </label>
            <textarea
              required
              rows={4}
              className="w-full mt-2 bg-transparent border-b border-white/30 focus:border-white outline-none py-2 text-white placeholder-white/40 resize-none"
              placeholder="Votre message..."
            />
          </div>
          <button
            type="submit"
            className="w-full bg-white text-emerald-900 py-3 rounded-full font-medium hover:bg-emerald-50 transition-colors"
          >
            Envoyer
          </button>
        </form>
      </div>
    </section>
  );
}
