<!-- src/views/barber/Clients.vue -->

<template>
  <div class="w-full max-w-7xl mx-auto px-5 sm:px-10 lg:px-14 py-8">
    <!-- HEADER -->
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
            Clientes que han reservado contigo y su historial.
          </p>
        </div>

        <p class="text-white/25 text-[10px] uppercase tracking-[0.25em]">
          {{ sortedClients.length }} de {{ barberStore.myClients.length }}
          clientes
        </p>
      </div>
    </div>

    <!-- LOADING -->
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
      <p class="text-red-400/70 text-sm">{{ barberStore.clientsError }}</p>
      <button
        type="button"
        @click="barberStore.getMyClients()"
        class="mt-3 text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-[#ffb700] transition"
      >
        Reintentar
      </button>
    </div>

    <!-- SIN CLIENTES -->
    <div
      v-else-if="barberStore.myClients.length === 0"
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

      <p class="text-white/70 text-sm font-barber">Aún no tienes clientes</p>

      <p
        class="text-white/35 text-xs mt-2 max-w-[280px] mx-auto leading-relaxed"
      >
        Cuando alguien reserve contigo, aparecerá aquí con su historial.
      </p>
    </div>

    <!-- LISTA -->
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

      <div
        v-if="sortedClients.length === 0"
        class="py-16 text-center border border-dashed border-white/10 rounded-2xl"
      >
        <p class="text-white/25 text-sm">
          No hay clientes que coincidan con la búsqueda.
        </p>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <article
          v-for="client in sortedClients"
          :key="client._id"
          class="relative bg-white/[0.02] border rounded-2xl p-5 transition-all duration-300 overflow-hidden"
          :class="
            isGlobalNext(client)
              ? 'border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.08)]'
              : 'border-white/10 hover:border-[#ffb700]/25'
          "
        >
          <!-- BARRA LATERAL VERDE (solo el global) -->
          <span
            v-if="isGlobalNext(client)"
            class="absolute left-0 top-5 bottom-5 w-[3px] rounded-r-full bg-emerald-500"
          />

          <div class="flex items-start gap-4 pl-3">
            <!-- AVATAR -->
            <div
              class="shrink-0 w-12 h-12 rounded-full border flex items-center justify-center"
              :class="
                isGlobalNext(client)
                  ? 'border-emerald-500/60 bg-emerald-500/10'
                  : 'border-[#ffb700]/30 bg-[#ffb700]/5'
              "
            >
              <span
                class="font-barber text-lg"
                :class="
                  isGlobalNext(client) ? 'text-emerald-400' : 'text-[#ffb700]'
                "
              >
                {{ initialOf(client.name) }}
              </span>
            </div>

            <!-- INFO -->
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

                <!-- CHIP de la próxima cita -->
                <span
                  v-if="nextOf(client)"
                  :class="[
                    'text-[8px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border',
                    chipClassOf(nextOf(client), isGlobalNext(client)),
                  ]"
                >
                  {{ labelOf(nextOf(client)) }}
                </span>
              </div>

              <!-- PRÓXIMA CITA (solo si existe futura) -->
              <div v-if="nextOf(client)" class="flex items-center gap-3 mt-2.5">
                <!-- Fecha tipo calendario -->
                <div
                  class="shrink-0 w-12 rounded-xl border flex flex-col items-center justify-center py-1.5"
                  :class="
                    isGlobalNext(client)
                      ? 'border-emerald-500/50 bg-emerald-500/10'
                      : 'border-white/10 bg-white/[0.02]'
                  "
                >
                  <span
                    class="font-barber text-base leading-none"
                    :class="
                      isGlobalNext(client)
                        ? 'text-emerald-400'
                        : 'text-white/70'
                    "
                  >
                    {{ dayOf(nextOf(client)) }}
                  </span>
                  <span
                    class="text-[8px] uppercase tracking-[0.15em] mt-0.5"
                    :class="
                      isGlobalNext(client)
                        ? 'text-emerald-400/80'
                        : 'text-white/35'
                    "
                  >
                    {{ monthOf(nextOf(client)) }}
                  </span>
                </div>

                <!-- Hora + día -->
                <div class="min-w-0">
                  <p
                    class="text-[8px] uppercase tracking-[0.25em] mb-0.5"
                    :class="
                      isGlobalNext(client)
                        ? 'text-emerald-400/80'
                        : 'text-[#ffb700]/70'
                    "
                  >
                    Próxima cita
                  </p>
                  <p
                    class="font-barber text-lg leading-none"
                    :class="
                      isGlobalNext(client)
                        ? 'text-emerald-400'
                        : 'text-white/85'
                    "
                  >
                    {{ nextOf(client)?.time }}
                  </p>
                  <p class="text-white/30 text-[10px] mt-1 truncate">
                    {{ weekdayOf(nextOf(client)) }}
                  </p>
                </div>
              </div>

              <!-- Sin próxima cita -->
              <p v-else class="text-white/25 text-[10px] mt-2 italic">
                Sin próxima cita
              </p>

              <!-- STATS -->
              <div
                class="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/5"
              >
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

          <!-- ACCIONES -->
          <div class="flex justify-end mt-5 pt-4 border-t border-white/5">
            <button
              type="button"
              @click="openDetail(client)"
              class="px-3 py-2 text-[9px] uppercase tracking-[0.2em] border border-white/10 text-white/55 hover:text-white hover:border-white/25 rounded-lg transition-all duration-200"
            >
              Ver historial
            </button>
          </div>
        </article>
      </div>
    </template>

    <!-- ============ MODAL DETALLE ============ -->
    <div
      v-if="selectedClient"
      class="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-black/75 backdrop-blur-sm overflow-y-auto"
      @click.self="closeDetail"
    >
      <div
        class="w-full max-w-2xl bg-[#0b0b0b] border border-white/10 rounded-2xl p-6 my-auto max-h-[90vh] overflow-y-auto"
      >
        <div class="flex items-start justify-between mb-6">
          <div>
            <p
              class="text-[9px] uppercase tracking-[0.3em] text-[#ffb700] font-medium mb-1"
            >
              Historial
            </p>
            <h2 class="text-xl font-barber uppercase text-white">
              {{ selectedClient.name }}
            </h2>
          </div>

          <button
            type="button"
            @click="closeDetail"
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
              {{ selectedClient.appointmentsCount }}
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
              {{ formatCurrency(selectedClient.totalSpent) }}
            </p>
          </div>
        </div>

        <!-- HISTORIAL -->
        <div>
          <p class="text-[9px] uppercase tracking-[0.3em] text-white/35 mb-3">
            Citas contigo
          </p>

          <div class="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
            <div
              v-for="cita in sortedAppointments"
              :key="cita._id"
              class="flex items-center justify-between bg-white/[0.02] border rounded-lg px-4 py-3"
              :class="statusClassOf(cita)"
            >
              <div class="min-w-0">
                <p
                  class="text-xs font-barber truncate"
                  :class="serviceTextClassOf(cita)"
                >
                  {{ cita.services.map((s) => s.name).join(" · ") }}
                </p>
                <p class="text-[10px] mt-0.5" :class="dateTextClassOf(cita)">
                  {{ longDate(cita.date) }} · {{ cita.time }}
                </p>
              </div>

              <div class="text-right shrink-0 ml-3">
                <p class="text-xs font-barber" :class="priceTextClassOf(cita)">
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

        <div class="flex justify-end mt-6 pt-5 border-t border-white/5">
          <button
            type="button"
            @click="closeDetail"
            class="px-4 py-2 border border-white/10 text-white/60 hover:text-white hover:border-white/25 text-[10px] uppercase tracking-[0.2em] rounded-lg transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import {
  useBarberStore,
  type BarberClient,
  type BarberClientAppointment,
} from "@/stores/barber";
import { formatCurrency } from "@/helpers";

const barberStore = useBarberStore();

/* =========================================================
   HELPERS FECHA
   ========================================================= */
const MESES = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];
const MESES_LARGO = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];
const DIAS_LARGO = [
  "domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado",
];

const aptDateTime = (date: string | Date, time: string): Date => {
  const key =
    typeof date === "string"
      ? date.slice(0, 10)
      : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  const [y, m, d] = key.split("-").map(Number);
  const [h, min] = time.split(":").map(Number);

  return new Date(y!, m! - 1, d!, h ?? 0, min ?? 0, 0, 0);
};

const longDate = (iso: string | Date) => {
  const d =
    typeof iso === "string"
      ? new Date(iso.slice(0, 10) + "T12:00:00")
      : iso;
  if (Number.isNaN(d.getTime())) return "—";
  return `${d.getDate()} de ${MESES_LARGO[d.getMonth()]} de ${d.getFullYear()}`;
};

const initialOf = (name: string) =>
  name?.trim().charAt(0).toUpperCase() || "?";

/* =========================================================
   ROL: label + badge
   ========================================================= */
const roleLabel = (role: string): string => {
  if (role === "admin") return "Admin";
  if (role === "barber") return "Barbero";
  return "Cliente";
};

const roleBadgeClass = (role: string): string => {
  if (role === "admin") {
    return "bg-purple-500/5 border-purple-500/20 text-purple-400/80";
  }
  if (role === "barber") {
    return "bg-[#ffb700]/5 border-[#ffb700]/20 text-[#ffb700]/80";
  }
  return "bg-white/5 border-white/10 text-white/45";
};

/* =========================================================
   PRÓXIMA CITA de un cliente
   ========================================================= */
const getNextAppointment = (
  client: BarberClient,
): BarberClientAppointment | null => {
  if (!client.appointments?.length) return null;

  const now = new Date();

  const sorted = [...client.appointments].sort((a, b) => {
    const aKey = `${String(a.date).slice(0, 10)}T${a.time}`;
    const bKey = `${String(b.date).slice(0, 10)}T${b.time}`;
    return aKey.localeCompare(bKey);
  });

  return (
    sorted.find(
      (apt) => aptDateTime(apt.date, apt.time).getTime() >= now.getTime(),
    ) ?? null
  );
};

const nextOf = (client: BarberClient) => getNextAppointment(client);

/* =========================================================
   GLOBAL NEXT: el cliente con la cita más cercana de TODOS
   ========================================================= */
const globalNextClientId = computed<string | null>(() => {
  const candidates: {
    clientId: string;
    date: string;
    time: string;
  }[] = [];

  for (const c of barberStore.myClients) {
    const apt = getNextAppointment(c);
    if (!apt) continue;

    candidates.push({
      clientId: c._id,
      date: String(apt.date).slice(0, 10),
      time: apt.time,
    });
  }

  if (!candidates.length) return null;

  candidates.sort((a, b) => {
    const aKey = `${a.date}T${a.time}`;
    const bKey = `${b.date}T${b.time}`;
    return aKey.localeCompare(bKey);
  });

  return candidates[0]!.clientId;
});

const isGlobalNext = (client: BarberClient): boolean => {
  return globalNextClientId.value === client._id;
};

/* =========================================================
   Helpers de fecha de la próxima cita
   ========================================================= */
const dayOf = (apt: BarberClientAppointment | null): string => {
  if (!apt) return "";
  return String(aptDateTime(apt.date, apt.time).getDate()).padStart(2, "0");
};

const monthOf = (apt: BarberClientAppointment | null): string => {
  if (!apt) return "";
  return MESES[aptDateTime(apt.date, apt.time).getMonth()] ?? "—";
};

const weekdayOf = (apt: BarberClientAppointment | null): string => {
  if (!apt) return "";
  return DIAS_LARGO[aptDateTime(apt.date, apt.time).getDay()] ?? "";
};

/* =========================================================
   CHIP
   ========================================================= */
const labelOf = (apt: BarberClientAppointment | null): string => {
  if (!apt) return "";

  const d = aptDateTime(apt.date, apt.time);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dOnly = new Date(d);
  dOnly.setHours(0, 0, 0, 0);

  const diffDays = Math.round(
    (dOnly.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) return "Hoy";
  if (diffDays === 1) return "Mañana";
  if (diffDays <= 7) return `En ${diffDays} días`;
  return "Próxima";
};

const chipClassOf = (
  apt: BarberClientAppointment | null,
  isNext: boolean,
): string => {
  if (!apt) return "";

  if (!isNext) {
    return "bg-white/5 border-white/10 text-white/40";
  }

  const label = labelOf(apt);
  if (label === "Hoy") {
    return "bg-emerald-500/15 border-emerald-500/50 text-emerald-400";
  }
  return "bg-[#ffb700]/10 border-[#ffb700]/40 text-[#ffb700]";
};

/* =========================================================
   ORDENAR CLIENTES
   ========================================================= */
const search = ref("");

const sortedClients = computed(() => {
  const text = search.value.trim().toLowerCase();

  const filtered = text
    ? barberStore.myClients.filter((c) =>
        c.name.toLowerCase().includes(text),
      )
    : [...barberStore.myClients];

  return filtered.sort((a, b) => {
    const aNext = getNextAppointment(a);
    const bNext = getNextAppointment(b);

    if (aNext && bNext) {
      const aKey = `${String(aNext.date).slice(0, 10)}T${aNext.time}`;
      const bKey = `${String(bNext.date).slice(0, 10)}T${bNext.time}`;
      return aKey.localeCompare(bKey);
    }

    if (aNext) return -1;
    if (bNext) return 1;

    return a.name.localeCompare(b.name);
  });
});

/* =========================================================
   MODAL DETALLE
   ========================================================= */
const selectedClient = ref<BarberClient | null>(null);

const openDetail = (client: BarberClient) => {
  selectedClient.value = client;
};

const closeDetail = () => {
  selectedClient.value = null;
};

/* =========================================================
   HISTORIAL: ordenar y clasificar
   ========================================================= */
const sortedAppointments = computed(() => {
  if (!selectedClient.value) return [];

  return [...selectedClient.value.appointments].sort((a, b) => {
    const aKey = `${String(a.date).slice(0, 10)}T${a.time}`;
    const bKey = `${String(b.date).slice(0, 10)}T${b.time}`;
    return aKey.localeCompare(bKey);
  });
});

const statusOf = (cita: BarberClientAppointment): "next" | "past" | "future" => {
  const nowDate = new Date();
  const d = aptDateTime(cita.date, cita.time);

  if (d.getTime() < nowDate.getTime()) return "past";

  const next = getNextAppointment(selectedClient.value!);
  if (next && next._id === cita._id) return "next";

  return "future";
};

const statusClassOf = (cita: BarberClientAppointment): string => {
  const s = statusOf(cita);
  if (s === "next") return "border-emerald-500/50 bg-emerald-500/5";
  if (s === "past") return "border-red-500/20 bg-red-500/5";
  return "border-white/5";
};

const serviceTextClassOf = (cita: BarberClientAppointment): string => {
  const s = statusOf(cita);
  if (s === "past") return "text-red-400/60 line-through";
  if (s === "next") return "text-emerald-400/90";
  return "text-white/80";
};

const dateTextClassOf = (cita: BarberClientAppointment): string => {
  const s = statusOf(cita);
  if (s === "past") return "text-red-400/50 line-through";
  if (s === "next") return "text-emerald-400/70";
  return "text-white/35";
};

const priceTextClassOf = (cita: BarberClientAppointment): string => {
  const s = statusOf(cita);
  if (s === "past") return "text-red-400/60 line-through";
  if (s === "next") return "text-emerald-400";
  return "text-[#ffb700]";
};

const statusLabelClassOf = (cita: BarberClientAppointment): string => {
  const s = statusOf(cita);
  if (s === "past") return "text-red-400/60";
  if (s === "next") return "text-emerald-400";
  return "text-white/35";
};

const statusLabelText = (cita: BarberClientAppointment): string => {
  const s = statusOf(cita);
  if (s === "past") return "Pasada";
  if (s === "next") return "Próxima";
  return "Futura";
};

/* =========================================================
   MOUNT
   ========================================================= */
onMounted(() => {
  barberStore.getMyClients();
});
</script>

<style scoped></style>