// src/api/adminAPI.ts

import api from "@/lib/axios";

export default {
  correctAttendance(id: string, data: { attendance: string; reason: string; version: number }) {
    return api.patch("/appointments/" + id + "/attendance", data);
  },
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

  getAvailability(date: string, barber: string, appointment: string, signal?: AbortSignal) {
    return api.get("/appointments/availability", { params: { date, barber, appointment }, signal });
  },

  // ==================== USUARIOS ====================
  getClients() {
    return api.get("/auth/clients");
  },

  getAllUsers() {
    return api.get("/auth/users");
  },

  getUserActivity(id: string, page = 1, signal?: AbortSignal) {
    return api.get(`/auth/users/${id}/activity`, { params: { page }, signal });
  },

  updateUserRole(id: string, role: string) {
    return api.patch(`/auth/users/${id}/role`, { role });
  },

  updateUserBlockStatus(id: string, blocked: boolean, expectedFutureCount?: number) {
    return api.patch(`/auth/users/${id}/block`, { blocked, expectedFutureCount });
  },

  deleteUser(id: string) {
  return api.delete(`/auth/users/${id}`);
},
};