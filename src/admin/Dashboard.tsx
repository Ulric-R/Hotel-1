import { useEffect, useState } from "react";
import { adminApi, api } from "../lib/api";
import { Card, PageHeader } from "./ui";

export default function Dashboard() {
  const [stats, setStats] = useState({
    rooms: 0,
    articles: 0,
    promos: 0,
    photos: 0,
    activities: 0,
    reservations: 0,
  });
  const [recent, setRecent] = useState<{ name: string; total: number; date: string }[]>([]);

  useEffect(() => {
    Promise.all([
      api.rooms().catch(() => []),
      api.articles().catch(() => []),
      api.promos().catch(() => []),
      api.photos().catch(() => []),
      api.activities().catch(() => []),
      adminApi.reservations().catch(() => []),
    ]).then(([rooms, articles, promos, photos, activities, reservations]) => {
      const revenue = reservations.reduce((s, r) => s + (r.total || 0), 0);
      setStats({
        rooms: rooms.length,
        articles: articles.length,
        promos: promos.length,
        photos: photos.length,
        activities: activities.length,
        reservations: reservations.length,
      });
      setRecent(
        reservations.slice(0, 5).map((r) => ({
          name: r.name,
          total: r.total,
          date: r.created_at?.split("T")[0] ?? "",
        }))
      );
    });
  }, []);

  const tiles = [
    { label: "Hébergements", value: stats.rooms, color: "bg-emerald-50 text-emerald-700" },
    { label: "Expériences", value: stats.activities, color: "bg-teal-50 text-teal-700" },
    { label: "Articles", value: stats.articles, color: "bg-amber-50 text-amber-700" },
    { label: "Promotions", value: stats.promos, color: "bg-rose-50 text-rose-700" },
    { label: "Photos", value: stats.photos, color: "bg-sky-50 text-sky-700" },
    { label: "Réservations", value: stats.reservations, color: "bg-violet-50 text-violet-700" },
  ];

  return (
    <>
      <PageHeader
        title="Tableau de bord"
        subtitle="Vue d'ensemble de votre établissement Fanja."
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {tiles.map((t) => (
          <Card key={t.label} className={`p-6 ${t.color}`}>
            <div className="text-sm uppercase tracking-widest opacity-70">{t.label}</div>
            <div className="font-serif text-4xl mt-2">{t.value}</div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h2 className="font-serif text-2xl text-stone-800 mb-4">Dernières réservations</h2>
        {recent.length === 0 ? (
          <div className="text-stone-400 text-sm">Aucune réservation pour l'instant.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-widest text-stone-500 text-left">
              <tr>
                <th className="py-2">Client</th>
                <th>Date</th>
                <th className="text-right">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {recent.map((r, i) => (
                <tr key={i}>
                  <td className="py-3">{r.name}</td>
                  <td className="text-stone-500">{r.date}</td>
                  <td className="text-right font-medium">{r.total}€</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </>
  );
}
