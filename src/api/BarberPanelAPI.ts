import api from "@/lib/axios";
export type AttendanceState = "pending" | "attended" | "no_show";
export interface PanelAppointment {
  _id: string; date: string; time: string; totalAmount: number;
  user: { _id?: string; name: string }; services: { _id: string; name: string }[];
  attendance: AttendanceState; canRecord?: boolean;
}
export interface TodayResponse { date: string; time: string; revision: string; savedAt: string | null; items: PanelAppointment[] }
export interface AppointmentPage { items: PanelAppointment[]; total: number; page: number; pageSize: number }
export interface ClientActivity {
  client: { _id?: string; name: string }; page: number; pageSize: number; items: PanelAppointment[];
  summary: { reservations: number; attended: number; noShows: number; pending: number; spent: number };
}
export interface Performance {
  period: "week" | "month"; from: string; to: string;
  summary: { clients: number; attended: number; upcoming: number; noShows: number; services: number; revenue: number; pending: number };
  series: { date: string; attended: number; noShows: number; revenue: number }[];
  services: { _id: string; name: string; count: number }[];
}
export default {
  today: () => api.get<TodayResponse>("/barbers/me/today"),
  saveToday: (data: { date: string; revision: string; entries: { appointment: string; attended: boolean }[] }) => api.put("/barbers/me/today", data),
  appointments: (params: { view: string; page: number; search: string }) => api.get<AppointmentPage>("/barbers/me/appointments", { params }),
  activity: (id: string, page: number) => api.get<ClientActivity>("/barbers/me/clients/" + id + "/activity", { params: { page } }),
  performance: (params: { period: string; reference: string }) => api.get<Performance>("/barbers/me/performance", { params }),
};
