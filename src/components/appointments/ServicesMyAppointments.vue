<template>
  <section aria-labelledby="my-appointments-title" :aria-busy="appointments.loading">
    <header class="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 id="my-appointments-title" class="font-barber text-2xl text-white sm:text-3xl">Tus próximas visitas</h2>
        <p class="mt-2 max-w-xl text-sm leading-6 text-white/55">Consulta los detalles de tus reservas y ajusta tu cita cuando lo necesites.</p>
      </div>
      <p v-if="!appointments.loading && !appointments.error && !appointments.noAppointments" class="pb-1 text-xs tabular-nums text-white/50">
        {{ appointments.appointments.length }} {{ appointments.appointments.length === 1 ? "cita en tu agenda" : "citas en tu agenda" }}
      </p>
    </header>

    <div v-if="appointments.loading" role="status">
      <p class="sr-only">Cargando tus citas</p>
      <div aria-hidden="true" class="grid gap-4 lg:grid-cols-2">
        <div v-for="index in 2" :key="index" class="rounded-2xl border border-white/10 bg-neutral-900/50 p-5 motion-safe:animate-pulse">
          <div class="flex items-center gap-4">
            <div class="h-16 w-14 rounded-xl bg-white/10" />
            <div class="space-y-3"><div class="h-4 w-28 rounded bg-white/10" /><div class="h-3 w-40 rounded bg-white/5" /></div>
          </div>
          <div class="mt-6 h-12 rounded-lg bg-white/5" />
          <div class="mt-5 h-16 rounded-lg bg-white/5" />
          <div class="mt-5 h-10 rounded-lg bg-white/5" />
        </div>
      </div>
    </div>

    <div v-else-if="appointments.error" role="alert" class="rounded-2xl border border-amber-400/20 bg-neutral-900/60 px-5 py-8 text-center sm:py-10">
      <h3 class="font-barber text-xl text-white">No pudimos cargar tus citas</h3>
      <p class="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/55">Revisa tu conexión y vuelve a consultar. Tus reservas no se han modificado.</p>
      <button type="button" @click="appointments.getMyAppointments()"
        class="mt-5 min-h-11 rounded-xl border border-[#ffb700]/40 px-5 text-sm font-medium text-[#ffb700] transition-colors hover:bg-[#ffb700]/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffb700] motion-reduce:transition-none">Volver a consultar</button>
    </div>

    <div v-else-if="appointments.noAppointments" class="flex flex-col items-center rounded-2xl border border-white/10 bg-neutral-900/40 px-5 py-9 text-center sm:py-12">
      <div class="mb-4 flex size-14 items-center justify-center rounded-2xl bg-white/5 text-[#ffb700]/80">
        <svg aria-hidden="true" class="size-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4">
          <rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4m8-4v4M3 11h18m-9 4v3m-1.5-1.5h3" stroke-linecap="round" />
        </svg>
      </div>
      <h3 class="font-barber text-xl text-white sm:text-2xl">Tu próxima visita empieza aquí</h3>
      <p class="mt-2 max-w-sm text-sm leading-6 text-white/55">Aún no tienes citas próximas. Cuando reserves, podrás consultar y gestionar todos los detalles desde este espacio.</p>
      <RouterLink :to="{ name: 'AppointmentSlot' }"
        class="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#ffb700] px-5 text-sm font-semibold text-black transition-colors hover:bg-[#e6a500] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffb700] motion-reduce:transition-none">Reservar una cita</RouterLink>
    </div>

    <ul v-else aria-label="Tus citas" class="grid items-stretch gap-4 lg:grid-cols-2">
      <li v-for="appointment in appointments.appointments" :key="appointment._id" class="min-w-0">
        <Appointments :appointment="appointment" />
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { RouterLink } from "vue-router";
import Appointments from "@/components/UI/Appointments.vue";
import { useMyAppointmentsStore } from "@/stores/myAppointments";

const appointments = useMyAppointmentsStore();
onMounted(() => { void appointments.getMyAppointments(); });
</script>
