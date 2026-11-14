import api from "@/lib/axios";

export default {
  availability(date: string, appointment?: string, barber?: string) {
    return api.get("/appointments/availability", { params: { date, appointment, barber } });
  },
  calendarAvailability(date: string, endDate: string, barber?: string, appointment?: string) {
    return api.get("/appointments/availability", { params: { date, endDate, barber, appointment } });
  },
  create(data: any) {
    return api.post("/appointments", data);
  },

  getByDate(date: string, barber: string) {
    return api.get(
      `/appointments?date=${encodeURIComponent(
        date
      )}&barber=${encodeURIComponent(barber)}`
    );
  },

  getById(id: string) {
    return api.get(`/appointments/${id}`);
  },

  update(id: string, data: any) {
    return api.put(`/appointments/${id}`, data);
  },
};