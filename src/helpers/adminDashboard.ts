import type { AdminAppointment } from "@/stores/admin";

export type DashboardPeriod = 7 | 30 | 90;
export interface ActivityBucket {
  start: string;
  end: string;
  count: number;
  amount: number;
  revenue: number;
}
export interface RankedActivity {
  id: string;
  name: string;
  count: number;
}

const DAY = 86400000;
const validTime = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
export function shiftDay(key: string, offset: number): string {
  return new Date(Date.parse(key + "T12:00:00Z") + offset * DAY).toISOString().slice(0, 10);
}
function calendarKey(value: string): string {
  const key = value.slice(0, 10);
  const parsed = new Date(key + "T12:00:00Z");
  return /^\d{4}-\d{2}-\d{2}$/.test(key) && !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === key ? key : "";
}
function cents(value: number): number {
  return Number.isFinite(value) && value >= 0 ? Math.round(value * 100) : 0;
}

export function buildDashboardSummary(appointments: readonly AdminAppointment[], period: DashboardPeriod, now = new Date(), activeBarbers?: readonly { _id: string; name: string }[]) {
  const today = new Intl.DateTimeFormat("sv-SE", { timeZone: "America/Guayaquil" }).format(now);
  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: "America/Guayaquil", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).format(now);
  const start = shiftDay(today, 1 - period);
  const previousStart = shiftDay(start, -period);
  const records = appointments.map(appointment => ({ appointment, key: calendarKey(appointment.date) }))
    .filter(item => item.key && validTime.test(item.appointment.time));
  const current = records.filter(item => item.key >= start && item.key <= today);
  const previousCount = records.filter(item => item.key >= previousStart && item.key < start).length;
  const totalCents = current.reduce((total, item) => total + cents(item.appointment.totalAmount), 0);
  const clientIds = new Set(current.flatMap(item => item.appointment.user?._id ? [String(item.appointment.user._id)] : []));
  const groupSize = period === 7 ? 1 : period === 30 ? 3 : 7;
  const buckets: ActivityBucket[] = [];
  for (let offset = 0; offset < period; offset += groupSize) {
    buckets.push({ start: shiftDay(start, offset), end: shiftDay(start, Math.min(period - 1, offset + groupSize - 1)), count: 0, amount: 0, revenue: 0 });
  }
  const daily = new Map<string, { count: number; cents: number }>();
  const services = new Map<string, RankedActivity>();
  const professionals = new Map<string, RankedActivity>((activeBarbers ?? []).map(barber => [barber._id, { id: barber._id, name: barber.name, count: 0 }]));
  for (const { appointment, key } of current) {
    const point = daily.get(key) ?? { count: 0, cents: 0 };
    point.count++;
    point.cents += cents(appointment.totalAmount);
    daily.set(key, point);
    const seen = new Set<string>();
    for (const service of appointment.services ?? []) {
      if (!service?._id || seen.has(String(service._id))) continue;
      const id = String(service._id);
      seen.add(id);
      const item = services.get(id) ?? { id, name: service.name || "Servicio no disponible", count: 0 };
      item.count++;
      services.set(id, item);
    }
    const id = appointment.barber?._id ? String(appointment.barber._id) : "unassigned";
    const item = professionals.get(id) ?? { id, name: appointment.barber?.name || "Profesional no disponible", count: 0 };
    item.count++;
    if (!activeBarbers || activeBarbers.some(barber => barber._id === id)) professionals.set(id, item);
  }
  for (const bucket of buckets) {
    let amountCents = 0;
    for (let key = bucket.start; key <= bucket.end; key = shiftDay(key, 1)) {
      const point = daily.get(key);
      bucket.count += point?.count ?? 0;
      amountCents += point?.cents ?? 0;
    }
    bucket.amount = amountCents / 100;
    bucket.revenue = current.filter(item => item.key >= bucket.start && item.key <= bucket.end && item.appointment.attendance === "attended").reduce((sum, item) => sum + cents(item.appointment.totalAmount), 0) / 100;
  }
  const rank = (map: Map<string, RankedActivity>) => [...map.values()]
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "es")).slice(0, 5);
  const upcoming = records.filter(item => item.key > today || (item.key === today && item.appointment.time >= time))
    .sort((a, b) => (a.key + a.appointment.time).localeCompare(b.key + b.appointment.time));
  return {
    today, start, end: today, groupSize, buckets,
    count: current.length, previousCount, countChange: current.length - previousCount,
    attended: current.filter(item => item.appointment.attendance === "attended").length,
    noShows: current.filter(item => item.appointment.attendance === "no_show").length,
    pendingAttendance: current.filter(item => item.appointment.attendance !== "attended" && item.appointment.attendance !== "no_show" &&
      (item.key < today || item.key === today && Number(item.appointment.time.slice(0, 2)) * 60 + Number(item.appointment.time.slice(3)) + 60 <= Number(time.slice(0, 2)) * 60 + Number(time.slice(3)))).length,
    revenue: current.filter(item => item.appointment.attendance === "attended").reduce((sum, item) => sum + cents(item.appointment.totalAmount), 0) / 100,
    amount: totalCents / 100,
    average: current.length ? Math.round(totalCents / current.length) / 100 : 0,
    clients: clientIds.size,
    services: rank(services), professionals: [...professionals.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "es")),
    todayCount: records.filter(item => item.key === today).length,
    todayUpcoming: upcoming.filter(item => item.key === today).length,
    nextAppointment: upcoming[0]?.appointment ?? null,
  };
}
