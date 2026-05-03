export default function About() {
  const stats = [
    { value: "12", label: "Hébergements uniques" },
    { value: "120", label: "Hectares de forêt" },
    { value: "4.9", label: "Note des voyageurs" },
    { value: "2018", label: "Année d'ouverture" },
  ];

  return (
    <section className="py-20 md:py-32 bg-stone-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-emerald-700">
            Notre histoire
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl mt-4 text-stone-800 leading-tight">
            Un sanctuaire suspendu entre forêt et silence.
          </h2>
          <p className="mt-6 text-stone-600 leading-relaxed">
            Imaginé par une famille passionnée de nature, Fanja est un hôtel
            intimiste qui célèbre l'art de vivre dans la simplicité. Chaque
            hébergement a été conçu pour s'intégrer harmonieusement à son
            environnement, en utilisant des matériaux locaux et des énergies
            renouvelables.
          </p>
          <p className="mt-4 text-stone-600 leading-relaxed">
            Ici, le temps ralentit. Le chant des oiseaux remplace le bruit des
            villes, et chaque fenêtre devient un tableau vivant.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:gap-8">
          {stats.map((s) => (
            <div
              key={s.label}
              className="border-l-2 border-emerald-700 pl-4 sm:pl-5 py-2"
            >
              <div className="font-serif text-3xl sm:text-4xl md:text-5xl text-stone-800">
                {s.value}
              </div>
              <div className="text-xs uppercase tracking-widest text-stone-500 mt-2">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
