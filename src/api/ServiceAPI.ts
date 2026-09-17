// src/api/ServiceAPI.ts

import api from "@/lib/axios";

export default {
  all() {
    return api.get("/services");
  },

  getById(id: string) {
    return api.get(`/services/${id}`);
  },

  create(data: { name: string; price: number }) {
    return api.post("/services", data);
  },

  update(id: string, data: { name: string; price: number }) {
    return api.put(`/services/${id}`, data);
  },

  delete(id: string) {
    return api.delete(`/services/${id}`);
  },
};