import type { AdminUser } from "@/stores/admin";
import { normalizeAgendaSearch } from "./adminAgenda";

export type UserRole = AdminUser["role"];
export interface UserFilters { search: string; role: "" | UserRole; status: string; activity: string; order: string }
export function accountStatus(user: Pick<AdminUser, "blocked" | "verified">) {
  return user.blocked ? "blocked" : user.verified ? "active" : "pending";
}
export const roleLabel = (role: string) => role === "admin" ? "Administrador" : role === "barber" ? "Barbero" : "Cliente";
export const statusLabel = (user: Pick<AdminUser, "blocked" | "verified">) =>
  ({ blocked: "Bloqueado", active: "Habilitado", pending: "Correo pendiente" })[accountStatus(user)];
export function canManageAccount(user: AdminUser, actorId?: string) {
  return !!actorId && user._id !== actorId && !user.protected;
}
export function canDeleteAccount(user: AdminUser, actorId?: string) {
  return canManageAccount(user, actorId) && user.appointmentsCount === 0 && (user.assignedAppointmentsCount ?? 0) === 0;
}
export function affectedReservations(user: AdminUser) {
  return Math.max(0, user.futureAppointmentsCount + (user.assignedFutureAppointmentsCount ?? 0) - (user.selfFutureAppointmentsCount ?? 0));
}
export function filterAdminUsers(users: readonly AdminUser[], filters: UserFilters) {
  const text = normalizeAgendaSearch(filters.search.trim());
  return users.filter(user => {
    if (filters.role && user.role !== filters.role) return false;
    if (filters.status && accountStatus(user) !== filters.status) return false;
    if (filters.activity === "upcoming" && !user.futureAppointmentsCount) return false;
    if (filters.activity === "history" && !user.appointmentsCount) return false;
    if (filters.activity === "none" && user.appointmentsCount) return false;
    return !text || normalizeAgendaSearch(user.name + " " + user.email + " " + user._id).includes(text);
  }).sort((a, b) => {
    if (filters.order === "name") return a.name.localeCompare(b.name, "es");
    if (filters.order === "reservations") return b.appointmentsCount - a.appointmentsCount || a.name.localeCompare(b.name, "es");
    const first = Date.parse(a.createdAt), second = Date.parse(b.createdAt);
    return (Number.isFinite(second) ? second : 0) - (Number.isFinite(first) ? first : 0) || a._id.localeCompare(b._id);
  });
}
export function validAdminUsers(data: unknown): data is AdminUser[] {
  return Array.isArray(data) && data.every(user => user && typeof user._id === "string" && /^[a-f\d]{24}$/i.test(user._id) &&
    typeof user.name === "string" && typeof user.email === "string" && ["client", "barber", "admin"].includes(user.role) &&
    typeof user.verified === "boolean" && typeof user.blocked === "boolean" && typeof user.protected === "boolean" &&
    [user.appointmentsCount, user.futureAppointmentsCount, user.totalSpent].every(value => typeof value === "number" && Number.isFinite(value) && value >= 0) &&
    [user.assignedAppointmentsCount, user.assignedFutureAppointmentsCount, user.selfFutureAppointmentsCount].every(value => value === undefined || typeof value === "number" && Number.isFinite(value) && value >= 0));
}
export function registrationDate(value: string, full = false) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Fecha no disponible";
  return new Intl.DateTimeFormat("es-EC", { day: "numeric", month: full ? "long" : "short", year: "numeric", timeZone: "America/Guayaquil" }).format(date);
}
