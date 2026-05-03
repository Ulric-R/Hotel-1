import { adminApi, type Reservation } from "../lib/api";
import { useApiData } from "../lib/useApi";
import { Button, Card, Empty, PageHeader } from "./ui";
import Icon from "./icons";
import { useEffect, useState } from "react";

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

  const confirm = async (id: string) => {
    try {
      const updated = await adminApi.confirmReservation(id);
      setData((d) => d.map((r) => (r.id === id ? updated : r)));
    } catch {
      reload();
    }
  };

  // Simple polling for new reservations/notifications
  const [notifyNew, setNotifyNew] = useState<string | null>(null);
  useEffect(() => {
    let lastCount = data.length;
    const iv = setInterval(async () => {
      try {
        const n = await adminApi.notifications();
        if (n.count > lastCount) {
          setNotifyNew(`Nouvelle réservation reçue (${n.count})`);
          // refresh list
          reload();
          lastCount = n.count;
          setTimeout(() => setNotifyNew(null), 5000);
        } else {
          lastCount = n.count;
        }
      } catch {
        // ignore
      }
    }, 5000);
    return () => clearInterval(iv);
  }, [reload, data.length]);

  return (
    <>
      <PageHeader title="Réservations" subtitle={`${data.length} réservation(s) au total.`} />
      {notifyNew && (
        <div className="mt-3 mx-4 p-3 bg-amber-50 border border-amber-100 text-amber-900 rounded-md text-sm">
          {notifyNew}
        </div>
      )}

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
                        {r.status !== "confirmed" && (
                          <Button variant="primary" onClick={() => confirm(r.id)} className="mr-2">
                            Confirmer
                          </Button>
                        )}
                        <Button variant="ghost" onClick={() => del(r.id)}><Icon name="trash" /></Button>
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
                  {r.status !== "confirmed" && (
                    <Button variant="primary" onClick={() => confirm(r.id)} className="mr-2">
                      Confirmer
                    </Button>
                  )}
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
