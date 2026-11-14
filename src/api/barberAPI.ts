// src/api/barberAPI.ts

import api from "@/lib/axios";

export default {
  getRatings() { return api.get<{ _id: string; average: number; count: number }[]>("/barbers/ratings"); },
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

  updateProfile(barberId: string, name: string) {
    return api.patch(`/barbers/${barberId}/profile`, { name });
  },
  uploadPhoto(barberId: string, photo: string) {
    return api.put(`/barbers/${barberId}/photo`, { photo });
  },
  removePhoto(barberId: string) { return api.delete(`/barbers/${barberId}/photo`); },

  getMyClients() {
    return api.get("/barbers/me/clients");
  },
};