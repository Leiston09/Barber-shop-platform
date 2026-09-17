// src/api/adminAPI.ts

import api from "@/lib/axios";

export default {
  // ==================== CITAS ====================
  getAllAppointments() {
    return api.get("/appointments/admin");
  },

  getAppointmentById(id: string) {
    return api.get(`/appointments/${id}`);
  },

  updateAppointment(id: string, data: any) {
    return api.put(`/appointments/${id}`, data);
  },

  deleteAppointment(id: string) {
    return api.delete(`/appointments/${id}`);
  },

  getOccupiedTimes(date: string, barber: string) {
    return api.get(
      `/appointments?date=${encodeURIComponent(
        date,
      )}&barber=${encodeURIComponent(barber)}`,
    );
  },

  // ==================== USUARIOS ====================
  getClients() {
    return api.get("/auth/clients");
  },

  getAllUsers() {
    return api.get("/auth/users");
  },

  updateUserRole(id: string, role: string) {
    return api.patch(`/auth/users/${id}/role`, { role });
  },

  updateUserBlockStatus(id: string, blocked: boolean) {
    return api.patch(`/auth/users/${id}/block`, { blocked });
  },
};