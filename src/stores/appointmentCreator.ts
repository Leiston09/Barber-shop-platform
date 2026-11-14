// src/stores/appointmentBooking.ts

import { useSettingsStore } from "./settings";
import { useServiceStore } from "./service";
import AppointmentsAPI from "@/api/AppointmentsAPI";
import BarberAPI from "@/api/barberAPI";
import { convertToDatePicker } from "@/helpers/date";
import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useMyAppointmentsStore } from "./myAppointments";

interface Service {
  _id: string;
  name: string;
  price: number;
}

interface Barber {
  _id: string;
  name: string;
  email?: string;
}

interface Appointment {
  _id: string;
  services: Service[];
  date: string;
  time: string;
  totalAmount: number;
  barber: Barber | null;
}

interface ScheduleBreak {
  startTime: string;
  endTime: string;
}

interface ScheduleDay {
  day: number;
  isWorking: boolean;
  startTime?: string;
  endTime?: string;
  breaks: ScheduleBreak[];
}

interface BlockedDate {
  date: string;
  startTime?: string;
  endTime?: string;
  reason?: string;
}

interface BarberSchedule {
  _id: string;
  barber: string;
  schedule: ScheduleDay[];
  blockedDates: BlockedDate[];
}

/* =========================================================
   HELPERS DE FECHA / TIEMPO
   ========================================================= */

/**
 * Convierte una fecha local (Date) a "yyyy-MM-dd".
 * Se usa para fechas de citas y para fechas calculadas localmente.
 */
const toKey = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

/**
 * Convierte una fecha "pura" (sin hora) a "yyyy-MM-dd".
 * - Si viene como string ISO ("2026-09-09T00:00:00.000Z") → corta los primeros 10 chars.
 * - Si viene como Date → usa local (raro, pero por seguridad).
 *
 * Esto evita el bug de zona horaria con blockedDates: MongoDB los guarda
 * a las 00:00 UTC, y en zonas como Ecuador (UTC-5) `new Date()` los
 * desplazaría al día anterior.
 */
const toDateOnly = (raw: string | Date): string => {
  if (typeof raw === "string") {
    return raw.slice(0, 10); // "2026-09-18T00:00:00.000Z" → "2026-09-18"
  }
  const y = raw.getFullYear();
  const m = String(raw.getMonth() + 1).padStart(2, "0");
  const d = String(raw.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

/**
 * Devuelve el índice de día (0 = domingo, 6 = sábado) a partir de "yyyy-MM-dd".
 */
const dateKeyToDay = (dateKey: string): number => {
  const parts = dateKey.split("-").map(Number);
  const y = parts[0] ?? 0;
  const m = parts[1] ?? 1;
  const d = parts[2] ?? 1;
  const date = new Date(y, m - 1, d);
  return date.getDay();
};

/**
 * "HH:mm" → minutos desde las 00:00.
 */
const timeToMinutes = (t: string): number => {
  const parts = t.split(":").map(Number);
  const h = parts[0] ?? 0;
  const m = parts[1] ?? 0;
  return h * 60 + m;
};

/**
 * Minutos desde las 00:00 → "HH:mm".
 */
const minutesToTime = (m: number): string => {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
};

/* =========================================================
   STORE
   ========================================================= */
export const useAppointmentBookingStore = defineStore(
  "appointmentBooking",
  () => {
    const router = useRouter();
    const settings = useSettingsStore();
    const myAppointmentsStore = useMyAppointmentsStore();

    const bookingMode = ref<"time" | "barber">("time");
    const appointmentId = ref("");
    const barber = ref<Barber | null>(null);
    const services = ref<Service[]>([]);
    const date = ref("");
    const time = ref("");

    const appointmentsByDate = ref<Appointment[]>([]);
    const saving = ref(false);
    const saveError = ref("");
    const globalDate = ref("");
    const globalSlots = ref<{ time: string; endTime: string; barbers: Barber[] }[]>([]);
    const globalLoading = ref(false);
    const globalError = ref("");
    let globalRequest = 0;
    const availableBarbers = computed(() => globalDate.value === date.value
      ? globalSlots.value.find(slot => slot.time === time.value)?.barbers ?? [] : []);
    const clock = ref(Date.now());
    const refreshClock = () => { clock.value = Date.now(); };
    const today = () => new Intl.DateTimeFormat("sv-SE", { timeZone: "America/Guayaquil" }).format(new Date(clock.value));
    const currentTime = () => new Intl.DateTimeFormat("en-GB", { timeZone: "America/Guayaquil", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date(clock.value));
    async function loadGlobalAvailability(selectedDate = globalDate.value || today()) {
      const request = ++globalRequest;
      const preferredId = bookingMode.value === "barber" ? barber.value?._id : undefined;
      globalDate.value = selectedDate;
      globalLoading.value = true;
      globalError.value = "";
      globalSlots.value = [];
      if (bookingMode.value === "barber" && !preferredId) { globalLoading.value = false; globalError.value = "Elige primero a tu barbero para consultar su horario."; return; }
      try {
        const { data } = await AppointmentsAPI.availability(selectedDate, undefined, preferredId);
        if (request !== globalRequest) return;
        globalSlots.value = data.slots;
      } catch {
        if (request === globalRequest) globalError.value = "No pudimos consultar los horarios. Reintenta antes de elegir un turno.";
      } finally { if (request === globalRequest) globalLoading.value = false; }
    }
    function selectSlot(hour: string) {
      refreshClock();
      if (globalDate.value < today() || (globalDate.value === today() && hour <= currentTime())) {
        void loadGlobalAvailability();
        return false;
      }
      const slot = globalSlots.value.find(item => item.time === hour);
      if (globalLoading.value || globalError.value || !slot?.barbers.length) return false;
      if (bookingMode.value === "barber" && !slot.barbers.some(item => item._id === barber.value?._id)) return false;
      const keepBarber = (bookingMode.value === "barber" || (date.value === globalDate.value && time.value === hour)) && slot.barbers.some(item => item._id === barber.value?._id);
      if (!keepBarber) barber.value = null;
      date.value = globalDate.value;
      time.value = hour;
      saveError.value = "";
      return true;
    }
    function setBookingMode(mode: "time" | "barber") {
      if (bookingMode.value === mode || saving.value) return;
      bookingMode.value = mode; globalRequest++; globalSlots.value = []; globalDate.value = ""; globalLoading.value = false; globalError.value = "";
      barber.value = null; date.value = ""; time.value = ""; saveError.value = "";
    }
    function selectPreferredBarber(person: { _id: string; name: string }) {
      if (bookingMode.value !== "barber" || saving.value) return;
      if (barber.value?._id !== person._id) {
        globalRequest++; globalSlots.value = []; globalDate.value = ""; globalLoading.value = false; globalError.value = "";
        barber.value = person; date.value = ""; time.value = ""; saveError.value = "";
      }
    }
    function selectBarber(id: string) {
      const selected = availableBarbers.value.find(item => item._id === id);
      if (!selected || globalLoading.value || globalError.value) return false;
      barber.value = selected;
      return true;
    }


    const loadingHours = ref(false);
    const availabilityError = ref("");
    let scheduleRequest = 0;
    let hoursRequest = 0;
    const barberSchedule = ref<BarberSchedule | null>(null);
    const loadingSchedule = ref(false);

    /* =========================================================
       SERVICIOS
       ========================================================= */
    function onServiceSelect(service: Service) {
      if (services.value.some((item) => item._id === service._id)) {
        deleteService(service._id);
        return;
      }

      if (services.value.length >= settings.maxServicesPerAppointment) return;

      services.value.push(service);
    }

    function deleteService(id: string) {
      services.value = services.value.filter((service) => service._id !== id);
    }

    const isServiceSelected = computed(() => {
      return (id: string) =>
        services.value.some((service) => service._id === id);
    });

    const totalService = computed(() =>
      services.value.reduce((total, service) => total + service.price, 0),
    );

    const noServiceSelect = computed(() => services.value.length === 0);

    /* =========================================================
       SCHEDULE DEL BARBERO
       ========================================================= */

    /**
     * ¿El barbero tiene horario configurado?
     */
    const noSchedule = computed(
      () => !loadingSchedule.value && !barberSchedule.value,
    );

    /**
     * Carga el schedule del barbero actual.
     */
    async function loadBarberSchedule() {
      if (!barber.value?._id) {
        barberSchedule.value = null;
        return;
      }

      const requestId = ++scheduleRequest;
      const barberId = barber.value._id;
      loadingSchedule.value = true;
      availabilityError.value = "";

      try {
        const { data } = await BarberAPI.getSchedule(barberId);
        if (requestId === scheduleRequest && barber.value?._id === barberId) barberSchedule.value = data as BarberSchedule;
      } catch {
        if (requestId === scheduleRequest) {
          barberSchedule.value = null;
          availabilityError.value = "No pudimos cargar la agenda de este barbero. Reintenta para continuar.";
        }
      } finally {
        if (requestId === scheduleRequest) loadingSchedule.value = false;
      }
    }

    /**
     * Devuelve el día del schedule que corresponde a una fecha.
     */
    const scheduleDayFor = (dateKey: string): ScheduleDay | null => {
      if (!barberSchedule.value || !dateKey) return null;

      const dayIndex = dateKeyToDay(dateKey);

      return (
        barberSchedule.value.schedule.find((d) => d.day === dayIndex) || null
      );
    };

    /**
     * ¿La fecha es un día laborable según el schedule?
     */
    const isDayWorking = (dateKey: string): boolean => {
      const day = scheduleDayFor(dateKey);
      return Boolean(day?.isWorking);
    };

    /**
     * ¿La fecha está bloqueada por completo (blockedDate sin horas)?
     */
    const isDateFullyBlocked = (dateKey: string): boolean => {
      if (!barberSchedule.value) return false;

      return barberSchedule.value.blockedDates.some((b) => {
        const bKey = toDateOnly(b.date);
        const hasHours = Boolean(b.startTime || b.endTime);
        return bKey === dateKey && !hasHours;
      });
    };

    /**
     * Devuelve los bloqueos parciales (con horas) para una fecha.
     */
    const partialBlocksFor = (dateKey: string): BlockedDate[] => {
      if (!barberSchedule.value) return [];

      return barberSchedule.value.blockedDates.filter((b) => {
        const bKey = toDateOnly(b.date);
        const hasHours = Boolean(b.startTime && b.endTime);
        return bKey === dateKey && hasHours;
      });
    };

    /**
     * ¿La fecha está deshabilitada en el calendario del cliente?
     */
    const isDateDisabled = (d: Date): boolean => {
      if (!barberSchedule.value) return false; // sin horario, permitimos todo (pero mostramos aviso)

      const key = toKey(d);
      const todayKey = today();

      // No permitir fechas pasadas
      if (key < todayKey) return true;

      // Día no laborable
      if (!isDayWorking(key)) return true;

      // Bloqueo total
      if (isDateFullyBlocked(key)) return true;

      return false;
    };

    /* =========================================================
       HORAS
       ========================================================= */

    /**
     * Genera las horas disponibles base para una fecha según el schedule.
     */
    const generateHoursForDate = (dateKey: string): string[] => {
      if (!dateKey || !barberSchedule.value) return [];

      const day = scheduleDayFor(dateKey);

      if (!day?.isWorking || !day.startTime || !day.endTime) return [];

      const start = timeToMinutes(day.startTime);
      const end = timeToMinutes(day.endTime);

      const result: string[] = [];

      for (let m = start; m + 60 <= end; m += 60) {
        result.push(minutesToTime(m));
      }

      return result;
    };

    /**
     * Horas del día (computed, cambia según la fecha elegida).
     */
    const hours = computed(() => generateHoursForDate(date.value));

    /**
     * Horas bloqueadas por el admin para una fecha (pausas + bloqueos parciales).
     */
    const blockedHours = computed(() => {
      const day = scheduleDayFor(date.value);
      const intervals = [...(day?.breaks ?? []), ...partialBlocksFor(date.value)];
      return hours.value.filter(hour => {
        const start = timeToMinutes(hour);
        return intervals.some(p => start < timeToMinutes(p.endTime!) &&
          start + 60 > timeToMinutes(p.startTime!));
      });
    });

    const isHourBlocked = computed(() => {
      return (hour: string) => blockedHours.value.includes(hour);
    });

    /* =========================================================
       HORAS OCUPADAS (citas de otros clientes)
       ========================================================= */
    const occupiedHours = computed(() =>
      appointmentsByDate.value
        .filter((appointment) => appointment._id !== appointmentId.value)
        .map((appointment) => appointment.time),
    );

    const isHourOccupied = computed(() => {
      return (hour: string) => occupiedHours.value.includes(hour);
    });

    /**
     * ¿La hora ya no está disponible (ocupada o bloqueada)?
     * Excepción: si es la hora actual de la cita en edición, se considera válida.
     */
    const isHourUnavailable = computed(() => {
      return (hour: string) => {
        if (availabilityError.value || loadingHours.value || loadingSchedule.value) return true;
        if (isDateFullyBlocked(date.value)) return true;
        if (date.value < today() || (date.value === today() && hour <= currentTime())) return true;
        if (
          appointmentId.value &&
          appointmentsByDate.value.some(
            (a) => a._id === appointmentId.value && a.time === hour,
          )
        ) {
          return false;
        }

        const start = timeToMinutes(hour);
        return occupiedHours.value.some(value => start < timeToMinutes(value) + 60 && start + 60 > timeToMinutes(value)) || isHourBlocked.value(hour);
      };
    });

    const availableHours = computed(() =>
      hours.value.filter((h) => !isHourUnavailable.value(h)),
    );

    const allHoursOccupied = computed(
      () => hours.value.length > 0 && availableHours.value.length === 0,
    );

    watch([loadingHours, loadingSchedule, availableHours], () => {
      if (barber.value && date.value && time.value && !loadingHours.value && !loadingSchedule.value &&
          !availabilityError.value && !availableHours.value.includes(time.value)) {
        time.value = "";
        saveError.value = "El turno elegido ya no está disponible. Tus servicios se conservan; selecciona otra hora para este barbero.";
      }
    }, { flush: "post" });
    const isDateSelect = computed(() => Boolean(date.value));

    const validateReservation = computed(() =>
      Boolean(
        !availabilityError.value && !loadingHours.value && !loadingSchedule.value &&
          hours.value.includes(time.value) && !isHourUnavailable.value(time.value) &&
          barber.value &&
          date.value &&
          time.value &&
          services.value.length > 0 && services.value.length <= settings.maxServicesPerAppointment &&
          barberSchedule.value &&
          isDayWorking(date.value) &&
          !isDateFullyBlocked(date.value),
      ),
    );

    /* =========================================================
       CARGA DE DATOS
       ========================================================= */
    async function loadHoursByDate(selectedDate: string) {
      if (!selectedDate || !barber.value?._id) {
        appointmentsByDate.value = [];
        return;
      }

      const requestId = ++hoursRequest;
      const barberId = barber.value._id;
      availabilityError.value = "";
      loadingHours.value = true;

      try {
        const { data } = await AppointmentsAPI.getByDate(
          selectedDate,
          barberId,
        );
        if (requestId !== hoursRequest || barber.value?._id !== barberId || date.value !== selectedDate) return;

        appointmentsByDate.value = data;

        if (appointmentId.value) {
          const currentAppointment = data.find(
            (appointment: Appointment) =>
              appointment._id === appointmentId.value,
          );

          if (currentAppointment) {
            time.value = currentAppointment.time;
          }
        }
      } catch {
        if (requestId === hoursRequest) {
          appointmentsByDate.value = [];
          availabilityError.value = "No se pudo consultar la disponibilidad. Selecciona de nuevo la fecha.";
        }
      } finally {
        if (requestId === hoursRequest) loadingHours.value = false;
      }
    }

    /* =========================================================
       WATCH
       ========================================================= */
    // Cuando cambia el barbero, cargar su schedule
    watch(barber, async (newBarber) => {
      scheduleRequest++;
      barberSchedule.value = null;
      if (newBarber?._id) {
        await loadBarberSchedule();
      }
    });

    // Cuando cambia fecha o barbero, cargar las horas ocupadas
    watch([date, barber], async ([newDate, newBarber]) => {
      if (!newDate || !newBarber?._id) {
        hoursRequest++;
        loadingHours.value = false;
        appointmentsByDate.value = [];
        return;
      }

      await loadHoursByDate(newDate);
    });

    /* =========================================================
       GUARDAR / EDITAR
       ========================================================= */
    async function saveAppointment(toast: any) {
      if (saving.value) return;
      if (
        !toast || !validateReservation.value ||
        !barber.value?._id ||
        !date.value ||
        !time.value ||
        services.value.length === 0
      ) {
        return;
      }

      saving.value = true;
      saveError.value = "";
      if (!await settings.load() || services.value.length > settings.maxServicesPerAppointment) {
        saveError.value = settings.error || "El límite de servicios cambió. Revisa tu selección antes de confirmar.";
        toast.open({ message: saveError.value, type: "error" }); saving.value = false; return;
      }
      const appointment = {
        expectedPrices: services.value.map(service => ({ service: service._id, price: service.price })),
        services: services.value.map((service) => service._id),
        date: date.value,
        time: time.value,
        totalAmount: totalService.value,
        barber: barber.value._id,
      };

      try {
        if (appointmentId.value) {
          const { data } = await AppointmentsAPI.update(
            appointmentId.value,
            appointment,
          );

          toast.open({
            message: data.msg,
            type: "success",
          });
        } else {
          const { data } = await AppointmentsAPI.create(appointment);

          toast.open({
            message: data.msg,
            type: "success",
          });
        }

        clearAppointmentData();

        await myAppointmentsStore.getMyAppointments();

        saving.value = false;
        await router.push({
          name: "My-appointments",
        });
      } catch (error: any) {
        saveError.value = error?.response?.data?.msg || "No pudimos confirmar tu reserva. Revisa la conexión y vuelve a intentarlo.";
        if (error?.response?.data?.code === "SERVICE_LIMIT_CHANGED") await settings.load();
        if (error?.response?.data?.code === "PRICE_CHANGED") await useServiceStore().loadServices(true);
        if (error?.response?.status === 409) {
          time.value = "";
          saveError.value = "Ese turno acaba de ser reservado. Tus servicios se conservan; elige otra hora para este barbero.";
          await Promise.all([loadBarberSchedule(), loadHoursByDate(date.value)]);
        }
        toast.open({ message: saveError.value, type: "error" });
      } finally { saving.value = false; }
    }

    function clearAppointmentData() {
      bookingMode.value = "time";
      globalRequest++;
      globalSlots.value = [];
      globalDate.value = "";
      globalError.value = "";
      globalLoading.value = false;
      saveError.value = "";
      scheduleRequest++;
      hoursRequest++;
      loadingHours.value = false;
      loadingSchedule.value = false;
      availabilityError.value = "";
      appointmentId.value = "";
      barber.value = null;
      services.value = [];
      date.value = "";
      time.value = "";
      appointmentsByDate.value = [];
      barberSchedule.value = null;
    }

    function setSelectedAppointment(appointment: Appointment) {
      if (!appointment) return;

      appointmentId.value = appointment._id;

      barber.value = appointment.barber || null;

      services.value = appointment.services || [];

      date.value = convertToDatePicker(appointment.date);

      time.value = appointment.time || "";
    }

    return {
      bookingMode, setBookingMode, selectPreferredBarber,
      saving, saveError, refreshClock, today, globalDate, globalSlots, globalLoading, globalError,
      availableBarbers, loadGlobalAvailability, selectSlot, selectBarber,
      appointmentId,
      barber,
      services,
      date,
      time,
      hours,
      appointmentsByDate,
      loadingHours,
      availabilityError,

      // schedule
      barberSchedule,
      loadingSchedule,
      noSchedule,
      isDateDisabled,
      isDayWorking,
      isDateFullyBlocked,
      loadBarberSchedule,

      // servicios
      isServiceSelected,
      totalService,
      noServiceSelect,

      // validaciones
      validateReservation,
      isDateSelect,

      // horas
      occupiedHours,
      availableHours,
      isHourOccupied,
      isHourBlocked,
      isHourUnavailable,
      blockedHours,
      allHoursOccupied,

      // acciones
      onServiceSelect,
      deleteService,
      loadHoursByDate,
      saveAppointment,
      clearAppointmentData,
      setSelectedAppointment,
    };
  },
);