import api from "@/lib/axios";

export default {
  getMyAppointments(userId: string) {
    return api.get(
      `/users/${userId}/appointments`
    );
  },

  cancelAppointment(id: string) {
    return api.delete(`/appointments/${id}`);
  },
};