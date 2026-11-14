// src/api/ServiceAPI.ts

import api from "@/lib/axios";

export default {
  all() {
    return api.get("/services");
  },

  adminAll() { return api.get("/services/admin"); },

  create(data: { name: string; price: number; description?: string; photo?: string | null; active?: boolean }) {
    return api.post("/services", data);
  },

  update(id: string, data: { name: string; price: number; description?: string; photo?: string | null; active?: boolean; version?: number }) {
    return api.put(`/services/${id}`, data);
  },

  updatePromotion(id: string, promotion: import("@/helpers/promotions").Promotion | null, version: number) {
    return api.put(`/services/${id}/promotion`, { promotion, version });
  },

  delete(id: string) {
    return api.delete(`/services/${id}`);
  },
};