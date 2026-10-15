
<template>
  <div class="w-full max-w-7xl mx-auto px-5 sm:px-10 lg:px-14 py-8">
    <!-- ENCABEZADO -->
    <div class="mb-10">
      <p
        class="text-[9px] uppercase tracking-[0.35em] text-[#ffb700] font-medium mb-2"
      >
        Mi agenda
      </p>

      <div
        class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3"
      >
        <div>
          <h1
            class="text-3xl sm:text-4xl font-barber uppercase tracking-wide text-white"
          >
            Mis clientes
          </h1>

          <p class="text-white/35 text-sm mt-2">
            Clientes con citas pendientes y su historial.
          </p>
        </div>

        <p class="text-white/25 text-[10px] uppercase tracking-[0.25em]">
          {{ sortedClients.length }} clientes visibles
        </p>
      </div>
    </div>

    <!-- CARGANDO -->
    <div
      v-if="barberStore.loadingClients"
      class="flex items-center justify-center py-20"
    >
      <div
        class="w-7 h-7 rounded-full border-2 border-white/10 border-t-[#ffb700] animate-spin"
      ></div>
    </div>

    <!-- ERROR -->
    <div
      v-else-if="barberStore.clientsError"
      class="py-12 text-center border border-dashed border-red-500/20 rounded-2xl"
    >
      <p class="text-red-400/70 text-sm">
        {{ barberStore.clientsError }}
      </p>

      <button
        type="button"
        @click="barberStore.getMyClients()"
        class="mt-3 text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-[#ffb700] transition"
      >
        Reintentar
      </button>
    </div>

    <!-- SIN CLIENTES CON CITAS PENDIENTES -->
    <div
      v-else-if="sortedClients.length === 0"
      class="text-center border border-white/5 rounded-2xl bg-white/[0.02] px-5 py-16"
    >
      <div
        class="w-14 h-14 mx-auto rounded-full border border-white/10 flex items-center justify-center mb-4"
      >
        <svg
          class="w-6 h-6 text-white/20"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      </div>

      <p class="text-white/70 text-sm font-barber">
        No tienes clientes con citas pendientes
      </p>

      <p
        class="text-white/35 text-xs mt-2 max-w-[280px] mx-auto leading-relaxed"
      >
        Cuando alguien tenga una cita actual o futura contigo,
        aparecerá aquí.
      </p>
    </div>

    <!-- CLIENTES -->
    <template v-else>
      <!-- BUSCADOR -->
      <section
        class="bg-white/[0.02] border border-white/10 rounded-2xl p-5 mb-8"
      >
        <input
          v-model="search"
          type="text"
          placeholder="Buscar cliente por nombre"
          class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#ffb700]/50 transition"
        />
      </section>

      <!-- SIN COINCIDENCIAS -->
      <div
        v-if="filteredClients.length === 0"
        class="py-16 text-center border border-dashed border-white/10 rounded-2xl"
      >
        <p class="text-white/25 text-sm">
          No hay clientes que coincidan con la búsqueda.
        </p>
      </div>

      <!-- TARJETAS -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ClientCard
          v-for="client in filteredClients"
          :key="client._id"
          :client="client"
          :next-appointment="getNextAppointment(client)"
          :is-global-next="globalNextClientId === client._id"
          @open-history="openDetail"
        />
      </div>
    </template>

    <!-- MODAL DEL HISTORIAL -->
    <ClientHistoryModal
      v-if="selectedClient"
      :client="selectedClient"
      @close="closeDetail"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import {
  useBarberStore,
  type BarberClient,
} from "@/stores/barber";

import ClientCard from "./ClientCard.vue";
import ClientHistoryModal from "./ClientHistoryModal.vue";
import { getNextAppointment } from "@/composables/clientHelpers.ts";

const barberStore = useBarberStore();

const search = ref("");
const selectedClient = ref<BarberClient | null>(null);

// Solo clientes que tienen al menos una cita actual o futura.
const sortedClients = computed(() => {
  return barberStore.myClients
    .filter((client) => getNextAppointment(client) !== null)
    .sort((a, b) => {
      const aNext = getNextAppointment(a)!;
      const bNext = getNextAppointment(b)!;

      const aKey = `${String(aNext.date).slice(0, 10)}T${aNext.time}`;
      const bKey = `${String(bNext.date).slice(0, 10)}T${bNext.time}`;

      return aKey.localeCompare(bKey);
    });
});

// Búsqueda aplicada a la lista ya filtrada.
const filteredClients = computed(() => {
  const text = search.value.trim().toLowerCase();

  if (!text) return sortedClients.value;

  return sortedClients.value.filter((client) =>
    client.name.toLowerCase().includes(text),
  );
});

// Identifica al cliente cuya cita es la más próxima de todos.
const globalNextClientId = computed<string | null>(() => {
  const firstClient = sortedClients.value[0];

  return firstClient?._id ?? null;
});

const openDetail = (client: BarberClient) => {
  selectedClient.value = client;
};

const closeDetail = () => {
  selectedClient.value = null;
};

onMounted(() => {
  barberStore.getMyClients();
});
</script>
