import type { AdminAppointment } from "@/stores/admin";

export type AgendaView = "today" | "upcoming" | "past" | "all";
export type AppointmentTiming = "upcoming" | "current" | "past" | "unknown";
export interface AgendaClock { date: string; time: string }
export interface AgendaFilters { client?: string; search: string; date: string; barber: string; view: AgendaView; order: "asc" | "desc" }

export function agendaClock(now = new Date()): AgendaClock {
  return {
    date: new Intl.DateTimeFormat("sv-SE", { timeZone: "America/Guayaquil" }).format(now),
    time: new Intl.DateTimeFormat("en-GB", { timeZone: "America/Guayaquil", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(now),
  };
}
export function appointmentDay(value: string): string {
  if (typeof value !== "string") return "";
  const key = value.slice(0, 10);
  const date = new Date(key + "T12:00:00Z");
  return /^\d{4}-\d{2}-\d{2}$/.test(key) && !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === key ? key : "";
}
const minutes = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3));
export function appointmentTiming(appointment: Pick<AdminAppointment, "date" | "time">, now: AgendaClock): AppointmentTiming {
  const day = appointmentDay(appointment.date);
  if (!day || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(appointment.time)) return "unknown";
  if (day < now.date) return "past";
  if (day > now.date) return "upcoming";
  const elapsed = minutes(now.time) - minutes(appointment.time);
  return elapsed < 0 ? "upcoming" : elapsed < 60 ? "current" : "past";
}
export const normalizeAgendaSearch = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
export function filterAdminAppointments(appointments: readonly AdminAppointment[], filters: AgendaFilters, now: AgendaClock) {
  const text = normalizeAgendaSearch(filters.search.trim());
  return appointments.filter(appointment => {
    const day = appointmentDay(appointment.date);
    if (filters.date ? day !== filters.date : filters.view === "today" && day !== now.date) return false;
    if (!filters.date && filters.view === "upcoming" && appointmentTiming(appointment, now) !== "upcoming") return false;
    if (!filters.date && filters.view === "past" && appointmentTiming(appointment, now) !== "past") return false;
    if (filters.barber && appointment.barber?._id !== filters.barber) return false;
    if (filters.client && appointment.user?._id !== filters.client) return false;
    if (!text) return true;
    const fields = [appointment._id, appointment.user?.name, appointment.user?.email, appointment.barber?.name,
      ...(appointment.services ?? []).filter(Boolean).map(service => service.name)];
    return fields.some(value => typeof value === "string" && normalizeAgendaSearch(value).includes(text));
  }).sort((a, b) => {
    const aDay = appointmentDay(a.date), bDay = appointmentDay(b.date);
    if (!aDay) return bDay ? 1 : 0;
    if (!bDay) return -1;
    return (aDay + a.time).localeCompare(bDay + b.time) * (filters.order === "asc" ? 1 : -1);
  });
}
export function agendaDateLabel(value: string): string {
  const key = appointmentDay(value);
  return key ? new Intl.DateTimeFormat("es-EC", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(key + "T12:00:00Z")) : "Fecha no disponible";
}


export function attendanceLabel(status?: string) {
  return status === "attended" ? "Atención confirmada" : status === "no_show" ? "No asistió" : "Sin asistencia registrada";
}
export function appointmentEditable(appointment: AdminAppointment, now: AgendaClock) {
  return appointmentTiming(appointment, now) === "upcoming" && !["attended", "no_show"].includes(appointment.attendance || "");
}
