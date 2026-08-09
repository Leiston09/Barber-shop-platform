import { defineStore } from "pinia";
import { computed, inject, onMounted, ref, watch } from "vue";
import AppointmentsAPI from "@/api/AppointmentsAPI";
import { converToDDMMYYYY, convertToISO } from "@/helpers/date";
import { useRouter } from "vue-router";
import { useUserStore } from "./user";

export const useAppoimentStore = defineStore("appoiment", () => {
  type typeService = {
    _id: string;
    name: string;
    price: number;
  };

  const appointmentId = ref("");
  const services = ref<typeService[]>([]);
  const date = ref<string>("");
  const hours = ref<string[]>([]);
  const time = ref<string>("");
  const toast: any = inject("toast");
  const router = useRouter();
  const appoimentsByDate = ref([]);
  const user = useUserStore();

  onMounted(() => {
    const starHour: number = 10;
    const endHours: number = 19;
    for (let hour: number = starHour; hour <= endHours; hour++) {
      hours.value.push(hour + ":00");
    }
  });

  function onServiceSelect(service: typeService) {
    if (services.value.some((Selection) => Selection._id === service._id)) {
      services.value = services.value.filter(
        (Selection) => Selection._id !== service._id,
      );
    } else {
      if (services.value.length === 2) {
        alert("MAXIMO DE CITAS 2");
        return;
      }
      services.value.push(service);
    }
  }

  const isServiceSelected = computed(() => {
    return (id: string) =>
      services.value.some((Selection) => Selection._id === id);
  });

  const deleteService = (id: string) => {
    services.value = services.value.filter((s) => s._id !== id);
  };

  const totalService = computed(() => {
    return services.value.reduce((total, service) => total + service.price, 0);
  });
  const noServiceSelect = computed(() => {
    return services.value.length === 0;
  });

  const validateReservations = computed(() => {
    return time.value && date.value && services.value.length !== 0;
  });

  async function saveAppointment() {
    const appoiment = {
      services: services.value.map((services) => services._id),
      date: convertToISO(date.value),
      time: time.value,
      totalAmount: totalService.value,
    };

    if (appointmentId.value) {
      try {
        const { data } = await AppointmentsAPI.update(
          appointmentId.value,
          appoiment,
        );

        toast.open({
          message: data.msg,
          type: "success",
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const { data } = await AppointmentsAPI.create(appoiment);

        toast.open({
          message: data.msg,
          type: "success",
        });
      } catch (error) {
        console.log(error);
      }
    }

    clearAppointmentsData();
    user.getUserAppointments();
    router.push({ name: "My-appoiments" });
  }

  function clearAppointmentsData() {
    appointmentId.value = "";
    services.value = [];
    date.value = "";
    time.value = "";
  }
  async function cancelAppointments(id) {
    if (confirm("Deseas eliminar esta cita?")) {
      try {
        const { data } = await AppointmentsAPI.delete(id);

        toast.open({
          message: data.msg,
          type: "success",
        });
        user.userAppointments = user.userAppointments.filter(appointment => appointment._id !== id)
      } catch (error) {
        toast.open({
          message: error.response.data.msg,
          type: "error",
        });
      }
    }
  }

  const isDateSelect = computed(() => {
    return date.value ? true : false;
  });

  watch(date, async () => {
    time.value = "";
    if (date.value === "") return;
    const { data } = await AppointmentsAPI.getByDate(date.value);
    if (appointmentId.value) {
      appoimentsByDate.value = data.filter(
        (appointment) => appointment._id !== appointmentId.value,
      );
      time.value = data.filter(
        (appointment) => appointment._id === appointmentId.value,
      )[0].time;
    } else {
      appoimentsByDate.value = data;
    }
  });
  const disableTime = computed(() => {
    return (hour) => {
      return appoimentsByDate.value.find(
        (appointments) => appointments.time === hour,
      );
    };
  });
  function setSelectedAppointments(appointment) {
    services.value = appointment.services;
    date.value = converToDDMMYYYY(appointment.date);
    time.value = appointment.time;
    appointmentId.value = appointment._id;
  }
  return {
    saveAppointment,
    onServiceSelect,
    isServiceSelected,
    setSelectedAppointments,
    deleteService,
    totalService,
    noServiceSelect,
    date,
    hours,
    time,
    validateReservations,
    isDateSelect,
    disableTime,
    services,
    clearAppointmentsData,
    cancelAppointments,
  };
});
