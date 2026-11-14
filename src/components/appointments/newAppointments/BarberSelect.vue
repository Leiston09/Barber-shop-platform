<template>
  <section aria-labelledby="barber-title" class="space-y-5">
    <header>
      <p class="mb-2 text-xs text-[#c4a760]">Paso {{ preferred ? 1 : 2 }} de 4 · Tu profesional</p>
      <h2 id="barber-title" class="font-barber text-2xl leading-tight sm:text-3xl">Elige quién <span class="text-[#ffb700]">te atiende.</span></h2>
      <p class="mt-3 max-w-2xl text-sm leading-6 text-white/55">{{ preferred ? 'Elige a tu barbero y después consulta sus fechas y horas disponibles.' : 'Estos profesionales tienen libre el turno elegido. Selecciona uno para continuar con los servicios.' }}</p>
    </header>
    <p v-if="loading" role="status" class="rounded-xl border border-white/10 p-5 text-sm text-white/55">Consultando los profesionales…</p>
    <div v-else-if="error" role="alert" class="rounded-xl border border-rose-300/25 p-5 text-sm text-rose-200">
      <p>{{ error }}</p><button type="button" @click="refresh" class="mt-2 min-h-11 text-[#ffb700]">Reintentar</button>
    </div>
    <div v-else-if="!visibleBarbers.length" class="rounded-xl border border-white/10 p-5 text-sm leading-6 text-white/55">
      <p>{{ preferred ? 'No hay barberos habilitados para reservar en este momento.' : 'Este turno ya no tiene barberos disponibles. Prueba otra hora; tus servicios se conservan.' }}</p>
      <RouterLink v-if="!preferred" :to="{ name: 'AppointmentSlot' }" class="mt-2 inline-flex min-h-11 items-center text-[#ffb700]">Buscar otro turno</RouterLink>
    </div>

    <div v-else data-barber-grid class="grid grid-cols-2 gap-3 md:grid-cols-4">
      <button v-for="person in visibleBarbers" :key="person._id" type="button" @click="choose(person)"
        :aria-pressed="booking.barber?._id === person._id" :aria-label="'Elegir a ' + person.name"
        class="group min-w-0 overflow-hidden rounded-2xl border border-white/15 bg-[#131313] text-left transition-[border-color,box-shadow] duration-300 hover:border-[#ffb700]/50 hover:shadow-[0_12px_28px_#00000030] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffb700] motion-reduce:transition-none"
        :class="booking.barber?._id === person._id ? 'border-[#ffb700]' : ''">
        <div class="relative aspect-[3/4] overflow-hidden bg-neutral-900">
          <BarberPortrait :id="person._id" :name="person.name" :revision="person.photoUpdatedAt" compact
            class="absolute inset-0 h-full! w-full transition-transform duration-500 group-hover:scale-[1.035] group-focus-visible:scale-[1.035] motion-reduce:transform-none motion-reduce:transition-none sm:h-full!" />
          <div aria-hidden="true" class="pointer-events-none absolute inset-0 bg-linear-to-t from-black/95 via-black/10 to-transparent"></div>
          <span v-if="booking.barber?._id === person._id" aria-hidden="true" class="absolute right-2.5 top-2.5 flex size-6 items-center justify-center rounded-full bg-[#ffb700] text-black">
            <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 4 4L19 6" /></svg>
          </span>
          <div class="absolute inset-x-0 bottom-0 p-3 sm:p-3.5">
            <h3 :title="person.name" class="line-clamp-2 break-words font-barber text-base leading-snug text-white sm:text-lg">{{ person.name }}</h3>
            <p v-if="ratings[person._id]?.count" :aria-label="ratings[person._id]!.average + ' de 5, ' + ratings[person._id]!.count + ' valoraciones'" class="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] leading-4 text-white/80">
              <svg aria-hidden="true" class="size-3 shrink-0 text-[#ffb700]" viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z" /></svg>
              <span>{{ ratings[person._id]!.average.toLocaleString('es-EC', { maximumFractionDigits: 1 }) }} / 5</span><span class="text-white/50">({{ ratings[person._id]!.count }})</span>
            </p>
            <p v-else class="mt-2 text-[11px] leading-4 text-white/50">{{ ratingsError ? 'Valoración no disponible' : 'Sin valoraciones' }}</p>
          </div>
        </div>
        <div class="p-2">
          <span data-barber-action class="relative isolate flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-lg border border-white/15 px-2 text-center text-xs font-medium text-white/85 transition-colors duration-300 group-hover:border-[#ffb700] group-hover:text-black group-focus-visible:border-[#ffb700] group-focus-visible:text-black motion-reduce:transition-none">
            <span data-action-fill aria-hidden="true" class="absolute inset-0 -z-10 -translate-y-full bg-[#ffb700] transition-transform duration-300 ease-out group-hover:translate-y-0 group-focus-visible:translate-y-0 motion-reduce:transition-none"></span>
            <svg aria-hidden="true" class="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <template v-if="preferred"><rect x="4" y="5" width="16" height="16" rx="2" /><path d="M8 3v4m8-4v4M4 10h16M9 14h6m-6 3h3" /></template>
              <template v-else><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></template>
            </svg>
            <span>{{ preferred ? 'Ver horarios' : 'Elegir barbero' }}</span>
          </span>
        </div>
      </button>
    </div>

    <div v-if="!preferred && booking.date && booking.time" class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 p-4 text-sm">
      <p class="text-white/65">{{ displayDate(booking.date) }} · <strong class="font-medium text-[#ffb700]">{{ booking.time }}</strong> · 60 minutos</p>
      <RouterLink :to="{ name: 'AppointmentSlot' }" class="inline-flex min-h-11 items-center text-xs text-[#ffb700]">Cambiar turno</RouterLink>
    </div>
    <p v-if="preferred" class="text-xs leading-5 text-white/45">La disponibilidad se comprueba al elegir la fecha. Un profesional sin turnos libres no permitirá confirmar una reserva.</p>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import BarberAPI from "@/api/barberAPI";
import type { Barber } from "@/stores/barber";
import BarberPortrait from "@/components/UI/BarberPortrait.vue";
import { displayDate } from "@/helpers/date";
import { useAppointmentBookingStore } from "@/stores/appointmentCreator";
const booking = useAppointmentBookingStore(), router = useRouter();
const allBarbers = ref<Barber[]>([]), ratings = ref<Record<string, { average: number; count: number }>>({}), loading = ref(false), error = ref(""), ratingsError = ref(false);
let serial = 0, ratingSequence = 0;
const preferred = computed(() => booking.bookingMode === "barber");
const visibleBarbers = computed(() => preferred.value ? allBarbers.value : booking.availableBarbers.map(item => ({ ...allBarbers.value.find(person => person._id === item._id), ...item })));
async function refresh() {
  const request = ++serial; loading.value = true; error.value = "";
  try {
    const [barbers] = await Promise.all([BarberAPI.getBarbers(), preferred.value ? Promise.resolve() : booking.loadGlobalAvailability(booking.date)]);
    if (request !== serial) return;
    allBarbers.value = barbers.data;
    if (!preferred.value && booking.globalError) throw new Error();
  } catch { if (request === serial) error.value = "No pudimos consultar los barberos disponibles. Vuelve a intentarlo."; }
  finally { if (request === serial) loading.value = false; }
  await loadRatings();
}
async function loadRatings() {
  const request = ++ratingSequence;
  try { const { data } = await BarberAPI.getRatings(); if (request === ratingSequence) { ratings.value = Object.fromEntries(data.map(item => [item._id, item])); ratingsError.value = false; } }
  catch { if (request === ratingSequence) ratingsError.value = true; }
}
function choose(person: { _id: string; name: string }) {
  if (preferred.value) { booking.selectPreferredBarber(person); void router.push({ name: "AppointmentSlot" }); }
  else if (booking.selectBarber(person._id)) void router.push({ name: "New-appointments" });
}
onMounted(() => { void refresh(); window.addEventListener("appsalon:rating-saved", loadRatings); });
onBeforeUnmount(() => { serial++; ratingSequence++; window.removeEventListener("appsalon:rating-saved", loadRatings); });
</script>
