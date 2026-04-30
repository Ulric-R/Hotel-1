/** Shared admin UI primitives. */
import { useState } from "react";
import { adminApi } from "../lib/api";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8 pb-5 sm:pb-6 border-b border-stone-200">
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl text-stone-800">{title}</h1>
        {subtitle && <p className="text-stone-500 mt-1 text-sm sm:text-base">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
}) {
  const base = "px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50";
  const variants = {
    primary: "bg-emerald-700 hover:bg-emerald-800 text-white",
    secondary: "bg-stone-200 hover:bg-stone-300 text-stone-800",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    ghost: "text-stone-600 hover:bg-stone-100",
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-stone-500">{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint && <span className="text-xs text-stone-400 mt-1 block">{hint}</span>}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full border border-stone-300 rounded-lg px-3 py-2 outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 ${
        props.className || ""
      }`}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full border border-stone-300 rounded-lg px-3 py-2 outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 ${
        props.className || ""
      }`}
    />
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white rounded-xl shadow-sm border border-stone-200 ${className}`}>{children}</div>;
}

export function Empty({ message }: { message: string }) {
  return (
    <div className="text-center py-16 text-stone-400">
      <div className="text-5xl mb-3">📭</div>
      {message}
    </div>
  );
}

/** Drag-drop image uploader. Calls back with the resulting URL. */
export function ImageUploader({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    setErr(null);
    try {
      const { url } = await adminApi.upload(file);
      onChange(url);
    } catch {
      // Offline / API down → fallback to inline data URL so the form still works
      const reader = new FileReader();
      reader.onload = () => onChange(String(reader.result));
      reader.onerror = () => setErr("Impossible de lire le fichier");
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-start">
      <div className="w-full sm:w-32 h-40 sm:h-32 rounded-lg bg-stone-100 border border-stone-200 overflow-hidden flex items-center justify-center flex-shrink-0">
        {value ? (
          <img src={value} alt="aperçu" className="w-full h-full object-cover" />
        ) : (
          <span className="text-stone-400 text-xs">Aperçu</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/uploads/... ou URL https://..."
        />
        <label className="inline-block mt-2 cursor-pointer">
          <span className="text-sm text-emerald-700 hover:text-emerald-800 underline">
            {uploading ? "Téléversement..." : "📤 Téléverser une image"}
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </label>
        {err && <div className="text-red-600 text-xs mt-1">{err}</div>}
      </div>
    </div>
  );
}

export function ConfirmDelete({
  onConfirm,
  label = "Supprimer",
}: {
  onConfirm: () => void;
  label?: string;
}) {
  return (
    <Button
      variant="danger"
      onClick={() => {
        if (confirm("Confirmer la suppression ?")) onConfirm();
      }}
    >
      {label}
    </Button>
  );
}
