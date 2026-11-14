import type { PanelAppointment, Performance } from "@/api/BarberPanelAPI";
import { agendaClock, appointmentTiming } from "@/helpers/adminAgenda";
export const panelMoney = (amount: number) => new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" }).format(amount);
export const panelDate = (date: string) => new Intl.DateTimeFormat("es-EC", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(date.slice(0, 10) + "T12:00:00Z"));
export function appointmentLabel(item: PanelAppointment) {
  if (item.attendance === "attended") return "Asistencia confirmada";
  if (item.attendance === "no_show") return "No asistió";
  const timing = appointmentTiming(item, agendaClock());
  return timing === "upcoming" ? "Próxima reserva" : timing === "current" ? "Turno en curso" : "Sin asistencia registrada";
}
export function attendanceDraft(items: PanelAppointment[]) {
  return Object.fromEntries(items.map(item => [item._id, item.attendance !== "no_show"]));
}
export function attendancePayload(items: PanelAppointment[], draft: Record<string, boolean>) {
  return items.filter(item => item.canRecord).map(item => ({ appointment: item._id, attended: draft[item._id] === true }));
}
export function chartDays(data: Performance) {
  const result: Performance["series"] = [];
  const cursor = new Date(data.from + "T12:00:00Z");
  while (cursor.toISOString().slice(0, 10) <= data.to) {
    const key = cursor.toISOString().slice(0, 10);
    result.push(data.series.find(item => item.date === key) ?? { date: key, attended: 0, noShows: 0, revenue: 0 });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return result;
}
export function movePeriod(reference: string, period: "week" | "month", direction: number) {
  const date = new Date(reference + "T12:00:00Z");
  if (period === "month") { date.setUTCDate(1); date.setUTCMonth(date.getUTCMonth() + direction); }
  else date.setUTCDate(date.getUTCDate() + direction * 7);
  return date.toISOString().slice(0, 10);
}
