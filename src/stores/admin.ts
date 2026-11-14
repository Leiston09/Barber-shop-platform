// src/stores/admin.ts

import AdminAPI from "@/api/adminAPI";
import { defineStore } from "pinia";
import { ref } from "vue";

export interface AdminService {
  _id: string;
  name: string;
  price: number;
}

export interface AdminAppointmentUser {
  _id: string;
  name: string;
  email: string;
}

export interface AdminAppointmentBarber {
  _id: string;
  name: string;
  email: string;
}

export interface AdminAppointment {
  attendance?: "pending" | "attended" | "no_show";
  attendanceVersion?: number;
  attendanceHistory?: { actorName: string; at: string; previous: string; result: string; reason: string }[];
  _id: string;
  services: AdminService[];
  date: string;
  time: string;
  totalAmount: number;
  user: AdminAppointmentUser | null;
  barber: AdminAppointmentBarber | null;
}

export interface AdminClient {
  _id: string;
  name: string;
  email: string;
  role: "client";
}

export interface UpdateAppointmentPayload {
  date: string;
  time: string;
  barber: string;
  services: string[];
  totalAmount: number;
}

export interface AdminUserAppointment {
  _id: string;
  date: string;
  time: string;
  services: string[];
  barber: string;
  total: number;
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: "client" | "barber" | "admin";
  admin: boolean;
  verified: boolean;
  blocked: boolean;
  createdAt: string;
  protected: boolean;
  appointmentsCount: number;
  futureAppointmentsCount: number;
  assignedAppointmentsCount?: number;
  assignedFutureAppointmentsCount?: number;
  selfFutureAppointmentsCount?: number;
  totalSpent: number;
  lastAppointment: string | null;
  appointments: AdminUserAppointment[];
}

export const useAdminStore = defineStore("admin", () => {
  const appointments = ref<AdminAppointment[]>([]);
  const clients = ref<AdminClient[]>([]);

  const loading = ref(false);
  const loadingClients = ref(false);

  const error = ref<string | null>(null);
  const clientsError = ref<string | null>(null);

  const users = ref<AdminUser[]>([]);
  const loadingUsers = ref(false);
  const usersError = ref<string | null>(null);

  async function getAllAppointments() {
    loading.value = true;
    error.value = null;

    try {
      const { data } = await AdminAPI.getAllAppointments();

      appointments.value = data;
    } catch (err: any) {
      appointments.value = [];

      error.value = err?.response?.data?.msg || "Error al obtener las citas";
    } finally {
      loading.value = false;
    }
  }

  async function getAppointmentById(id: string) {
    try {
      const { data } = await AdminAPI.getAppointmentById(id);
      return data as AdminAppointment;
    } catch {
      return null;
    }
  }

  async function updateAppointment(
    id: string,
    payload: UpdateAppointmentPayload,
    toast: any,
  ) {
    if (!id || !payload || !toast) return false;

    try {
      const { data: response } = await AdminAPI.updateAppointment(id, payload);

      // Refrescar la cita actualizada en el array local
      const fresh = await getAppointmentById(id);

      if (fresh) {
        const index = appointments.value.findIndex((a) => a._id === id);

        if (index !== -1) {
          appointments.value[index] = fresh;
        }
      }

      toast.open({
        message: response.msg,
        type: "success",
      });

      return true;
    } catch (err: any) {
      toast.open({
        message: err?.response?.data?.msg || "Error al actualizar la cita",
        type: "error",
      });

      return false;
    }
  }

  async function deleteAppointment(id: string, toast: any) {
    if (!id || !toast) return false;

    try {
      const { data: response } = await AdminAPI.deleteAppointment(id);

      // Quitar del array local (reactividad automática)
      appointments.value = appointments.value.filter((a) => a._id !== id);

      toast.open({
        message: response.msg,
        type: "warning",
      });

      return true;
    } catch (err: any) {
      toast.open({
        message: err?.response?.data?.msg || "Error al eliminar la cita",
        type: "error",
      });

      return false;
    }
  }

  async function getClients() {
    loadingClients.value = true;
    clientsError.value = null;

    try {
      const { data } = await AdminAPI.getClients();

      clients.value = data;
    } catch (err: any) {
      clients.value = [];

      clientsError.value =
        err?.response?.data?.msg || "Error al obtener los clientes";
    } finally {
      loadingClients.value = false;
    }
  }

  async function getAllUsers() {
    loadingUsers.value = true;
    usersError.value = null;

    try {
      const { data } = await AdminAPI.getAllUsers();
      users.value = data;
    } catch (err: any) {
      users.value = [];
      usersError.value =
        err?.response?.data?.msg || "Error al obtener los usuarios";
    } finally {
      loadingUsers.value = false;
    }
  }

  async function updateUserRole(
    id: string,
    role: "client" | "barber" | "admin",
    toast: any,
  ) {
    try {
      const { data } = await AdminAPI.updateUserRole(id, role);

      // Actualizar localmente
      const idx = users.value.findIndex((u) => u._id === id);
      if (idx !== -1) {
        users.value[idx] = {
          ...users.value[idx]!,
          role,
          admin: role === "admin",
        };
      }

      toast.open({ message: data.msg, type: "success" });
      return true;
    } catch (err: any) {
      toast.open({
        message: err?.response?.data?.msg || "Error al cambiar el rol",
        type: "error",
      });
      return false;
    }
  }

  async function updateUserBlockStatus(
    id: string,
    blocked: boolean,
    toast: any,
  ) {
    try {
      const { data } = await AdminAPI.updateUserBlockStatus(id, blocked);

      // Volver a consultar los resultados reales; el bloqueo conserva el historial.
      appointments.value = [];
      await getAllUsers();

      toast.open({ message: data.msg, type: "success" });
      return true;
    } catch (err: any) {
      toast.open({
        message: err?.response?.data?.msg || "Error al actualizar el estado",
        type: "error",
      });
      return false;
    }
  }

  async function deleteUser(id: string, toast: any) {
    try {
      const { data } = await AdminAPI.deleteUser(id);

      // Quitar del array local
      users.value = users.value.filter((u) => u._id !== id);

      toast.open({ message: data.msg, type: "warning" });
      return true;
    } catch (err: any) {
      toast.open({
        message: err?.response?.data?.msg || "Error al eliminar el usuario",
        type: "error",
      });
      return false;
    }
  }

  function clearPrivateData() {
    appointments.value = [];
    clients.value = [];
    users.value = [];
    error.value = null;
    clientsError.value = null;
    usersError.value = null;
  }

  return {
    clearPrivateData,
    appointments,
    clients,

    loading,
    loadingClients,

    error,
    clientsError,

    getAllAppointments,
    getAppointmentById,
    updateAppointment,
    deleteAppointment,
    getClients,

    users,
    loadingUsers,
    usersError,
    getAllUsers,
    updateUserRole,
    updateUserBlockStatus,
    deleteUser,
  };
});
