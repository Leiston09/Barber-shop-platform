<template>
  <div>
    <!-- ENCABEZADO -->
    <div class="text-center mb-8 sm:mb-12">
      <div class="inline-flex items-center gap-3 mb-4 sm:mb-5">
        <span
          class="text-[#ffb700] text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-medium"
        >
          Paso 03
        </span>
        <span class="w-8 h-px bg-[#ffb700]/40" />
        <span
          class="text-white/30 text-[10px] sm:text-[11px] uppercase tracking-[0.3em]"
        >
          Resumen
        </span>
      </div>

      <h1
        class="font-barber text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-white leading-[0.95]"
      >
        Detalles y
        <span class="text-[#ffb700]"> resumen.</span>
      </h1>

      <p
        class="text-white/40 text-xs sm:text-sm font-light mt-3 sm:mt-4 max-w-md mx-auto leading-relaxed"
      >
        Verifica la información de tu cita antes de confirmar.
      </p>
    </div>

    <!-- SERVICIOS + BARBERO -->
    <div
      v-if="!appointmentBooking.noServiceSelect"
      class="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-5 sm:gap-6 lg:gap-8 mb-6 sm:mb-8"
    >
      <!-- SERVICIOS -->
      <section
        class="border border-white/5 rounded-2xl bg-white/[0.02] p-5 sm:p-6 lg:p-7"
      >
        <div class="flex items-center justify-between mb-5 sm:mb-6">
          <div>
            <p
              class="text-[9px] uppercase tracking-[0.3em] text-[#ffb700] font-medium"
            >
              Tu reservación
            </p>
            <h2
              class="font-barber text-xl sm:text-2xl text-white font-light mt-1.5 sm:mt-2"
            >
              Servicios
            </h2>
          </div>
          <span
            class="text-white/20 text-[9px] uppercase tracking-[0.2em]"
          >
            {{ appointmentBooking.services.length }} seleccionados
          </span>
        </div>

        <div class="grid gap-2.5 sm:gap-3">
          <SelectService
            v-for="service in appointmentBooking.services"
            :key="service._id"
            :service="service"
          />
        </div>

        <div
          class="flex items-center justify-between gap-4 mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-white/5"
        >
          <span
            class="text-[9px] uppercase tracking-[0.3em] text-white/35 font-medium"
          >
            Total
          </span>
          <span
            class="font-barber text-xl sm:text-2xl text-[#ffb700] font-medium"
          >
            {{ formatCurrency(appointmentBooking.totalService) }}
          </span>
        </div>
      </section>

      <!-- BARBERO -->
      <section
        v-if="appointmentBooking.barber"
        class="relative min-h-[240px] sm:min-h-[300px] lg:min-h-[340px] rounded-2xl overflow-hidden border border-[#ffb700]/25 group"
      >
        <img
          :src="`/img/barbers/barber${selectedBarberIndex + 1}.jpg`"
          :alt="appointmentBooking.barber.name"
          class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent"
        />
        <div
          class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ffb700] to-transparent"
        />

        <div class="absolute inset-x-0 bottom-0 p-5 sm:p-6 lg:p-7">
          <div class="flex items-end justify-between gap-4">
            <div>
              <p
                class="text-[#ffb700] text-[8px] uppercase tracking-[0.35em] font-medium mb-2"
              >
                Profesional
              </p>
              <h2
                class="font-barber text-2xl sm:text-3xl lg:text-4xl text-white font-light leading-none"
              >
                {{ appointmentBooking.barber.name }}
              </h2>
              <p class="text-white/45 text-xs mt-2 sm:mt-3 font-light">
                Tu barbero seleccionado
              </p>
            </div>
            <div
              class="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-full border border-[#ffb700] bg-[#ffb700] text-black flex items-center justify-center text-sm"
            >
              ✓
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- SIN HORARIO (cuando el barbero no tiene horario configurado) -->
    <div
      v-if="!appointmentBooking.noServiceSelect && appointmentBooking.noSchedule"
      class="border border-amber-500/20 rounded-2xl bg-amber-500/[0.04] p-8 sm:p-12 text-center mb-6 sm:mb-8"
    >
      <div
        class="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full border border-amber-500/30 bg-amber-500/5 flex items-center justify-center mb-4"
      >
        <svg
          class="w-6 h-6 sm:w-7 sm:h-7 text-amber-400/70"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <p class="text-amber-400/90 text-sm sm:text-base font-barber">
        Este profesional aún no tiene horario configurado
      </p>

      <p class="text-white/35 text-xs mt-2 max-w-sm mx-auto leading-relaxed">
        Elige otro barbero para continuar con tu reserva, o vuelve a intentarlo
        más tarde.
      </p>

      <RouterLink
        :to="{ name: 'BarberSelect' }"
        class="inline-block mt-6 px-6 py-3 bg-[#ffb700] text-black text-[10px] font-barber uppercase tracking-[0.2em] rounded-lg hover:bg-[#e6a500] transition-all duration-300"
      >
        Elegir otro barbero
      </RouterLink>
    </div>

    <!-- FECHA + HORARIOS (solo si el barbero SÍ tiene horario) -->
    <div
      v-else-if="!appointmentBooking.noServiceSelect"
      class="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-5 sm:gap-6 lg:gap-8 mb-6 sm:mb-8"
    >
      <!-- FECHA -->
      <section
        class="border border-white/5 rounded-2xl bg-white/[0.02] p-5 sm:p-6"
      >
        <div class="mb-4 sm:mb-5">
          <p
            class="text-[9px] uppercase tracking-[0.3em] text-[#ffb700] font-medium"
          >
            Fecha
          </p>
          <h2
            class="font-barber text-xl sm:text-2xl text-white font-light mt-1.5 sm:mt-2"
          >
            Elige tu día
          </h2>
        </div>

        <!-- LEYENDA -->
        <div
          v-if="appointmentBooking.barberSchedule"
          class="flex items-center gap-4 mb-4 text-[8px] uppercase tracking-[0.18em]"
        >
          <div class="flex items-center gap-2 text-white/45">
            <span class="w-2 h-2 rounded-full bg-[#ffb700]" />
            <span>Bloqueado</span>
          </div>
          <div class="flex items-center gap-2 text-white/45">
            <span class="w-2 h-2 rounded-full bg-red-500/70" />
            <span>Con reservas</span>
          </div>
        </div>

        <div class="w-full rounded-xl overflow-hidden flex justify-center">
          <VueDatePicker
            v-model="appointmentBooking.date"
            :disabled-dates="disabledDates"
            :day-class="dayClass"
            :time-config="{ enableTimePicker: false }"
            model-type="yyyy-MM-dd"
            format="dd/MM/yyyy"
            :month-change-on-scroll="false"
            :prevent-min-max-navigation="true"
            auto-apply
            dark
            :locale="es"
            :min-date="minDate"
            :max-date="maxDate"
            :teleport="false"
            inline
          />
        </div>
      </section>

      <!-- HORARIOS -->
      <section
        class="border border-white/5 rounded-2xl bg-white/[0.02] p-5 sm:p-6"
      >
        <div
          class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4 mb-5 sm:mb-6"
        >
          <div>
            <p
              class="text-[9px] uppercase tracking-[0.3em] text-[#ffb700] font-medium"
            >
              Horarios
            </p>
            <h2
              class="font-barber text-xl sm:text-2xl text-white font-light mt-1.5 sm:mt-2"
            >
              Disponibilidad
            </h2>
          </div>

          <div
            v-if="appointmentBooking.isDateSelect"
            class="flex items-center gap-4 text-[8px] uppercase tracking-[0.18em]"
          >
            <div class="flex items-center gap-2 text-white/50">
              <span class="w-2 h-2 rounded-full bg-[#ffb700]" />
              <span>{{ appointmentBooking.availableHours.length }} libres</span>
            </div>

            <div class="flex items-center gap-2 text-white/25">
              <span class="w-2 h-2 rounded-full bg-white/15" />
              <span
                >{{ appointmentBooking.occupiedHours.length }} ocupados</span
              >
            </div>
          </div>
        </div>

        <!-- SIN FECHA -->
        <div
          v-if="!appointmentBooking.isDateSelect"
          class="min-h-[200px] sm:min-h-[250px] flex items-center justify-center border border-white/5 rounded-xl bg-black/10"
        >
          <div class="text-center">
            <p
              class="text-white/30 text-[10px] uppercase tracking-[0.25em]"
            >
              Selecciona una fecha
            </p>
            <p class="text-white/15 text-xs mt-2 font-light">
              Los horarios aparecerán aquí
            </p>
          </div>
        </div>

        <!-- LOADING -->
        <div
          v-else-if="
            appointmentBooking.loadingHours ||
            appointmentBooking.loadingSchedule
          "
          class="min-h-[200px] sm:min-h-[250px] flex flex-col items-center justify-center"
        >
          <div
            class="w-7 h-7 border-2 border-white/10 border-t-[#ffb700] rounded-full animate-spin"
          />
          <p
            class="text-white/30 text-[9px] uppercase tracking-[0.3em] mt-4"
          >
            Cargando horarios...
          </p>
        </div>

        <!-- DÍA NO LABORABLE O BLOQUEADO -->
        <div
          v-else-if="
            !appointmentBooking.isDayWorking(appointmentBooking.date) ||
            appointmentBooking.isDateFullyBlocked(appointmentBooking.date)
          "
          class="min-h-[200px] sm:min-h-[250px] flex items-center justify-center border border-white/5 rounded-xl bg-black/10 text-center px-6"
        >
          <div>
            <p class="text-white/40 text-sm font-light">
              Este día no está disponible.
            </p>
            <p class="text-white/20 text-xs mt-2">Prueba con otra fecha</p>
          </div>
        </div>

        <!-- TODAS OCUPADAS -->
        <div
          v-else-if="appointmentBooking.allHoursOccupied"
          class="min-h-[200px] sm:min-h-[250px] flex items-center justify-center border border-white/5 rounded-xl bg-black/10 text-center"
        >
          <div>
            <p class="text-white/40 text-sm font-light">
              No hay horarios disponibles
            </p>
            <p class="text-white/20 text-xs mt-2">Prueba con otra fecha</p>
          </div>
        </div>

        <!-- HORARIOS -->
        <div
          v-else
          class="grid grid-cols-3 sm:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-3"
        >
          <button
            v-for="hour in appointmentBooking.hours"
            :key="hour"
            type="button"
            class="relative py-3 sm:py-4 text-xs sm:text-sm font-barber uppercase tracking-[0.1em] border rounded-lg transition-all duration-300 cursor-pointer"
            :class="{
              'bg-[#ffb700] text-black border-[#ffb700] shadow-lg shadow-[#ffb700]/20':
                appointmentBooking.time === hour,

              'bg-white/[0.02] text-white/15 border-white/5 cursor-not-allowed line-through':
                appointmentBooking.isHourOccupied(hour) &&
                appointmentBooking.time !== hour,

              'bg-amber-500/[0.03] text-amber-400/40 border-amber-500/15 cursor-not-allowed line-through':
                appointmentBooking.isHourBlocked(hour) &&
                !appointmentBooking.isHourOccupied(hour) &&
                appointmentBooking.time !== hour,

              'bg-transparent text-white/60 border-white/10 hover:text-white hover:border-[#ffb700]/50 hover:bg-[#ffb700]/5':
                !appointmentBooking.isHourUnavailable(hour) &&
                appointmentBooking.time !== hour,
            }"
            @click="appointmentBooking.time = hour"
            :disabled="appointmentBooking.isHourUnavailable(hour)"
          >
            {{ hour }}

            <span
              v-if="appointmentBooking.isHourOccupied(hour)"
              class="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500/50"
            />
            <span
              v-else-if="appointmentBooking.isHourBlocked(hour)"
              class="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-400/60"
            />
          </button>
        </div>
      </section>
    </div>

    <!-- NAVEGACIÓN FINAL -->
    <div
      v-if="!appointmentBooking.noServiceSelect"
      class="flex flex-col-reverse sm:flex-row justify-between items-center gap-3 sm:gap-4 pt-6 mt-6 sm:mt-10 border-t border-white/5"
    >
      <RouterLink
        :to="{ name: 'New-appointments' }"
        class="w-full sm:w-auto text-center text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-[#ffb700] transition py-3"
      >
        ← Volver a servicios
      </RouterLink>

      <button
        type="button"
        :disabled="!appointmentBooking.validateReservation"
        @click="handleSave"
        class="w-full sm:w-auto text-center px-6 sm:px-8 py-4 bg-[#ffb700] text-black text-xs sm:text-sm font-barber font-medium uppercase tracking-[0.15em] rounded-lg hover:bg-[#e6a500] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#ffb700]/20 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none"
      >
        Confirmar Reservación
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { VueDatePicker } from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import SelectService from "@/components/UI/SelectService.vue";
import { formatCurrency } from "@/helpers";
import { useAppointmentBookingStore } from "@/stores/appointmentCreator";
import { useBarberStore } from "@/stores/barber";
import { useToast } from "vue-toast-notification";
import { es } from "date-fns/locale";

const appointmentBooking = useAppointmentBookingStore();
const barberStore = useBarberStore();
const toast = useToast();

const minDate = new Date();

const maxDate = computed(() => {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  return date;
});

const selectedBarberIndex = computed(() => {
  const index = barberStore.barbers.findIndex(
    (barber) => barber._id === appointmentBooking.barber?._id,
  );
  return index >= 0 ? index : 0;
});

/* =========================================================
   FECHA → CLAVE
   ========================================================= */
const dateKeyOf = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

/* =========================================================
   DESHABILITAR DÍAS
   ========================================================= */
const disabledDates = (date: Date) => {
  return appointmentBooking.isDateDisabled(date);
};

/* =========================================================
   CLASE POR DÍA
   ========================================================= */
const dayClass = (date: Date): string => {
  if (!appointmentBooking.barberSchedule) return "";

  const key = dateKeyOf(date);

  const isBlocked = appointmentBooking.barberSchedule.blockedDates.some(
    (b) => {
      const bKey = typeof b.date === "string" ? b.date.slice(0, 10) : "";
      return bKey === key;
    },
  );

  if (isBlocked) return "day-dot-yellow";

  return "";
};

const handleSave = () => {
  appointmentBooking.saveAppointment(toast);
};

onMounted(() => {
  if (barberStore.barbers.length === 0) {
    barberStore.getBarbers();
  }
});
</script>

<style scoped>
/* =========================================================
   ESTILOS VUE DATEPICKER (sin cambios)
   ========================================================= */
:deep(.dp__theme_dark) {
  --dp-background-color: #0a0a0a;
  --dp-text-color: rgba(255, 255, 255, 0.8);
  --dp-hover-color: rgba(255, 183, 0, 0.08);
  --dp-hover-text-color: #ffffff;
  --dp-hover-icon-color: #ffb700;
  --dp-primary-color: #ffb700;
  --dp-primary-text-color: #000000;
  --dp-secondary-color: rgba(255, 255, 255, 0.25);
  --dp-border-color: rgba(255, 255, 255, 0.08);
  --dp-menu-border-color: rgba(255, 255, 255, 0.08);
  --dp-border-color-hover: rgba(255, 183, 0, 0.5);
  --dp-disabled-color: rgba(255, 255, 255, 0.12);
  --dp-disabled-color-text: rgba(255, 255, 255, 0.15);
  --dp-icon-color: rgba(255, 255, 255, 0.4);
  --dp-calendar-header-color: rgba(255, 255, 255, 0.7);
  --dp-month-year-menu-color: #0a0a0a;
  --dp-menu-min-width: 100%;
}

:deep(.dp__main) {
  width: 100%;
}

:deep(.dp__menu) {
  width: 100%;
  border: none;
  background: transparent;
  position: static !important;
}

:deep(.dp__outer_menu_wrap) {
  width: 100%;
}

:deep(.dp__calendar_header) {
  color: rgba(255, 255, 255, 0.35);
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

:deep(.dp__calendar_header_item) {
  color: rgba(255, 255, 255, 0.3);
}

:deep(.dp__cell_inner) {
  border-radius: 8px;
  transition: all 0.2s ease;
}

:deep(.dp__today) {
  border: 1px solid rgba(255, 183, 0, 0.5);
}

:deep(.dp__active_date) {
  background: #ffb700;
  color: #000000;
}

:deep(.dp__range_start),
:deep(.dp__range_end) {
  background: #ffb700;
  color: #000000;
}

:deep(.dp__month_year_select) {
  color: rgba(255, 255, 255, 0.85);
}

:deep(.dp__inner_nav:hover) {
  background: rgba(255, 183, 0, 0.1);
}

:deep(.dp__action_row) {
  display: none;
}

/* PUNTO AMARILLO */
:deep(.day-dot-yellow .dp__cell_inner) {
  position: relative;
}

:deep(.day-dot-yellow .dp__cell_inner::after) {
  content: "";
  position: absolute;
  bottom: 3px;
  left: 50%;
  transform: translateX(-50%);
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #ffb700;
  box-shadow: 0 0 6px rgba(255, 183, 0, 0.6);
}

/* PUNTO ROJO (pendiente) */
:deep(.day-dot-red .dp__cell_inner) {
  position: relative;
}

:deep(.day-dot-red .dp__cell_inner::after) {
  content: "";
  position: absolute;
  bottom: 3px;
  left: 50%;
  transform: translateX(-50%);
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.8);
  box-shadow: 0 0 6px rgba(239, 68, 68, 0.5);
}
</style>