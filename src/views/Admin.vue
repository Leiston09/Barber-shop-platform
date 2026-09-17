<!-- src/views/admin/AdminDashboard.vue -->

<template>
  <div class="min-h-screen text-white px-5 sm:px-8 lg:px-10">
    <div class="max-w-7xl mx-auto">
      <div class="mb-10">
        <p
          class="text-[9px] uppercase tracking-[0.35em] text-[#ffb700] font-medium mb-2"
        >
          Administración
        </p>

        <div
          class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3"
        >
          <div>
            <h1
              class="text-3xl sm:text-4xl font-barber uppercase tracking-wide text-white"
            >
              Panel general
            </h1>

            <p class="text-white/35 text-sm mt-2">
              Información general y actividad actual del salón.
            </p>
          </div>

          <p v-if="userStore.user" class="text-white/40 text-xs">
            {{ userStore.user.name }}
          </p>
        </div>
      </div>

      <div v-if="loading" class="flex items-center justify-center py-20">
        <div
          class="w-7 h-7 rounded-full border-2 border-white/10 border-t-[#ffb700] animate-spin"
        ></div>
      </div>

      <template v-else>
        <section class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <div
            v-for="stat in statistics"
            :key="stat.label"
            class="bg-white/[0.02] border border-white/10 rounded-2xl p-5 hover:border-[#ffb700]/25 transition-all duration-300"
          >
            <p
              class="text-[9px] uppercase tracking-[0.25em] text-white/30 mb-3"
            >
              {{ stat.label }}
            </p>

            <p class="text-2xl sm:text-3xl font-barber text-white">
              {{ stat.value }}
            </p>

            <p v-if="stat.detail" class="text-[10px] text-white/25 mt-2">
              {{ stat.detail }}
            </p>
          </div>
        </section>

        <section
          class="grid grid-cols-1 lg:grid-cols-[1.35fr_0.65fr] gap-5 mb-8"
        >
          <div
            class="bg-white/[0.02] border border-white/10 rounded-2xl p-5 sm:p-6"
          >
            <div class="flex items-center justify-between gap-4 mb-6">
              <div>
                <p
                  class="text-[9px] uppercase tracking-[0.3em] text-[#ffb700] font-medium mb-1"
                >
                  Agenda
                </p>

                <h2 class="text-xl font-barber uppercase text-white">
                  Próximas reservas
                </h2>
              </div>

              <span class="text-[10px] text-white/25">
                {{ upcomingAppointments.length }}
                {{ upcomingAppointments.length === 1 ? "reserva" : "reservas" }}
              </span>
            </div>

            <div
              v-if="upcomingAppointments.length"
              class="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              <div
                v-for="appointment in upcomingAppointments"
                :key="appointment._id"
                class="bg-white/[0.02] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-all duration-300"
              >
                <div
                  class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div class="flex items-center gap-3 min-w-0">
                    <div
                      class="w-9 h-9 rounded-full bg-[#ffb700]/10 border border-[#ffb700]/20 flex items-center justify-center shrink-0"
                    >
                      <span class="text-[#ffb700] text-xs font-medium">
                        {{ getClientInitial(appointment) }}
                      </span>
                    </div>

                    <div class="min-w-0">
                      <p class="text-white/80 text-sm font-barber truncate">
                        {{ appointment.user?.name || "Cliente" }}
                      </p>

                      <p class="text-white/30 text-[10px] truncate">
                        {{ appointment.user?.email || "Sin correo" }}
                      </p>
                    </div>
                  </div>

                  <div class="flex items-center gap-5 sm:justify-end">
                    <div>
                      <p
                        class="text-[8px] uppercase tracking-[0.25em] text-white/25 mb-1"
                      >
                        Fecha
                      </p>

                      <p class="text-white/60 text-xs">
                        {{ displayDate(appointment.date) }}
                      </p>
                    </div>

                    <div>
                      <p
                        class="text-[8px] uppercase tracking-[0.25em] text-white/25 mb-1"
                      >
                        Hora
                      </p>

                      <p class="text-[#ffb700] text-xs font-medium">
                        {{ appointment.time }}
                      </p>
                    </div>

                    <div v-if="appointment.barber" class="hidden sm:block">
                      <p
                        class="text-[8px] uppercase tracking-[0.25em] text-white/25 mb-1"
                      >
                        Barbero
                      </p>

                      <p class="text-white/60 text-xs">
                        {{ appointment.barber.name }}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  class="flex items-center justify-between gap-4 mt-3 pt-3 border-t border-white/5"
                >
                  <p class="text-[10px] text-white/30 truncate">
                    {{
                      appointment.services?.length
                        ? appointment.services
                            .map((service) => service.name)
                            .join(", ")
                        : "Sin servicios"
                    }}
                  </p>

                  <p class="text-[#ffb700] text-xs font-barber shrink-0">
                    {{ formatCurrency(appointment.totalAmount) }}
                  </p>
                </div>
              </div>
            </div>

            <div
              v-else
              class="py-12 text-center border border-dashed border-white/5 rounded-xl"
            >
              <p class="text-white/25 text-sm">No hay reservas próximas.</p>
            </div>
          </div>

          <div
            class="bg-white/[0.02] border border-white/10 rounded-2xl p-5 sm:p-6"
          >
            <div class="mb-6">
              <p
                class="text-[9px] uppercase tracking-[0.3em] text-[#ffb700] font-medium mb-1"
              >
                Hoy
              </p>

              <h2 class="text-xl font-barber uppercase text-white">
                Resumen del día
              </h2>
            </div>

            <div class="space-y-4">
              <div
                class="flex items-center justify-between py-3 border-b border-white/5"
              >
                <span class="text-white/40 text-xs"> Reservas </span>

                <span class="text-white text-sm font-barber">
                  {{ todayAppointments }}
                </span>
              </div>

              <div
                class="flex items-center justify-between py-3 border-b border-white/5"
              >
                <span class="text-white/40 text-xs"> Barberos activos </span>

                <span class="text-white text-sm font-barber">
                  {{ totalBarbers }}
                </span>
              </div>

              <div
                class="flex items-center justify-between py-3 border-b border-white/5"
              >
                <span class="text-white/40 text-xs">
                  Clientes registrados
                </span>

                <span class="text-white text-sm font-barber">
                  {{ totalClients }}
                </span>
              </div>

              <div class="flex items-center justify-between pt-3">
                <span class="text-white/40 text-xs"> Ingresos estimados </span>

                <span class="text-[#ffb700] text-sm font-barber">
                  {{ formatCurrency(estimatedIncome) }}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section class="mb-8">
          <div class="mb-5">
            <p
              class="text-[9px] uppercase tracking-[0.3em] text-[#ffb700] font-medium mb-1"
            >
              Gestión
            </p>

            <h2 class="text-xl font-barber uppercase text-white">
              Administración del salón
            </h2>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <router-link
              v-for="section in managementSections"
              :key="section.title"
              :to="section.to"
              custom
              v-slot="{ navigate }"
            >
              <div
                @click="navigate"
                role="link"
                class="group relative h-52 rounded-2xl overflow-hidden border border-white/10 text-left cursor-pointer"
              >
                <img
                  :src="section.image"
                  :alt="section.title"
                  class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div
                  class="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-black/10"
                ></div>

                <div class="absolute inset-x-0 bottom-0 p-5">
                  <p
                    class="text-[8px] uppercase tracking-[0.3em] text-[#ffb700] font-medium mb-1"
                  >
                    {{ section.category }}
                  </p>

                  <h3 class="text-lg font-barber uppercase text-white mb-1">
                    {{ section.title }}
                  </h3>

                  <p
                    class="text-white/45 text-[10px] leading-relaxed max-w-[230px]"
                  >
                    {{ section.description }}
                  </p>
                </div>
              </div>
            </router-link>
          </div>
        </section>

        <section
          v-if="barberStore.barbers.length"
          class="bg-white/[0.02] border border-white/10 rounded-2xl p-5 sm:p-6"
        >
          <div class="flex items-end justify-between gap-4 mb-6">
            <div>
              <p
                class="text-[9px] uppercase tracking-[0.3em] text-[#ffb700] font-medium mb-1"
              >
                Equipo
              </p>

              <h2 class="text-xl font-barber uppercase text-white">Barberos</h2>
            </div>

            <span class="text-[10px] text-white/25">
              {{ totalBarbers }}
              {{ totalBarbers === 1 ? "profesional" : "profesionales" }}
            </span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <div
              v-for="(barber, index) in barberStore.barbers"
              :key="barber._id"
              class="group overflow-hidden rounded-xl border border-white/5 bg-white/[0.02]"
            >
              <div class="aspect-[4/3] overflow-hidden">
                <img
                  :src="`/img/barbers/barber${index + 1}.jpg`"
                  :alt="barber.name"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div class="p-3">
                <p class="text-white/80 text-xs font-barber truncate">
                  {{ barber.name }}
                </p>

                <p class="text-white/25 text-[10px] truncate mt-1">
                  {{ barber.email }}
                </p>
              </div>
            </div>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";

import { displayDate } from "@/helpers/date";

import { formatCurrency } from "@/helpers";

import { useUserStore } from "@/stores/user";

import { useAdminStore } from "@/stores/admin";

import { useBarberStore } from "@/stores/barber";

const userStore = useUserStore();
const adminStore = useAdminStore();
const barberStore = useBarberStore();

const loading = computed(
  () => adminStore.loading || adminStore.loadingClients || barberStore.loading,
);

const appointments = computed(() => adminStore.appointments);

const totalAppointments = computed(() => appointments.value.length);

const totalBarbers = computed(() => barberStore.barbers.length);

const totalClients = computed(() => adminStore.clients.length);

const getLocalDateKey = (date: Date) => {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const todayKey = computed(() => getLocalDateKey(new Date()));

const getAppointmentDateKey = (date: string) => {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return getLocalDateKey(parsed);
};

const todayAppointments = computed(
  () =>
    appointments.value.filter(
      (appointment) =>
        getAppointmentDateKey(appointment.date) === todayKey.value,
    ).length,
);

const estimatedIncome = computed(() =>
  appointments.value
    .filter(
      (appointment) =>
        getAppointmentDateKey(appointment.date) === todayKey.value,
    )
    .reduce(
      (total, appointment) => total + Number(appointment.totalAmount || 0),
      0,
    ),
);

/*
 * Aquí se muestran TODAS las reservas
 * que llegan desde el backend.
 *
 * Ya no se filtran por fecha/hora.
 * Solo se ordenan de la más próxima
 * a la más lejana.
 */
const upcomingAppointments = computed(() =>
  [...appointments.value].sort((a, b) => {
    const dateA = new Date(a.date);

    const dateB = new Date(b.date);

    const [hoursA = "0", minutesA = "0"] = a.time.split(":");

    const [hoursB = "0", minutesB = "0"] = b.time.split(":");

    dateA.setHours(Number(hoursA), Number(minutesA), 0, 0);

    dateB.setHours(Number(hoursB), Number(minutesB), 0, 0);

    return dateA.getTime() - dateB.getTime();
  }),
);

const statistics = computed(() => [
  {
    label: "Reservas",
    value: totalAppointments.value,
    detail: "Total registradas",
  },
  {
    label: "Hoy",
    value: todayAppointments.value,
    detail: "Reservas del día",
  },
  {
    label: "Clientes",
    value: totalClients.value,
    detail: "Usuarios registrados",
  },
  {
    label: "Barberos",
    value: totalBarbers.value,
    detail: "Profesionales activos",
  },
]);

const managementSections = computed(() => [
  {
    category: "Reservas",
    title: "Citas",
    description: "Consulta y administra las reservas del salón.",
    image: "/img/admin/gestion/citas.png",
    to: { name: 'Admin-Appointments' },
  },
  {
    category: "Equipo",
    title: "Barberos",
    description: "Gestiona profesionales y horarios.",
    image: "/img/admin/gestion/barbers.png",
    to: { name: 'Admin-Barbers' },
  },
  {
    category: "Usuarios",
    title: "Clientes",
    description: "Consulta y administra los clientes.",
    image: "/img/admin/gestion/clientes.png",
    to: { name: 'Admin-Customer' },
  },
  {
    category: "Catálogo",
    title: "Servicios",
    description: "Administra servicios y precios.",
    image: "/img/admin/gestion/services.png",
    to: { name: 'Admin-Services' },
  },
]);

const getClientInitial = (appointment: (typeof appointments.value)[number]) =>
  appointment.user?.name?.trim().charAt(0).toUpperCase() || "C";

onMounted(async () => {
  await Promise.all([
    adminStore.getAllAppointments(),
    adminStore.getClients(),
    barberStore.getBarbers(),
  ]);
});
</script>

<style scoped></style>
