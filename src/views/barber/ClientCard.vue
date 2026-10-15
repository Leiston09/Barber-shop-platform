<template>
  <article
    class="relative bg-white/[0.02] border rounded-2xl p-5 transition-all duration-300 overflow-hidden"
    :class="
      isGlobalNext
        ? 'border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.08)]'
        : 'border-white/10 hover:border-[#ffb700]/25'
    "
  >
    <span
      v-if="isGlobalNext"
      class="absolute left-0 top-5 bottom-5 w-[3px] rounded-r-full bg-emerald-500"
    />

    <div class="flex items-start gap-4 pl-3">
      <!-- AVATAR -->
      <div
        class="shrink-0 w-12 h-12 rounded-full border flex items-center justify-center"
        :class="
          isGlobalNext
            ? 'border-emerald-500/60 bg-emerald-500/10'
            : 'border-[#ffb700]/30 bg-[#ffb700]/5'
        "
      >
        <span
          class="font-barber text-lg"
          :class="isGlobalNext ? 'text-emerald-400' : 'text-[#ffb700]'"
        >
          {{ initialOf(client.name) }}
        </span>
      </div>

      <!-- INFORMACIÓN -->
      <div class="flex-1 min-w-0">
        <div class="flex flex-wrap items-center gap-2 mb-1">
          <p class="text-white/90 text-sm font-barber truncate">
            {{ client.name }}
          </p>

          <span
            :class="[
              'text-[8px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border',
              roleBadgeClass(client.role),
            ]"
          >
            {{ roleLabel(client.role) }}
          </span>

          <span
            v-if="nextAppointment"
            :class="[
              'text-[8px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border',
              chipClassOf(nextAppointment, isGlobalNext),
            ]"
          >
            {{ labelOf(nextAppointment) }}
          </span>
        </div>

        <!-- PRÓXIMA CITA -->
        <div v-if="nextAppointment" class="flex items-center gap-3 mt-2.5">
          <div
            class="shrink-0 w-12 rounded-xl border flex flex-col items-center justify-center py-1.5"
            :class="
              isGlobalNext
                ? 'border-emerald-500/50 bg-emerald-500/10'
                : 'border-white/10 bg-white/[0.02]'
            "
          >
            <span
              class="font-barber text-base leading-none"
              :class="isGlobalNext ? 'text-emerald-400' : 'text-white/70'"
            >
              {{ dayOf(nextAppointment) }}
            </span>

            <span
              class="text-[8px] uppercase tracking-[0.15em] mt-0.5"
              :class="isGlobalNext ? 'text-emerald-400/80' : 'text-white/35'"
            >
              {{ monthOf(nextAppointment) }}
            </span>
          </div>

          <div class="min-w-0">
            <p
              class="text-[8px] uppercase tracking-[0.25em] mb-0.5"
              :class="
                isGlobalNext ? 'text-emerald-400/80' : 'text-[#ffb700]/70'
              "
            >
              Próxima cita
            </p>

            <p
              class="font-barber text-lg leading-none"
              :class="isGlobalNext ? 'text-emerald-400' : 'text-white/85'"
            >
              {{ nextAppointment.time }}
            </p>

            <p class="text-white/30 text-[10px] mt-1 truncate">
              {{ weekdayOf(nextAppointment) }}
            </p>
          </div>
        </div>

        <p v-else class="text-white/25 text-[10px] mt-2 italic">
          Sin próxima cita
        </p>

        <!-- ESTADÍSTICAS -->
        <div class="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/5">
          <div>
            <p
              class="text-[8px] uppercase tracking-[0.25em] text-white/25 mb-1"
            >
              Citas totales
            </p>
            <p class="text-white/80 text-xs font-barber">
              {{ client.appointmentsCount }}
            </p>
          </div>

          <div>
            <p
              class="text-[8px] uppercase tracking-[0.25em] text-white/25 mb-1"
            >
              Total
            </p>
            <p class="text-[#ffb700] text-xs font-barber">
              {{ formatCurrency(client.totalSpent) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- ACCIÓN -->
    <div class="flex justify-end mt-5 pt-4 border-t border-white/5">
      <button
        type="button"
        @click="$emit('open-history', client)"
        class="px-3 py-2 text-[9px] uppercase tracking-[0.2em] border border-white/10 text-white/55 hover:text-white hover:border-white/25 rounded-lg transition-all duration-200"
      >
        Ver historial
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { BarberClient, BarberClientAppointment } from "@/stores/barber";
import { formatCurrency } from "@/helpers";
import {
  initialOf,
  roleBadgeClass,
  roleLabel,
  dayOf,
  monthOf,
  weekdayOf,
  labelOf,
  chipClassOf,
} from "@/composables/clientHelpers";

defineProps<{
  client: BarberClient;
  nextAppointment: BarberClientAppointment | null;
  isGlobalNext: boolean;
}>();

defineEmits<{
  "open-history": [client: BarberClient];
}>();
</script>
