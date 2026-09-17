// src/api/barberAPI.ts

import api from "@/lib/axios";

export default {
  getBarbers() {
    return api.get("/barbers");
  },

  getSchedule(barberId: string) {
    return api.get(`/barbers/${barberId}`);
  },

  createSchedule(barberId: string, data: any) {
    return api.post(`/barbers/${barberId}`, data);
  },

  updateSchedule(barberId: string, data: any) {
    return api.put(`/barbers/${barberId}`, data);
  },

  deleteSchedule(barberId: string) {
    return api.delete(`/barbers/${barberId}`);
  },
};