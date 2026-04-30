import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Rooms from "./components/Rooms";
import Promos from "./components/Promos";
import Experiences from "./components/Experiences";
import Articles from "./components/Articles";
import Gallery from "./components/Gallery";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ReservationModal from "./components/ReservationModal";
import RoomDetailModal from "./components/RoomDetailModal";
import AdminApp from "./admin/AdminApp";
import { useRoute } from "./lib/router";
import { rooms as fallbackRooms } from "./data/rooms";
import { useApiData } from "./lib/useApi";
import { api, type Room } from "./lib/api";

export default function App() {
  const { isAdmin, navigate } = useRoute();

  // Modals state
  const [detailRoom, setDetailRoom] = useState<Room | null>(null);
  const [reservationOpen, setReservationOpen] = useState(false);
  const [preSelectedRoom, setPreSelectedRoom] = useState<Room | null>(null);

  // Live rooms from API, fall back to local seed when backend unreachable
  const { data: rooms } = useApiData<Room[]>(api.rooms, fallbackRooms as Room[]);

  if (isAdmin) {
    return <AdminApp onExit={() => navigate("/")} />;
  }

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // Open the room details popup (from any "Détails & Réserver" trigger)
  const showDetails = (room: Room) => setDetailRoom(room);

  // Open the reservation flow — optionally pre-selecting a room
  const openReservation = (room?: Room) => {
    setDetailRoom(null); // close details if open, to surface the reservation flow
    setPreSelectedRoom(room ?? null);
    setReservationOpen(true);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar onNavigate={scrollTo} onReserve={() => openReservation()} />
      <Hero
        onReserve={() => openReservation()}
        onExplore={() => scrollTo("rooms")}
      />
      <About />
      <Rooms rooms={rooms} onShowDetails={showDetails} />
      <Promos onReserve={() => openReservation()} />
      <Experiences />
      <Articles />
      <Gallery />
      <Contact />
      <Footer onAdminClick={() => navigate("/admin")} />

      {/* Room details popup — opened from cards, leads to reservation */}
      <RoomDetailModal
        room={detailRoom}
        onClose={() => setDetailRoom(null)}
        onReserve={(r) => openReservation(r)}
      />

      {/* Reservation flow */}
      <ReservationModal
        rooms={rooms}
        open={reservationOpen}
        onClose={() => setReservationOpen(false)}
        initialRoom={preSelectedRoom}
      />
    </div>
  );
}
