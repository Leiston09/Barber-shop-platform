
<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-black/75 backdrop-blur-sm overflow-y-auto"
    @click.self="$emit('close')"
  >
    <div
      class="w-full max-w-2xl bg-[#0b0b0b] border border-white/10 rounded-2xl p-6 my-auto max-h-[90vh] overflow-y-auto"
    >
      <!-- ENCABEZADO -->
      <div class="flex items-start justify-between mb-6">
        <div>
          <p
            class="text-[9px] uppercase tracking-[0.3em] text-[#ffb700] font-medium mb-1"
          >
            Historial
          </p>

          <h2 class="text-xl font-barber uppercase text-white">
            {{ client.name }}
          </h2>
        </div>

        <button
          type="button"
          @click="$emit('close')"
          class="text-white/35 hover:text-white text-lg leading-none"
        >
          ✕
        </button>
      </div>

      <!-- RESUMEN -->
      <div class="grid grid-cols-2 gap-3 mb-6">
        <div
          class="bg-white/[0.02] border border-white/5 rounded-xl p-3 text-center"
        >
          <p
            class="text-[8px] uppercase tracking-[0.25em] text-white/30 mb-1"
          >
            Citas totales
          </p>

          <p class="font-barber text-lg text-white">
            {{ client.appointmentsCount }}
          </p>
        </div>

        <div
          class="bg-white/[0.02] border border-white/5 rounded-xl p-3 text-center"
        >
          <p
            class="text-[8px] uppercase tracking-[0.25em] text-white/30 mb-1"
          >
            Total invertido
          </p>

          <p class="font-barber text-lg text-[#ffb700]">
            {{ formatCurrency(client.totalSpent) }}
          </p>
        </div>
      </div>

      <!-- LISTA DEL HISTORIAL -->
      <div>
        <p
          class="text-[9px] uppercase tracking-[0.3em] text-white/35 mb-3"
        >
          Citas contigo
        </p>

        <div
          v-if="sortedAppointments.length === 0"
          class="py-10 text-center text-white/30 text-sm"
        >
          Este cliente todavía no tiene citas registradas.
        </div>

        <div
          v-else
          class="space-y-2 max-h-[50vh] overflow-y-auto pr-1"
        >
          <div
            v-for="cita in sortedAppointments"
            :key="cita._id"
            class="flex items-center justify-between border rounded-lg px-4 py-3"
            :class="statusClassOf(cita)"
          >
            <div class="min-w-0">
              <p
                class="text-xs font-barber truncate"
                :class="serviceTextClassOf(cita)"
              >
                {{ cita.services.map((s) => s.name).join(" · ") }}
              </p>

              <p
                class="text-[10px] mt-0.5"
                :class="dateTextClassOf(cita)"
              >
                {{ longDate(cita.date) }} · {{ cita.time }}
              </p>
            </div>

            <div class="text-right shrink-0 ml-3">
              <p
                class="text-xs font-barber"
                :class="priceTextClassOf(cita)"
              >
                {{ formatCurrency(cita.total) }}
              </p>

              <p
                class="text-[9px] uppercase tracking-[0.15em] mt-0.5"
                :class="statusLabelClassOf(cita)"
              >
                {{ statusLabelText(cita) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- CERRAR -->
      <div class="flex justify-end mt-6 pt-5 border-t border-white/5">
        <button
          type="button"
          @click="$emit('close')"
          class="px-4 py-2 border border-white/10 text-white/60 hover:text-white hover:border-white/25 text-[10px] uppercase tracking-[0.2em] rounded-lg transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type {
  BarberClient,
  BarberClientAppointment,
} from "@/stores/barber";
import { formatCurrency } from "@/helpers";
import { aptDateTime, longDate, appointmentKey } from "@/composables/clientHelpers";
const props = defineProps<{
  client: BarberClient;
}>();

defineEmits<{
  close: [];
}>();

const sortedAppointments = computed(() => {
  return [...(props.client.appointments ?? [])].sort(
    (a, b) => appointmentKey(b) - appointmentKey(a),
  );
});

type AppointmentStatus = "past" | "next" | "future";

const statusOf = (
  cita: BarberClientAppointment,
): AppointmentStatus => {
  const now = Date.now();
  const date = aptDateTime(cita.date, cita.time);

  if (date.getTime() < now) return "past";

  const next = sortedAppointments.value.find(
    (appointment) => appointmentKey(appointment) >= now,
  );

  if (next && next._id === cita._id) return "next";

  return "future";
};

const statusClassOf = (cita: BarberClientAppointment): string => {
  const status = statusOf(cita);

  if (status === "next") {
    return "border-emerald-500/50 bg-emerald-500/5";
  }

  if (status === "past") {
    return "border-red-500/20 bg-red-500/5";
  }

  return "border-white/5 bg-white/[0.02]";
};

const serviceTextClassOf = (cita: BarberClientAppointment): string => {
  const status = statusOf(cita);

  if (status === "past") return "text-red-400/60 line-through";
  if (status === "next") return "text-emerald-400/90";

  return "text-white/80";
};

const dateTextClassOf = (cita: BarberClientAppointment): string => {
  const status = statusOf(cita);

  if (status === "past") return "text-red-400/50 line-through";
  if (status === "next") return "text-emerald-400/70";

  return "text-white/35";
};

const priceTextClassOf = (cita: BarberClientAppointment): string => {
  const status = statusOf(cita);

  if (status === "past") return "text-red-400/60 line-through";
  if (status === "next") return "text-emerald-400";

  return "text-[#ffb700]";
};

const statusLabelClassOf = (cita: BarberClientAppointment): string => {
  const status = statusOf(cita);

  if (status === "past") return "text-red-400/60";
  if (status === "next") return "text-emerald-400";

  return "text-white/35";
};

const statusLabelText = (cita: BarberClientAppointment): string => {
  const status = statusOf(cita);

  if (status === "past") return "Pasada";
  if (status === "next") return "Próxima";

  return "Futura";
};
</script>
