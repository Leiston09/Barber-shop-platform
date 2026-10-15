
import type {
  BarberClient,
  BarberClientAppointment,
} from "@/stores/barber";

export const MESES = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

export const MESES_LARGO = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

export const DIAS_LARGO = [
  "domingo", "lunes", "martes", "miércoles",
  "jueves", "viernes", "sábado",
];

export const aptDateTime = (
  date: string | Date,
  time: string,
): Date => {
  const key =
    typeof date === "string"
      ? date.slice(0, 10)
      : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  const [y, m, d] = key.split("-").map(Number);
  const [h, min] = time.split(":").map(Number);

  return new Date(y!, m! - 1, d!, h ?? 0, min ?? 0);
};

export const longDate = (date: string | Date): string => {
  const d =
    typeof date === "string"
      ? new Date(date.slice(0, 10) + "T12:00:00")
      : date;

  if (Number.isNaN(d.getTime())) return "—";

  return `${d.getDate()} de ${MESES_LARGO[d.getMonth()]} de ${d.getFullYear()}`;
};

export const initialOf = (name: string): string =>
  name?.trim().charAt(0).toUpperCase() || "?";

export const roleLabel = (role: string): string => {
  if (role === "admin") return "Admin";
  if (role === "barber") return "Barbero";
  return "Cliente";
};

export const roleBadgeClass = (role: string): string => {
  if (role === "admin") {
    return "bg-purple-500/5 border-purple-500/20 text-purple-400/80";
  }

  if (role === "barber") {
    return "bg-[#ffb700]/5 border-[#ffb700]/20 text-[#ffb700]/80";
  }

  return "bg-white/5 border-white/10 text-white/45";
};

export const getNextAppointment = (
  client: BarberClient,
): BarberClientAppointment | null => {
  if (!client.appointments?.length) return null;

  const now = new Date();

  return (
    [...client.appointments]
      .sort((a, b) => {
        const aTime = aptDateTime(a.date, a.time).getTime();
        const bTime = aptDateTime(b.date, b.time).getTime();

        return aTime - bTime;
      })
      .find(
        (appointment) =>
          aptDateTime(
            appointment.date,
            appointment.time,
          ).getTime() >= now.getTime(),
      ) ?? null
  );
};

export const dayOf = (
  appointment: BarberClientAppointment | null,
): string => {
  if (!appointment) return "";

  return String(
    aptDateTime(appointment.date, appointment.time).getDate(),
  ).padStart(2, "0");
};

export const monthOf = (
  appointment: BarberClientAppointment | null,
): string => {
  if (!appointment) return "";

  return MESES[
    aptDateTime(appointment.date, appointment.time).getMonth()
  ] ?? "—";
};

export const weekdayOf = (
  appointment: BarberClientAppointment | null,
): string => {
  if (!appointment) return "";

  return DIAS_LARGO[
    aptDateTime(appointment.date, appointment.time).getDay()
  ] ?? "";
};

export const labelOf = (
  appointment: BarberClientAppointment | null,
): string => {
  if (!appointment) return "";

  const date = aptDateTime(appointment.date, appointment.time);
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const appointmentDay = new Date(date);
  appointmentDay.setHours(0, 0, 0, 0);

  const diffDays = Math.round(
    (appointmentDay.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) return "Hoy";
  if (diffDays === 1) return "Mañana";
  if (diffDays <= 7) return `En ${diffDays} días`;

  return "Próxima";
};

export const chipClassOf = (
  appointment: BarberClientAppointment | null,
  isGlobalNext: boolean,
): string => {
  if (!appointment) return "";

  if (!isGlobalNext) {
    return "bg-white/5 border-white/10 text-white/40";
  }

  if (labelOf(appointment) === "Hoy") {
    return "bg-emerald-500/15 border-emerald-500/50 text-emerald-400";
  }

  return "bg-[#ffb700]/10 border-[#ffb700]/40 text-[#ffb700]";
};

export const appointmentKey = (
  appointment: BarberClientAppointment,
): number => {
  return aptDateTime(
    appointment.date,
    appointment.time,
  ).getTime();
};
