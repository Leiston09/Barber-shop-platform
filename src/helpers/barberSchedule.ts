export interface ScheduleBreak { startTime: string; endTime: string }
export interface ScheduleDay { day: number; isWorking: boolean; startTime: string; endTime: string; breaks: ScheduleBreak[] }
export interface BlockedDay { date: string; reason: string; partial: boolean; startTime: string; endTime: string }
export interface BarberSchedule { schedule: ScheduleDay[]; blockedDates: any[]; __v?: number }
export const weekDays = [
  { day: 1, name: "Lunes", short: "Lun" }, { day: 2, name: "Martes", short: "Mar" },
  { day: 3, name: "Miércoles", short: "Mié" }, { day: 4, name: "Jueves", short: "Jue" },
  { day: 5, name: "Viernes", short: "Vie" }, { day: 6, name: "Sábado", short: "Sáb" },
  { day: 0, name: "Domingo", short: "Dom" },
];
const mins = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3));
const validTime = (time: string) => /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time);
const interval = (start: string, end: string) => validTime(start) && validTime(end) && mins(start) < mins(end);
export function blankSchedule(schedule?: BarberSchedule | null): ScheduleDay[] {
  return weekDays.map(({ day }) => {
    const old = schedule?.schedule.find(item => item.day === day);
    return { day, isWorking: old?.isWorking ?? false, startTime: old?.startTime || "09:00",
      endTime: old?.endTime || "19:00", breaks: (old?.breaks ?? []).map(pause => ({ ...pause })) };
  });
}
export function dailySlots(day: ScheduleDay): string[] {
  if (!day.isWorking || !interval(day.startTime, day.endTime)) return [];
  const result: string[] = [];
  for (let start = mins(day.startTime); start + 60 <= mins(day.endTime); start += 60) {
    if (day.breaks.some(pause => start < mins(pause.endTime) && start + 60 > mins(pause.startTime))) continue;
    result.push(String(Math.floor(start / 60)).padStart(2, "0") + ":" + String(start % 60).padStart(2, "0"));
  }
  return result;
}
export function scheduleErrors(days: ScheduleDay[], blocks: BlockedDay[]) {
  const errors: Record<string, string> = {};
  for (const day of days.filter(day => day.isWorking)) {
    if (!interval(day.startTime, day.endTime)) { errors["day-" + day.day] = "La salida debe ser posterior a la entrada."; continue; }
    const pauses = [...day.breaks].sort((a, b) => a.startTime.localeCompare(b.startTime));
    if (pauses.some((pause, index) => !interval(pause.startTime, pause.endTime) ||
      mins(pause.startTime) < mins(day.startTime) || mins(pause.endTime) > mins(day.endTime) ||
      (index > 0 && mins(pause.startTime) < mins(pauses[index - 1]!.endTime)))) {
      errors["day-" + day.day] = "Revisa las pausas: deben estar dentro de la jornada y no superponerse.";
    } else if (!dailySlots(day).length) errors["day-" + day.day] = "Esta jornada debe dejar al menos un turno completo de 60 minutos.";
  }
  blocks.forEach((block, index) => {
    const date = new Date(block.date + "T12:00:00Z");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(block.date) || Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== block.date)
      errors["block-" + index] = "Selecciona una fecha válida.";
    else if (block.partial && !interval(block.startTime, block.endTime)) errors["block-" + index] = "El final del bloqueo debe ser posterior al inicio.";
    else if (block.reason.length > 200) errors["block-" + index] = "El motivo admite hasta 200 caracteres.";
  });
  return errors;
}

export function isBarberSchedule(value: any): value is BarberSchedule {
  if (!value || !Array.isArray(value.schedule) || value.schedule.length > 7 || !Array.isArray(value.blockedDates)) return false;
  const unique = new Set<number>();
  for (const day of value.schedule) {
    if (!day || !Number.isInteger(day.day) || day.day < 0 || day.day > 6 || unique.has(day.day) ||
      typeof day.isWorking !== "boolean" || !Array.isArray(day.breaks) ||
      (day.isWorking && !interval(day.startTime, day.endTime))) return false;
    unique.add(day.day);
    if (day.breaks.some((pause: any) => !pause || !interval(pause.startTime, pause.endTime))) return false;
  }
  return value.blockedDates.every((block: any) => block && typeof block.date === "string" &&
    /^\d{4}-\d{2}-\d{2}/.test(block.date) && !Number.isNaN(new Date(block.date).getTime()) &&
    (!(block.startTime || block.endTime) || interval(block.startTime, block.endTime)));
}
