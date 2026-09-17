import api from "@/lib/axios";

export default {
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

  delete(id: string) {
    return api.delete(`/appointments/${id}`);
  },
};