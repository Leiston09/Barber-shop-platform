import axios from "axios";

export interface BusinessDayHours {
  day: number;
  isWorking: boolean;
  startTime: string | null;
  endTime: string | null;
}

// This public endpoint does not need or send a session token.
const publicAPI = axios.create({ baseURL: import.meta.env.VITE_API_URL, timeout: 15000 });
const validTime = (value: unknown): value is string =>
  typeof value === "string" && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value);

export async function getBusinessHours(signal: AbortSignal): Promise<BusinessDayHours[]> {
  const { data } = await publicAPI.get("/barbers/business-hours", { signal });
  const days = data?.days;
  if (!Array.isArray(days) || days.length !== 7 ||
    days.some((item, day) => !item || item.day !== day || typeof item.isWorking !== "boolean" ||
      (item.isWorking ? !validTime(item.startTime) || !validTime(item.endTime) || item.startTime >= item.endTime
        : item.startTime !== null || item.endTime !== null))) {
    throw new Error("Horario general no válido");
  }
  return days;
}
