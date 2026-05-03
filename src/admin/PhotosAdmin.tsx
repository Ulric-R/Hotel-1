import { useState } from "react";
import { adminApi, api, type Photo } from "../lib/api";
import { useApiData } from "../lib/useApi";
import { Button, Card, ConfirmDelete, Empty, Field, ImageUploader, Input, PageHeader } from "./ui";
import Icon from "./icons";

const CATEGORIES = ["general", "exterior", "rooms", "spa", "dining", "nature"];

export default function PhotosAdmin() {
  const { data, reload, setData } = useApiData(() => api.photos(), [] as Photo[]);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("general");
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<Photo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const { url } = await adminApi.upload(file);
      const created = await adminApi.createPhoto({ url, caption, category });
      setData([...data, created]);
      setCaption("");
      reload();
    } catch (e) {
      // Offline fallback: read locally as data URL and store in memory
      try {
        const dataUrl: string = await new Promise((resolve, reject) => {
          const fr = new FileReader();
          fr.onload = () => resolve(String(fr.result));
          fr.onerror = () => reject(new Error("Lecture impossible"));
          fr.readAsDataURL(file);
        });
        const local: Photo = {
          id: `local-${Date.now()}`,
          url: dataUrl,
          caption,
          category,
          uploaded_at: new Date().toISOString(),
        };
        setData([...data, local]);
        setCaption("");
        setError(`⚠ Sauvegarde locale uniquement. ${e instanceof Error ? e.message : ""}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Échec");
      }
    } finally {
      setUploading(false);
    }
  };

  const saveEdit = async (photo: Photo) => {
    const payload = { url: photo.url, caption: photo.caption || "", category: photo.category };
    try {
      const updated = await adminApi.updatePhoto(photo.id, payload);
      setData(data.map((p) => (p.id === photo.id ? updated : p)));
    } catch {
      setData(data.map((p) => (p.id === photo.id ? photo : p)));
    }
    setEditing(null);
  };

  const del = async (id: string) => {
    try { await adminApi.deletePhoto(id); } catch { /* offline */ }
    setData(data.filter((p) => p.id !== id));
  };

  return (
    <>
      <PageHeader title="Galerie photos" subtitle="Téléversez et organisez les images du site." />

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
          {error}
        </div>
      )}

      <Card className="p-5 sm:p-6 mb-6">
        <h2 className="font-serif text-xl mb-4">Ajouter une photo</h2>
        <div className="grid sm:grid-cols-3 gap-4 items-end">
          <Field label="Légende">
            <Input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Coucher de soleil..." />
          </Field>
          <Field label="Catégorie">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-stone-300 rounded-lg px-3 py-2 outline-none focus:border-emerald-700"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <label className="cursor-pointer">
            <div
              className={`bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg px-4 py-2.5 text-sm text-center transition-colors ${
                uploading ? "opacity-50" : ""
              }`}
              >
              {uploading ? "Téléversement..." : <><Icon name="upload" /> Choisir un fichier</>}
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
            />
          </label>
        </div>
      </Card>

      {/* Edit modal */}
      {editing && (
        <PhotoEditModal
          photo={editing}
          onCancel={() => setEditing(null)}
          onSave={saveEdit}
        />
      )}

      {data.length === 0 ? (
        <Empty message="Aucune photo dans la galerie." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {data.map((p) => (
            <Card key={p.id} className="overflow-hidden group">
              <div className="relative h-40 sm:h-48 bg-stone-100">
                <img src={p.url} alt={p.caption || ""} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-stone-900/80 text-white text-[10px] px-2 py-0.5 rounded uppercase tracking-widest">
                  {p.category}
                </div>
              </div>
              <div className="p-3">
                <div className="text-sm text-stone-700 line-clamp-1 min-h-[1.25rem]">
                  {p.caption || <span className="text-stone-300 italic">Sans légende</span>}
                </div>
                <div className="flex gap-1 mt-2">
                  <Button variant="secondary" className="text-xs px-2 py-1" onClick={() => setEditing(p)}>
                    Éditer
                  </Button>
                  <ConfirmDelete onConfirm={() => del(p.id)} label="Supprimer" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

function PhotoEditModal({
  photo,
  onCancel,
  onSave,
}: {
  photo: Photo;
  onCancel: () => void;
  onSave: (p: Photo) => void;
}) {
  const [p, setP] = useState<Photo>(photo);
  return (
    <div
      className="fixed inset-0 z-[100] bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <Card className="w-full max-w-lg p-6" >
        <div onClick={(e) => e.stopPropagation()}>
          <h2 className="font-serif text-2xl mb-5">Modifier la photo</h2>
          <form onSubmit={(e) => { e.preventDefault(); onSave(p); }} className="space-y-4">
            <Field label="Image">
              <ImageUploader value={p.url} onChange={(url) => setP({ ...p, url })} />
            </Field>
            <Field label="Légende">
              <Input value={p.caption || ""} onChange={(e) => setP({ ...p, caption: e.target.value })} />
            </Field>
            <Field label="Catégorie">
              <select
                value={p.category}
                onChange={(e) => setP({ ...p, category: e.target.value })}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 outline-none focus:border-emerald-700"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-3 border-t border-stone-200">
              <Button type="button" variant="ghost" onClick={onCancel}>Annuler</Button>
              <Button type="submit">Enregistrer</Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
