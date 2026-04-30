type Props = {
  onReserve: () => void;
  onExplore: () => void;
};

export default function Hero({ onReserve, onExplore }: Props) {
  return (
    <section id="hero" className="relative min-h-screen sm:min-h-[640px] w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: "url(/images/hero.jpg)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70" />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 py-24 text-white">
        <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] mb-4 sm:mb-6 text-emerald-200">
          Au cœur de la forêt
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-tight max-w-4xl">
          Là où la nature <em className="italic font-light">murmure</em>.
        </h1>
        <p className="mt-5 sm:mt-6 max-w-xl text-sm sm:text-base md:text-lg text-white/85 font-light">
          Un refuge d'exception niché dans une forêt préservée. Reconnectez-vous
          à l'essentiel dans nos cabanes, suites et havres de bien-être.
        </p>

        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto max-w-xs sm:max-w-none">
          <button
            onClick={onReserve}
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-full tracking-wide transition-all hover:scale-105"
          >
            Réserver un séjour
          </button>
          <button
            onClick={onExplore}
            className="border border-white/60 hover:bg-white hover:text-stone-900 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-full tracking-wide transition-all"
          >
            Découvrir nos hébergements
          </button>
        </div>

        <div className="hidden sm:flex absolute bottom-10 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-white/70">
          <span className="text-xs uppercase tracking-widest">Découvrir</span>
          <div className="w-px h-12 bg-white/40 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
