<template>
  <section data-booking-summary aria-label="Resumen de tu reserva" :class="presentation === 'sidebar' ? 'min-w-0' : 'min-w-0 rounded-xl border border-white/10 bg-[#111111] p-4 sm:p-5'">
    <header class="mb-2 flex min-h-8 items-center justify-between gap-2">
      <h2 class="font-barber text-2xl text-white">Tu reserva</h2>
      <span class="shrink-0 rounded-full border border-white/15 bg-white/[0.03] px-2.5 py-1 text-[10px] font-medium text-white/50">Por confirmar</span>
    </header>

    <div class="flex items-start gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-[15px]">
      <svg aria-hidden="true" class="mt-0.5 size-5 shrink-0 text-white/45" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3.5" y="5.5" width="17" height="15" rx="2.5" /><path d="M7.5 3v5m9-5v5M4 11h16" />
      </svg>
      <div class="min-w-0">
        <p class="text-sm leading-relaxed text-white/75 first-letter:uppercase">{{ shortDate || 'Fecha por elegir' }}</p>
        <div class="mt-1 flex flex-wrap items-baseline gap-3">
          <strong class="text-lg font-medium tabular-nums" :class="booking.time ? 'text-[#ffb700]' : 'text-white/40'">{{ booking.time || 'Hora por elegir' }}</strong>
          <span v-if="booking.time" class="text-xs text-white/40">60 min</span>
        </div>
      </div>
    </div>

    <div class="mx-0.5 my-5 flex items-start gap-3">
      <BarberPortrait v-if="booking.barber" :id="booking.barber._id" :name="booking.barber.name" compact class="h-11! w-11 shrink-0 rounded-lg border border-white/10 sm:h-11!" />
      <span v-else aria-hidden="true" class="flex size-11 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.025]">
        <svg class="size-5 text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="8" r="3.5" /><path d="M5 21v-2a7 7 0 0 1 14 0v2" /></svg>
      </span>
      <div class="min-w-0">
        <p class="text-xs leading-relaxed text-white/45">Barbero</p>
        <p class="mt-0.5 break-words text-sm leading-relaxed" :class="booking.barber ? 'text-white/90' : 'text-white/45'">{{ booking.barber?.name || 'Elige tu profesional' }}</p>
      </div>
    </div>

    <div class="border-t border-white/10 pt-4">
      <h3 class="text-xs text-white/45">Servicios</h3>
      <ul v-if="booking.services.length" class="mt-3 space-y-3">
        <li v-for="service in booking.services" :key="service._id" class="flex justify-between gap-4 text-sm leading-relaxed">
          <span class="min-w-0 break-words text-white/80">{{ service.name }}</span>
          <span class="shrink-0 tabular-nums text-white/55">{{ formatCurrency(service.price) }}</span>
        </li>
      </ul>
      <p v-else class="mt-2 text-sm leading-relaxed text-white/40">Aún no has elegido servicios.</p>
    </div>

    <div class="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
      <div class="min-w-0">
        <p class="text-sm text-white/75">Total de tu reserva</p>
        <span class="mt-1 block text-xs leading-relaxed text-white/35">{{ booking.services.length ? 'Servicios seleccionados' : 'Se calcula al elegir servicios' }}</span>
      </div>
      <strong class="shrink-0 font-barber text-3xl font-normal tabular-nums text-[#ffb700]">{{ formatCurrency(booking.totalService) }}</strong>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAppointmentBookingStore } from "@/stores/appointmentCreator";
import { formatCurrency } from "@/helpers";
import BarberPortrait from "@/components/UI/BarberPortrait.vue";

withDefaults(defineProps<{ presentation?: "default" | "sidebar" }>(), { presentation: "default" });
const booking = useAppointmentBookingStore();
const shortDate = computed(() => booking.date
  ? new Intl.DateTimeFormat("es-EC", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(booking.date + "T12:00:00Z"))
  : "");
</script>
