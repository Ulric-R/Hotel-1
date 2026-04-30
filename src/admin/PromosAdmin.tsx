import { useState } from "react";
import { adminApi, api, type Promo } from "../lib/api";
import { useApiData } from "../lib/useApi";
import { Button, Card, ConfirmDelete, Empty, Field, ImageUploader, Input, PageHeader, Textarea } from "./ui";

const empty: Omit<Promo, "id"> = {
  title: "",
  description: "",
  discount_percent: 10,
  valid_until: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
  image: "",
  active: true,
};

export default function PromosAdmin() {
  const { data, reload } = useApiData(() => api.promos(), [] as Promo[]);
  const [editing, setEditing] = useState<Promo | null>(null);
  const [creating, setCreating] = useState(false);

  const save = async (p: Promo) => {
    const payload = { ...p } as Partial<Promo>;
    delete payload.id;
    if (creating) await adminApi.createPromo(payload as Omit<Promo, "id">);
    else await adminApi.updatePromo(p.id, payload as Omit<Promo, "id">);
    setEditing(null); setCreating(false); reload();
  };

  return (
    <>
      <PageHeader
        title="Promotions"
        subtitle="Lancez des offres spéciales pour booster vos réservations."
        action={
          <Button onClick={() => { setEditing({ id: "", ...empty }); setCreating(true); }}>+ Nouvelle promo</Button>
        }
      />

      {editing && (
        <PromoForm promo={editing} onCancel={() => { setEditing(null); setCreating(false); }} onSave={save} />
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {data.length === 0 && <Empty message="Aucune promotion en cours." />}
        {data.map((p) => (
          <Card key={p.id} className="p-5">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-xl text-stone-800">{p.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.active ? "bg-emerald-100 text-emerald-700" : "bg-stone-200 text-stone-600"}`}>
                    {p.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-sm text-stone-600 mt-2">{p.description}</p>
                <div className="mt-3 text-sm">
                  <span className="font-serif text-2xl text-rose-600">-{p.discount_percent}%</span>
                  <span className="text-stone-400 text-xs ml-2">jusqu'au {p.valid_until}</span>
                </div>
              </div>
              {p.image && <img src={p.image} className="w-20 h-20 rounded-lg object-cover" alt="" />}
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t border-stone-100">
              <Button variant="secondary" onClick={() => { setEditing(p); setCreating(false); }}>Éditer</Button>
              <ConfirmDelete onConfirm={async () => { await adminApi.deletePromo(p.id); reload(); }} />
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

function PromoForm({ promo, onCancel, onSave }: { promo: Promo; onCancel: () => void; onSave: (p: Promo) => void }) {
  const [p, setP] = useState<Promo>(promo);
  return (
    <Card className="p-6 mb-6">
      <h2 className="font-serif text-2xl mb-5">{promo.id ? "Modifier" : "Créer"} une promotion</h2>
      <form onSubmit={(e) => { e.preventDefault(); onSave(p); }} className="space-y-5">
        <Field label="Titre"><Input required value={p.title} onChange={(e) => setP({ ...p, title: e.target.value })} /></Field>
        <Field label="Description"><Textarea rows={3} value={p.description} onChange={(e) => setP({ ...p, description: e.target.value })} /></Field>
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
          <Field label="Réduction (%)"><Input type="number" min={1} max={90} value={p.discount_percent} onChange={(e) => setP({ ...p, discount_percent: +e.target.value })} /></Field>
          <Field label="Valable jusqu'au"><Input type="date" value={p.valid_until} onChange={(e) => setP({ ...p, valid_until: e.target.value })} /></Field>
        </div>
        <Field label="Image (optionnelle)">
          <ImageUploader value={p.image || ""} onChange={(url) => setP({ ...p, image: url })} />
        </Field>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={p.active} onChange={(e) => setP({ ...p, active: e.target.checked })} />
          <span className="text-sm">Promotion active</span>
        </label>
        <div className="flex gap-3 justify-end pt-3 border-t border-stone-200">
          <Button type="button" variant="ghost" onClick={onCancel}>Annuler</Button>
          <Button type="submit">Enregistrer</Button>
        </div>
      </form>
    </Card>
  );
}
