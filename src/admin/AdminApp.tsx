import { useState } from "react";
import AdminLayout from "./AdminLayout";
import Dashboard from "./Dashboard";
import RoomsAdmin from "./RoomsAdmin";
import ArticlesAdmin from "./ArticlesAdmin";
import PromosAdmin from "./PromosAdmin";
import PhotosAdmin from "./PhotosAdmin";
import ActivitiesAdmin from "./ActivitiesAdmin";
import ReservationsAdmin from "./ReservationsAdmin";

export type Tab =
  | "dashboard"
  | "rooms"
  | "activities"
  | "articles"
  | "promos"
  | "photos"
  | "reservations";

export default function AdminApp({ onExit }: { onExit: () => void }) {
  const [tab, setTab] = useState<Tab>("dashboard");

  return (
    <AdminLayout active={tab} onChange={setTab} onExit={onExit}>
      {tab === "dashboard" && <Dashboard />}
      {tab === "rooms" && <RoomsAdmin />}
      {tab === "activities" && <ActivitiesAdmin />}
      {tab === "articles" && <ArticlesAdmin />}
      {tab === "promos" && <PromosAdmin />}
      {tab === "photos" && <PhotosAdmin />}
      {tab === "reservations" && <ReservationsAdmin />}
    </AdminLayout>
  );
}
