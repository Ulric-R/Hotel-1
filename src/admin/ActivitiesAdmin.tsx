import { useState } from "react";
import { adminApi, api, type Activity } from "../lib/api";
import { useApiData } from "../lib/useApi";
import { Button, Card, ConfirmDelete, Empty, Field, ImageUploader, Input, PageHeader, Textarea } from "./ui";

const empty: Omit<Activity, "id"> = {
  title: "",
  description: "",
  icon: "🌿",
  image: null,
  featured: false,
  order: 10,
};

const SUGGESTED_ICONS = ["🌿", "🥾", "🧘", "🚴", "🦌", "🔥", "⭐", "♨️", "🍽️", "🛶", "🏹", "📸", "🎣", "🌌"];

export default function ActivitiesAdmin() {
  const { data, reload, setData } = useApiData(api.activities, [] as Activity[]);
  const [editing, setEditing] = useState<Activity | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCreate = () => {
    setError(null);
    setEditing({ id: "", ...empty });
    setCreating(true);
  };

  const save = async (a: Activity) => {
    if (!a.title.trim()) {
      setError("Le titre est obligatoire.");
      return;
    }
    setError(null);
    const payload = { ...a } as Omit<Activity, "id"> & { id?: string };
    delete payload.id;
    try {
      if (creating) {
        const created = await adminApi.createActivity(payload);
        setData([...data, created]);
      } else {
        const updated = await adminApi.updateActivity(a.id, payload);
        setData(data.map((x) => (x.id === a.id ? updated : x)));
      }
      reload();
    } catch (e) {
      const localId = a.id || `local-${Date.now()}`;
      const next = creating
        ? [...data, { ...a, id: localId }]
        : data.map((x) => (x.id === a.id ? a : x));
      setData(next);
      setError(`⚠ Sauvegarde locale uniquement (API indisponible). ${e instanceof Error ? e.message : ""}`);
    }
    setEditing(null);
    setCreating(false);
  };

  const del = async (id: string) => {
    try {
      await adminApi.deleteActivity(id);
    } catch { /* offline */ }
    setData(data.filter((x) => x.id !== id));
  };

  const featured = data.filter((a) => a.featured);
  const tiles = data.filter((a) => !a.featured);

  return (
    <>
      <PageHeader
        title="Expériences & activités"
        subtitle="Gérez les expériences phares et les activités proposées."
        action={<Button onClick={startCreate}>+ Nouvelle activité</Button>}
      />

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
          {error}
        </div>
      )}

      {editing && (
        <ActivityForm
          activity={editing}
          onCancel={() => { setEditing(null); setCreating(false); setError(null); }}
          onSave={save}
        />
      )}

      <h2 className="font-serif text-2xl text-stone-800 mb-3 mt-2">Expériences mises en avant</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {featured.length === 0 && <Empty message="Aucune expérience mise en avant." />}
        {featured.map((a) => (
          <Card key={a.id} className="overflow-hidden">
            {a.image && <img src={a.image} alt={a.title} className="w-full h-40 object-cover" />}
            <div className="p-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{a.icon}</span>
                <h3 className="font-serif text-lg text-stone-800">{a.title}</h3>
              </div>
              <p className="text-sm text-stone-600 mt-2 line-clamp-2">{a.description}</p>
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-stone-100">
                <Button variant="secondary" onClick={() => { setEditing(a); setCreating(false); }}>Éditer</Button>
                <ConfirmDelete onConfirm={() => del(a.id)} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <h2 className="font-serif text-2xl text-stone-800 mb-3">Vignettes d'activités</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {tiles.length === 0 && <Empty message="Aucune vignette." />}
        {tiles.map((a) => (
          <Card key={a.id} className="p-4 text-center">
            <div className="text-4xl">{a.icon}</div>
            <div className="font-medium text-stone-800 mt-2 text-sm">{a.title}</div>
            <div className="text-xs text-stone-400">ordre : {a.order}</div>
            <div className="flex justify-center gap-1 mt-3">
              <Button variant="ghost" onClick={() => { setEditing(a); setCreating(false); }}>✏️</Button>
              <Button variant="ghost" onClick={() => { if (confirm("Supprimer ?")) del(a.id); }}>🗑</Button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

function ActivityForm({
  activity,
  onCancel,
  onSave,
}: {
  activity: Activity;
  onCancel: () => void;
  onSave: (a: Activity) => void;
}) {
  const [a, setA] = useState<Activity>(activity);
  return (
    <Card className="p-6 mb-6">
      <h2 className="font-serif text-2xl mb-5">{activity.id ? "Modifier" : "Créer"} une activité</h2>
      <form onSubmit={(e) => { e.preventDefault(); onSave(a); }} className="grid sm:grid-cols-2 gap-4 sm:gap-5">
        <Field label="Titre">
          <Input required value={a.title} onChange={(e) => setA({ ...a, title: e.target.value })} />
        </Field>
        <Field label="Icône (emoji)">
          <div className="flex gap-2">
            <Input
              value={a.icon}
              onChange={(e) => setA({ ...a, icon: e.target.value })}
              className="text-2xl text-center w-20"
            />
            <div className="flex flex-wrap gap-1">
              {SUGGESTED_ICONS.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setA({ ...a, icon: ic })}
                  className="w-8 h-8 hover:bg-stone-100 rounded text-xl"
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>
        </Field>
        <Field label="Ordre d'affichage" hint="Plus petit = affiché en premier">
          <Input type="number" value={a.order} onChange={(e) => setA({ ...a, order: +e.target.value })} />
        </Field>
        <div>
          <label className="text-xs uppercase tracking-widest text-stone-500">Mise en avant</label>
          <div className="mt-1.5 flex items-center gap-2 h-10">
            <input
              id="featured"
              type="checkbox"
              checked={a.featured}
              onChange={(e) => setA({ ...a, featured: e.target.checked })}
            />
            <label htmlFor="featured" className="text-sm text-stone-600">
              Afficher comme grande carte (avec image)
            </label>
          </div>
        </div>
        <div className="sm:col-span-2">
          <Field label="Description">
            <Textarea rows={3} value={a.description} onChange={(e) => setA({ ...a, description: e.target.value })} />
          </Field>
        </div>
        {a.featured && (
          <div className="sm:col-span-2">
            <Field label="Image (recommandée pour les mises en avant)">
              <ImageUploader value={a.image || ""} onChange={(url) => setA({ ...a, image: url })} />
            </Field>
          </div>
        )}
        <div className="sm:col-span-2 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-3 border-t border-stone-200">
          <Button type="button" variant="ghost" onClick={onCancel}>Annuler</Button>
          <Button type="submit">Enregistrer</Button>
        </div>
      </form>
    </Card>
  );
}
