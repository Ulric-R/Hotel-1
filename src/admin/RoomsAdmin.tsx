import { useState } from "react";
import { adminApi, api, type Room } from "../lib/api";
import { useApiData } from "../lib/useApi";
import { Button, Card, ConfirmDelete, Empty, Field, ImageUploader, Input, PageHeader, Textarea } from "./ui";

const empty: Omit<Room, "id"> = {
  name: "",
  type: "Chambre",
  price: 100,
  capacity: 2,
  size: 30,
  image: "",
  description: "",
  amenities: [],
};

export default function RoomsAdmin() {
  const { data, reload, setData } = useApiData(api.rooms, [] as Room[]);
  const [editing, setEditing] = useState<Room | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCreate = () => {
    setError(null);
    setEditing({ id: "", ...empty });
    setCreating(true);
  };

  const save = async (room: Room) => {
    if (!room.name || !room.image) {
      setError("Le nom et l'image sont obligatoires.");
      return;
    }
    setError(null);
    const payload = { ...room } as Omit<Room, "id"> & { id?: string };
    delete payload.id;
    try {
      if (creating) {
        const created = await adminApi.createRoom(payload);
        setData([...data, created]);
      } else {
        const updated = await adminApi.updateRoom(room.id, payload);
        setData(data.map((r) => (r.id === room.id ? updated : r)));
      }
      reload();
    } catch (e) {
      // Offline fallback: keep working locally so admin can still demo
      const localId = room.id || `local-${Date.now()}`;
      const next = creating
        ? [...data, { ...room, id: localId }]
        : data.map((r) => (r.id === room.id ? room : r));
      setData(next);
      setError(
        `⚠ Sauvegarde locale uniquement (API indisponible). ${
          e instanceof Error ? e.message : ""
        }`
      );
    }
    setEditing(null);
    setCreating(false);
  };

  const del = async (id: string) => {
    try {
      await adminApi.deleteRoom(id);
    } catch {
      /* offline → just drop locally */
    }
    setData(data.filter((r) => r.id !== id));
  };

  return (
    <>
      <PageHeader
        title="Hébergements"
        subtitle="Gérez vos chambres, suites et cabanes."
        action={<Button onClick={startCreate}>+ Nouvel hébergement</Button>}
      />

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
          {error}
        </div>
      )}

      {editing && (
        <RoomForm
          room={editing}
          onCancel={() => {
            setEditing(null);
            setCreating(false);
            setError(null);
          }}
          onSave={save}
        />
      )}

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {data.length === 0 && <Empty message="Aucun hébergement." />}
        {data.map((r) => (
          <Card key={r.id} className="p-4 flex flex-col sm:flex-row gap-4">
            <img
              src={r.image}
              alt={r.name}
              className="w-full sm:w-28 h-40 sm:h-28 object-cover rounded-lg flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-serif text-xl text-stone-800">{r.name}</h3>
              <div className="text-xs text-stone-500">
                {r.type} · {r.price}€/nuit · {r.capacity} pers.
              </div>
              <p className="text-sm text-stone-600 mt-2 line-clamp-2">{r.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Button variant="secondary" onClick={() => { setEditing(r); setCreating(false); }}>Éditer</Button>
                <ConfirmDelete onConfirm={() => del(r.id)} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

function RoomForm({ room, onCancel, onSave }: { room: Room; onCancel: () => void; onSave: (r: Room) => void }) {
  const [r, setR] = useState<Room>(room);
  const [amenitiesText, setAmenitiesText] = useState(room.amenities.join(", "));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...r,
      amenities: amenitiesText.split(",").map((s) => s.trim()).filter(Boolean),
    });
  };

  return (
    <Card className="p-6 mb-6">
      <h2 className="font-serif text-2xl mb-5">{room.id ? "Modifier" : "Créer"} un hébergement</h2>
      <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4 sm:gap-5">
        <Field label="Nom"><Input required value={r.name} onChange={(e) => setR({ ...r, name: e.target.value })} /></Field>
        <Field label="Type"><Input required value={r.type} onChange={(e) => setR({ ...r, type: e.target.value })} /></Field>
        <Field label="Prix / nuit (€)"><Input type="number" value={r.price} onChange={(e) => setR({ ...r, price: +e.target.value })} /></Field>
        <Field label="Capacité"><Input type="number" value={r.capacity} onChange={(e) => setR({ ...r, capacity: +e.target.value })} /></Field>
        <Field label="Surface (m²)"><Input type="number" value={r.size} onChange={(e) => setR({ ...r, size: +e.target.value })} /></Field>
        <div className="sm:col-span-2">
          <Field label="Image">
            <ImageUploader value={r.image} onChange={(url) => setR({ ...r, image: url })} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Description"><Textarea rows={3} value={r.description} onChange={(e) => setR({ ...r, description: e.target.value })} /></Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Équipements (séparés par virgule)" hint="Ex: Wi-Fi, Cheminée, Petit-déjeuner">
            <Input value={amenitiesText} onChange={(e) => setAmenitiesText(e.target.value)} />
          </Field>
        </div>
        <div className="sm:col-span-2 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-3 border-t border-stone-200">
          <Button type="button" variant="ghost" onClick={onCancel}>Annuler</Button>
          <Button type="submit">Enregistrer</Button>
        </div>
      </form>
    </Card>
  );
}
