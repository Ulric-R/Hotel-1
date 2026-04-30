import { adminApi, type Reservation } from "../lib/api";
import { useApiData } from "../lib/useApi";
import { Button, Card, Empty, PageHeader } from "./ui";

export default function ReservationsAdmin() {
  const { data, reload, setData } = useApiData(() => adminApi.reservations(), [] as Reservation[]);

  const del = async (id: string) => {
    if (!confirm("Supprimer cette réservation ?")) return;
    try {
      await adminApi.deleteReservation(id);
      reload();
    } catch {
      setData(data.filter((r) => r.id !== id));
    }
  };

  return (
    <>
      <PageHeader title="Réservations" subtitle={`${data.length} réservation(s) au total.`} />

      {data.length === 0 ? (
        <Empty message="Aucune réservation reçue." />
      ) : (
        <>
          {/* Desktop table */}
          <Card className="hidden md:block overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-stone-50 text-xs uppercase tracking-widest text-stone-500 text-left">
                  <tr>
                    <th className="px-4 py-3">N°</th>
                    <th>Client</th>
                    <th>Séjour</th>
                    <th>Pers.</th>
                    <th>Total</th>
                    <th>Statut</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {data.map((r) => (
                    <tr key={r.id} className="hover:bg-stone-50">
                      <td className="px-4 py-3 font-mono text-xs">{r.booking_number}</td>
                      <td>
                        <div className="font-medium text-stone-800">{r.name}</div>
                        <div className="text-xs text-stone-500">{r.email}</div>
                      </td>
                      <td className="text-stone-600">
                        {r.check_in?.split("T")[0]} → {r.check_out?.split("T")[0]}
                        <div className="text-xs text-stone-400">{r.nights} nuit(s)</div>
                      </td>
                      <td className="text-stone-600">{r.guests}</td>
                      <td className="font-medium">{r.total}€</td>
                      <td>
                        <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full">
                          {r.status}
                        </span>
                      </td>
                      <td className="text-right pr-4">
                        <Button variant="ghost" onClick={() => del(r.id)}>🗑</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Mobile card list */}
          <div className="md:hidden space-y-3">
            {data.map((r) => (
              <Card key={r.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="font-mono text-xs text-stone-500">{r.booking_number}</div>
                  <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full">
                    {r.status}
                  </span>
                </div>
                <div className="font-medium text-stone-800 mt-2">{r.name}</div>
                <div className="text-xs text-stone-500">{r.email}</div>
                <div className="mt-3 flex justify-between text-sm">
                  <div className="text-stone-600">
                    {r.check_in?.split("T")[0]} → {r.check_out?.split("T")[0]}
                    <div className="text-xs text-stone-400">
                      {r.nights} nuit(s) · {r.guests} pers.
                    </div>
                  </div>
                  <div className="font-serif text-xl text-stone-800">{r.total}€</div>
                </div>
                <div className="mt-3 pt-3 border-t border-stone-100 text-right">
                  <Button variant="danger" onClick={() => del(r.id)}>
                    Supprimer
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </>
  );
}
