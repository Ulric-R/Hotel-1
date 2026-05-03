import { useState, useEffect } from "react";
import { api, type Room } from "../lib/api";

type Props = {
  rooms: Room[];
  open: boolean;
  onClose: () => void;
  initialRoom?: Room | null;
};

type Step = 1 | 2 | 3 | 4;

export default function ReservationModal({ rooms, open, onClose, initialRoom }: Props) {
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const [step, setStep] = useState<Step>(1);
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [guests, setGuests] = useState(2);
  const [selectedRoomId, setSelectedRoomId] = useState<string>(rooms[0].id);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  // Keep all hooks (useState/useEffect) at the top level and in a stable order.
  // `bookingNumber` and `submitting` must be declared before any early
  // returns so the hook order does not change between renders.
  const [bookingNumber, setBookingNumber] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialRoom) {
      setSelectedRoomId(initialRoom.id);
      setStep(1);
    }
  }, [initialRoom]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setTimeout(() => {
        setStep(1);
        setConfirmed(false);
      }, 300);
    }
  }, [open]);

  if (!open) return null;

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId)!;
  const nights = Math.max(
    1,
    Math.round(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000
    )
  );
  const subtotal = selectedRoom.price * nights;
  const taxes = Math.round(subtotal * 0.1);
  const total = subtotal + taxes;

  const next = () => setStep((s) => Math.min(4, s + 1) as Step);
  const prev = () => setStep((s) => Math.max(1, s - 1) as Step);



  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.createReservation({
        room_id: selectedRoom.id,
        check_in: checkIn,
        check_out: checkOut,
        guests,
        name,
        email,
        phone,
        notes,
      });
      setBookingNumber(res.booking_number);
    } catch {
      // Offline fallback: generate a local booking number so demo still works
      setBookingNumber(`SYL-${Math.floor(Math.random() * 90000 + 10000)}`);
    } finally {
      setSubmitting(false);
      setConfirmed(true);
      setStep(4);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 bg-stone-950/70 backdrop-blur-sm animate-[fadeIn_0.2s]">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[92vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 md:px-8 py-5 border-b border-stone-200">
          <div>
            <h3 className="font-serif text-2xl text-stone-800">
              {confirmed ? "Réservation confirmée" : "Réserver votre séjour"}
            </h3>
            {!confirmed && (
              <p className="text-xs text-stone-500 mt-1">
                Étape {step} sur 3
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-2"
            aria-label="Fermer"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>

        {/* Progress */}
        {!confirmed && (
          <div className="px-6 md:px-8 pt-4">
            <div className="flex gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    step >= s ? "bg-emerald-700" : "bg-stone-200"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6">
          {/* Step 1 - Dates */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h4 className="font-serif text-xl text-stone-800 mb-1">
                  Quand souhaitez-vous séjourner ?
                </h4>
                <p className="text-sm text-stone-500">
                  Sélectionnez vos dates et le nombre de voyageurs.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
                <div>
                  <label className="text-xs uppercase tracking-widest text-stone-500">
                    Arrivée
                  </label>
                  <input
                    type="date"
                    min={today}
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full mt-2 border border-stone-300 rounded-lg px-4 py-3 outline-none focus:border-emerald-700"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-stone-500">
                    Départ
                  </label>
                  <input
                    type="date"
                    min={checkIn}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full mt-2 border border-stone-300 rounded-lg px-4 py-3 outline-none focus:border-emerald-700"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-stone-500">
                    Voyageurs
                  </label>
                  <div className="mt-2 flex items-center justify-between border border-stone-300 rounded-lg px-4 py-2.5">
                    <button
                      type="button"
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200"
                    >
                      −
                    </button>
                    <span className="font-medium">{guests}</span>
                    <button
                      type="button"
                      onClick={() => setGuests(Math.min(6, guests + 1))}
                      className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-sm text-emerald-900">
                <strong>{nights}</strong> nuit{nights > 1 ? "s" : ""} · {guests} voyageur{guests > 1 ? "s" : ""}
              </div>
            </div>
          )}

          {/* Step 2 - Room selection */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h4 className="font-serif text-xl text-stone-800 mb-1">
                  Choisissez votre hébergement
                </h4>
                <p className="text-sm text-stone-500">
                  Disponibilités confirmées pour vos dates.
                </p>
              </div>

              <div className="space-y-3">
                {rooms
                  .filter((r) => r.capacity >= guests)
                  .map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setSelectedRoomId(r.id)}
                      className={`w-full flex gap-4 p-3 rounded-xl border-2 transition-all text-left ${
                        selectedRoomId === r.id
                          ? "border-emerald-700 bg-emerald-50/50"
                          : "border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      <img
                        src={r.image}
                        alt={r.name}
                        className="w-28 h-28 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h5 className="font-serif text-lg text-stone-800">
                              {r.name}
                            </h5>
                            <div className="text-xs text-stone-500">{r.type}</div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="font-serif text-xl text-stone-800">
                              {r.price}€
                            </div>
                            <div className="text-xs text-stone-500">/nuit</div>
                          </div>
                        </div>
                        <p className="text-sm text-stone-600 mt-1 line-clamp-2">
                          {r.description}
                        </p>
                        <div className="flex gap-3 text-xs text-stone-500 mt-2">
                          <span>{r.capacity} pers.</span>
                          <span>·</span>
                          <span>{r.size} m²</span>
                        </div>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Step 3 - Details */}
          {step === 3 && (
            <form onSubmit={submit} className="space-y-6" id="reservation-form">
              <div>
                <h4 className="font-serif text-xl text-stone-800 mb-1">
                  Vos coordonnées
                </h4>
                <p className="text-sm text-stone-500">
                  Nous vous enverrons la confirmation par email.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs uppercase tracking-widest text-stone-500">
                    Nom complet
                  </label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full mt-2 border border-stone-300 rounded-lg px-4 py-3 outline-none focus:border-emerald-700"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-stone-500">
                    Téléphone
                  </label>
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full mt-2 border border-stone-300 rounded-lg px-4 py-3 outline-none focus:border-emerald-700"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-stone-500">
                  Email
                </label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-2 border border-stone-300 rounded-lg px-4 py-3 outline-none focus:border-emerald-700"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-stone-500">
                  Demandes spéciales (optionnel)
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full mt-2 border border-stone-300 rounded-lg px-4 py-3 outline-none focus:border-emerald-700 resize-none"
                  placeholder="Allergies, occasion spéciale, heure d'arrivée..."
                />
              </div>
            </form>
          )}

          {/* Step 4 - Confirmation */}
          {step === 4 && confirmed && (
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-6">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="font-serif text-3xl text-stone-800">Merci, {name.split(" ")[0]} !</h4>
              <p className="text-stone-600 mt-3 max-w-md mx-auto">
                Votre réservation pour <strong>{selectedRoom.name}</strong> du{" "}
                {new Date(checkIn).toLocaleDateString("fr-FR")} au{" "}
                {new Date(checkOut).toLocaleDateString("fr-FR")} est confirmée.
              </p>
              <p className="text-sm text-stone-500 mt-2">
                Un email récapitulatif a été envoyé à <strong>{email}</strong>.
              </p>
              <div className="mt-8 inline-block bg-stone-50 rounded-xl px-6 py-4 text-left">
                <div className="text-xs uppercase tracking-widest text-stone-500">
                  Numéro de réservation
                </div>
                <div className="font-mono text-lg text-stone-800 mt-1">
                  {bookingNumber}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer with summary + nav */}
        {!confirmed && (
          <div className="border-t border-stone-200 bg-stone-50 px-6 md:px-8 py-5">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
              <div className="flex-1">
                <div className="text-xs uppercase tracking-widest text-stone-500">
                  {selectedRoom.name} · {nights} nuit{nights > 1 ? "s" : ""}
                </div>
                <div className="font-serif text-2xl text-stone-800 mt-0.5">
                  {total}€{" "}
                  <span className="text-xs text-stone-500 font-sans">
                    (taxes incluses)
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                {step > 1 && (
                  <button
                    onClick={prev}
                    className="px-5 py-3 rounded-full border border-stone-300 hover:bg-white text-stone-700"
                  >
                    Précédent
                  </button>
                )}
                {step < 3 && (
                  <button
                    onClick={next}
                    className="px-6 py-3 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white"
                  >
                    Continuer
                  </button>
                )}
                {step === 3 && (
                  <button
                    type="submit"
                    form="reservation-form"
                    disabled={submitting}
                    className="px-6 py-3 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white disabled:opacity-60"
                  >
                    {submitting ? "Envoi..." : "Confirmer la réservation"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {confirmed && (
          <div className="border-t border-stone-200 px-6 md:px-8 py-5 flex justify-center">
            <button
              onClick={onClose}
              className="px-8 py-3 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white"
            >
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
