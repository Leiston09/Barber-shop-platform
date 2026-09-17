import MyAppointmentsAPI from "@/api/myAppointmentsAPI";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useUserStore } from "./user";

export interface AppointmentService {
  _id: string;
  name: string;
  price: number;
}

export interface AppointmentUser {
  _id: string;
  name: string;
  email: string;
}

export interface AppointmentBarber {
  _id: string;
  name: string;
  email: string;
}

export interface MyAppointment {
  _id: string;
  services: AppointmentService[];
  date: string;
  time: string;
  totalAmount: number;
  user: AppointmentUser | null;
  barber: AppointmentBarber | null;
}

export const useMyAppointmentsStore = defineStore(
  "myAppointments",
  () => {
    const userStore = useUserStore();

    const appointments = ref<MyAppointment[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    async function getMyAppointments() {
      const userId = userStore.user?._id;

      if (!userId) {
        appointments.value = [];
        return;
      }

      loading.value = true;
      error.value = null;

      try {
        const { data } =
          await MyAppointmentsAPI.getMyAppointments(
            userId
          );

        appointments.value = data;
      } catch (err: any) {
        appointments.value = [];

        error.value =
          err?.response?.data?.msg ||
          "Error al obtener tus citas";
      } finally {
        loading.value = false;
      }
    }

    async function cancelAppointment(
      id: string,
      toast: any
    ) {
      if (!id || !toast) return;

      try {
        const { data } =
          await MyAppointmentsAPI.cancelAppointment(
            id
          );

        toast.open({
          message: data.msg,
          type: "warning",
        });

        await getMyAppointments();
      } catch (err: any) {
        toast.open({
          message:
            err?.response?.data?.msg ||
            "Error al cancelar la cita",
          type: "error",
        });
      }
    }

    const hasAppointments = computed(
      () => appointments.value.length > 0
    );

    const noAppointments = computed(
      () => appointments.value.length === 0
    );

    return {
      appointments,
      loading,
      error,
      hasAppointments,
      noAppointments,
      getMyAppointments,
      cancelAppointment,
    };
  }
);