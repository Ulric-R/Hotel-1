export type Room = {
  id: string;
  name: string;
  type: string;
  price: number;
  capacity: number;
  size: number;
  image: string;
  description: string;
  amenities: string[];
};

export const rooms: Room[] = [
  {
    id: "cabin-pine",
    name: "Cabane des Pins",
    type: "Cabane Romantique",
    price: 189,
    capacity: 2,
    size: 32,
    image: "/images/room-cabin.jpg",
    description:
      "Une cabane intimiste en bois massif avec cheminée et vue plongeante sur la forêt de pins. Idéale pour une escapade en amoureux.",
    amenities: ["Cheminée", "Lit King-Size", "Wi-Fi", "Petit-déjeuner inclus", "Terrasse privée"],
  },
  {
    id: "suite-foret",
    name: "Suite Forêt",
    type: "Suite Premium",
    price: 289,
    capacity: 3,
    size: 55,
    image: "/images/room-suite.jpg",
    description:
      "Une suite spacieuse avec baignoire en îlot, fenêtres panoramiques et accès direct au sentier de randonnée.",
    amenities: ["Baignoire en îlot", "Vue panoramique", "Mini-bar", "Service en chambre", "Spa privatif"],
  },
  {
    id: "treehouse",
    name: "Cabane dans les Arbres",
    type: "Expérience Unique",
    price: 349,
    capacity: 2,
    size: 40,
    image: "/images/room-treehouse.jpg",
    description:
      "Suspendue à 8 mètres au-dessus du sol, cette cabane offre une immersion totale dans la canopée.",
    amenities: ["Vue canopée", "Terrasse 360°", "Petit-déjeuner livré", "Lanternes", "Hamac suspendu"],
  },
];
