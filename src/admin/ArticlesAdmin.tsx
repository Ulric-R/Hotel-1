import { useState } from "react";
import { adminApi, api, type Article } from "../lib/api";
import { useApiData } from "../lib/useApi";
import { Button, Card, ConfirmDelete, Empty, Field, ImageUploader, Input, PageHeader, Textarea } from "./ui";

const empty: Omit<Article, "id" | "created_at"> = {
  title: "",
  excerpt: "",
  content: "",
  image: "",
  author: "Équipe Sylvana",
  category: "Nature",
};

export default function ArticlesAdmin() {
  const { data, reload } = useApiData(api.articles, [] as Article[]);
  const [editing, setEditing] = useState<Article | null>(null);
  const [creating, setCreating] = useState(false);

  const save = async (a: Article) => {
    const payload = { ...a } as Partial<Article>;
    delete payload.id; delete payload.created_at;
    if (creating) await adminApi.createArticle(payload as Omit<Article, "id" | "created_at">);
    else await adminApi.updateArticle(a.id, payload as Omit<Article, "id" | "created_at">);
    setEditing(null); setCreating(false); reload();
  };

  return (
    <>
      <PageHeader
        title="Articles"
        subtitle="Inspirez vos visiteurs avec votre contenu éditorial."
        action={
          <Button onClick={() => { setEditing({ id: "", created_at: "", ...empty }); setCreating(true); }}>
            + Nouvel article
          </Button>
        }
      />

      {editing && (
        <ArticleForm article={editing} onCancel={() => { setEditing(null); setCreating(false); }} onSave={save} />
      )}

      <div className="space-y-3">
        {data.length === 0 && <Empty message="Aucun article publié." />}
        {data.map((a) => (
          <Card key={a.id} className="p-4 flex flex-col sm:flex-row gap-4">
            <img
              src={a.image}
              alt={a.title}
              className="w-full sm:w-24 h-40 sm:h-24 object-cover rounded-lg flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs uppercase tracking-widest text-emerald-700">{a.category}</div>
              <h3 className="font-serif text-xl text-stone-800">{a.title}</h3>
              <p className="text-sm text-stone-500 mt-1 line-clamp-2">{a.excerpt}</p>
              <div className="text-xs text-stone-400 mt-2">Par {a.author} · {a.created_at?.split("T")[0]}</div>
            </div>
            <div className="flex sm:flex-col gap-2 flex-shrink-0">
              <Button variant="secondary" onClick={() => { setEditing(a); setCreating(false); }}>Éditer</Button>
              <ConfirmDelete onConfirm={async () => { await adminApi.deleteArticle(a.id); reload(); }} />
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

function ArticleForm({ article, onCancel, onSave }: { article: Article; onCancel: () => void; onSave: (a: Article) => void }) {
  const [a, setA] = useState<Article>(article);

  return (
    <Card className="p-6 mb-6">
      <h2 className="font-serif text-2xl mb-5">{article.id ? "Modifier" : "Créer"} un article</h2>
      <form onSubmit={(e) => { e.preventDefault(); onSave(a); }} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
          <Field label="Titre"><Input required value={a.title} onChange={(e) => setA({ ...a, title: e.target.value })} /></Field>
          <Field label="Catégorie"><Input value={a.category} onChange={(e) => setA({ ...a, category: e.target.value })} /></Field>
          <Field label="Auteur"><Input value={a.author} onChange={(e) => setA({ ...a, author: e.target.value })} /></Field>
        </div>
        <Field label="Image de couverture">
          <ImageUploader value={a.image} onChange={(url) => setA({ ...a, image: url })} />
        </Field>
        <Field label="Résumé"><Textarea rows={2} value={a.excerpt} onChange={(e) => setA({ ...a, excerpt: e.target.value })} /></Field>
        <Field label="Contenu"><Textarea rows={8} value={a.content} onChange={(e) => setA({ ...a, content: e.target.value })} /></Field>
        <div className="flex gap-3 justify-end pt-3 border-t border-stone-200">
          <Button type="button" variant="ghost" onClick={onCancel}>Annuler</Button>
          <Button type="submit">Publier</Button>
        </div>
      </form>
    </Card>
  );
}
