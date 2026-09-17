<!-- src/views/admin/Appointments.vue -->

<template>
  <div>
    <!-- HEADER -->
    <div class="mb-10">
      <p
        class="text-[9px] uppercase tracking-[0.35em] text-[#ffb700] font-medium mb-2"
      >
        Gestión
      </p>

      <div
        class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3"
      >
        <div>
          <h1
            class="text-3xl sm:text-4xl font-barber uppercase tracking-wide text-white"
          >
            Citas
          </h1>

          <p class="text-white/35 text-sm mt-2">
            Consulta, filtra y administra todas las reservas del salón.
          </p>
        </div>

        <p class="text-white/25 text-[10px] uppercase tracking-[0.25em]">
          {{ filteredAppointments.length }} de
          {{ adminStore.appointments.length }} reservas
        </p>
      </div>
    </div>

    <!-- LOADING -->
    <div
      v-if="adminStore.loading || barberStore.loading || serviceStore.loading"
      class="flex items-center justify-center py-20"
    >
      <div
        class="w-7 h-7 rounded-full border-2 border-white/10 border-t-[#ffb700] animate-spin"
      ></div>
    </div>

    <template v-else>
      <!-- STATS -->
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

      <!-- FILTROS -->
      <section
        class="bg-white/[0.02] border border-white/10 rounded-2xl p-5 sm:p-6 mb-8"
      >
        <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div class="md:col-span-2">
            <label
              class="text-[9px] uppercase tracking-[0.25em] text-white/30 block mb-2"
            >
              Buscar
            </label>

            <input
              v-model="search"
              type="text"
              placeholder="Nombre o correo del cliente"
              class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#ffb700]/50 transition"
            />
          </div>

          <div>
            <label
              class="text-[9px] uppercase tracking-[0.25em] text-white/30 block mb-2"
            >
              Fecha
            </label>

            <input
              v-model="filterDate"
              type="date"
              class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ffb700]/50 transition"
            />
          </div>

          <div>
            <label
              class="text-[9px] uppercase tracking-[0.25em] text-white/30 block mb-2"
            >
              Barbero
            </label>

            <select
              v-model="filterBarber"
              class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ffb700]/50 transition"
            >
              <option value="">Todos</option>
              <option
                v-for="barber in barberStore.barbers"
                :key="barber._id"
                :value="barber._id"
              >
                {{ barber.name }}
              </option>
            </select>
          </div>
        </div>

        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 pt-4 border-t border-white/5"
        >
          <div class="flex flex-wrap gap-2">
            <button
              v-for="option in quickOptions"
              :key="option.value"
              type="button"
              @click="quickFilter = option.value"
              :class="[
                'px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] rounded-full border transition-all duration-200',
                quickFilter === option.value
                  ? 'bg-[#ffb700]/10 border-[#ffb700]/40 text-[#ffb700]'
                  : 'border-white/10 text-white/40 hover:text-white hover:border-white/20',
              ]"
            >
              {{ option.label }}
            </button>
          </div>

          <button
            type="button"
            @click="clearFilters"
            class="text-[10px] uppercase tracking-[0.2em] text-white/35 hover:text-[#ffb700] transition self-start sm:self-auto"
          >
            Limpiar filtros
          </button>
        </div>
      </section>

      <!-- LISTA -->
      <section class="space-y-3">
        <div
          v-if="filteredAppointments.length === 0"
          class="py-16 text-center border border-dashed border-white/10 rounded-2xl"
        >
          <p class="text-white/25 text-sm">
            No hay citas que coincidan con los filtros.
          </p>
        </div>

        <article
          v-for="appointment in filteredAppointments"
          :key="appointment._id"
          class="relative bg-white/[0.02] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all duration-300"
        >
          <span
            :class="[
              'absolute left-0 top-5 bottom-5 w-[3px] rounded-r-full',
              statusOf(appointment.date) === 'hoy'
                ? 'bg-[#ffb700]'
                : statusOf(appointment.date) === 'pasada'
                  ? 'bg-red-500/60'
                  : 'bg-white/10',
            ]"
          ></span>

          <div
            class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 pl-3"
          >
            <div class="flex items-center gap-3 min-w-0">
              <div
                class="w-10 h-10 rounded-full bg-[#ffb700]/10 border border-[#ffb700]/20 flex items-center justify-center shrink-0"
              >
                <span class="text-[#ffb700] text-xs font-medium">
                  {{ initialOf(appointment) }}
                </span>
              </div>

              <div class="min-w-0">
                <p class="text-white/85 text-sm font-barber truncate">
                  {{ appointment.user?.name || "Cliente" }}
                </p>

                <p class="text-white/30 text-[10px] truncate">
                  {{ appointment.user?.email || "Sin correo" }}
                </p>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-5 lg:gap-8 shrink-0">
              <div>
                <p
                  class="text-[8px] uppercase tracking-[0.25em] text-white/25 mb-1"
                >
                  Fecha
                </p>
                <p class="text-white/70 text-xs">
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

              <div>
                <p
                  class="text-[8px] uppercase tracking-[0.25em] text-white/25 mb-1"
                >
                  Barbero
                </p>
                <p class="text-white/70 text-xs truncate">
                  {{ appointment.barber?.name || "—" }}
                </p>
              </div>
            </div>

            <div class="shrink-0">
              <span
                :class="[
                  'text-[9px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border',
                  statusOf(appointment.date) === 'hoy'
                    ? 'bg-[#ffb700]/10 border-[#ffb700]/30 text-[#ffb700]'
                    : statusOf(appointment.date) === 'pasada'
                      ? 'bg-red-500/5 border-red-500/20 text-red-400/70'
                      : 'bg-white/5 border-white/10 text-white/45',
                ]"
              >
                {{
                  statusOf(appointment.date) === "hoy"
                    ? "Hoy"
                    : statusOf(appointment.date) === "pasada"
                      ? "Pasada"
                      : "Próxima"
                }}
              </span>
            </div>
          </div>

          <div
            class="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-white/5 pl-3"
          >
            <p class="text-[11px] text-white/35 truncate">
              {{
                appointment.services.length
                  ? appointment.services.map((s) => s.name).join(" · ")
                  : "Sin servicios"
              }}
            </p>

            <p class="text-[#ffb700] text-sm font-barber shrink-0">
              {{ formatCurrency(appointment.totalAmount) }}
            </p>
          </div>

          <div
            class="flex items-center justify-end gap-2 mt-4 pl-3 pt-4 border-t border-white/5"
          >
            <button
              type="button"
              @click="openModal('detail', appointment)"
              class="px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] border border-white/10 text-white/55 hover:text-white hover:border-white/25 rounded-lg transition-all duration-200"
            >
              Ver
            </button>

            <button
              type="button"
              @click="openModal('edit', appointment)"
              class="px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] border border-[#ffb700]/20 text-[#ffb700]/80 hover:text-[#ffb700] hover:border-[#ffb700]/50 hover:bg-[#ffb700]/5 rounded-lg transition-all duration-200"
            >
              Editar
            </button>

            <button
              type="button"
              @click="openModal('delete', appointment)"
              class="px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] border border-red-500/20 text-red-400/70 hover:text-red-400 hover:border-red-500/50 hover:bg-red-500/5 rounded-lg transition-all duration-200"
            >
              Eliminar
            </button>
          </div>
        </article>
      </section>
    </template>

    <!-- ============ MODAL DETALLE ============ -->
    <div
      v-if="activeModal === 'detail' && selectedAppointment"
      class="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <div
        class="w-full max-w-lg bg-[#0b0b0b] border border-white/10 rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
      >
        <div class="flex items-start justify-between mb-6">
          <div>
            <p
              class="text-[9px] uppercase tracking-[0.3em] text-[#ffb700] font-medium mb-1"
            >
              Detalle de cita
            </p>
            <h2 class="text-xl font-barber uppercase text-white">
              {{ selectedAppointment.user?.name || "Cliente" }}
            </h2>
          </div>

          <button
            type="button"
            @click="closeModal"
            class="text-white/35 hover:text-white text-lg leading-none"
          >
            ✕
          </button>
        </div>

        <div class="space-y-4 text-sm">
          <div class="flex justify-between border-b border-white/5 pb-3">
            <span class="text-white/35 text-xs">Correo</span>
            <span class="text-white/80">
              {{ selectedAppointment.user?.email || "—" }}
            </span>
          </div>

          <div class="flex justify-between border-b border-white/5 pb-3">
            <span class="text-white/35 text-xs">Fecha</span>
            <span class="text-white/80">
              {{ displayDate(selectedAppointment.date) }}
            </span>
          </div>

          <div class="flex justify-between border-b border-white/5 pb-3">
            <span class="text-white/35 text-xs">Hora</span>
            <span class="text-[#ffb700]">
              {{ selectedAppointment.time }}
            </span>
          </div>

          <div class="flex justify-between border-b border-white/5 pb-3">
            <span class="text-white/35 text-xs">Barbero</span>
            <span class="text-white/80">
              {{ selectedAppointment.barber?.name || "—" }}
            </span>
          </div>

          <div class="pb-3 border-b border-white/5">
            <p class="text-white/35 text-xs mb-2">Servicios</p>
            <ul class="space-y-1">
              <li
                v-for="service in selectedAppointment.services"
                :key="service._id"
                class="flex justify-between text-white/75 text-xs"
              >
                <span>{{ service.name }}</span>
                <span class="text-white/45">
                  {{ formatCurrency(service.price) }}
                </span>
              </li>
            </ul>
          </div>

          <div class="flex justify-between pt-2">
            <span
              class="text-[10px] uppercase tracking-[0.25em] text-white/35"
            >
              Total
            </span>
            <span class="text-[#ffb700] font-barber text-lg">
              {{ formatCurrency(selectedAppointment.totalAmount) }}
            </span>
          </div>
        </div>

        <div class="flex justify-end mt-6">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 border border-white/10 text-white/60 hover:text-white hover:border-white/25 text-[10px] uppercase tracking-[0.2em] rounded-lg transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>

    <!-- ============ MODAL EDITAR ============ -->
    <div
      v-if="activeModal === 'edit' && selectedAppointment"
      class="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <div
        class="w-full max-w-2xl bg-[#0b0b0b] border border-white/10 rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
      >
        <div class="flex items-start justify-between mb-6">
          <div>
            <p
              class="text-[9px] uppercase tracking-[0.3em] text-[#ffb700] font-medium mb-1"
            >
              Editar cita
            </p>
            <h2 class="text-xl font-barber uppercase text-white">
              {{ selectedAppointment.user?.name || "Cliente" }}
            </h2>
          </div>

          <button
            type="button"
            @click="closeModal"
            class="text-white/35 hover:text-white text-lg leading-none"
          >
            ✕
          </button>
        </div>

        <div class="space-y-5">
          <!-- FECHA -->
          <div>
            <label
              class="text-[9px] uppercase tracking-[0.25em] text-white/30 block mb-2"
            >
              Fecha
            </label>
            <input
              v-model="editForm.date"
              type="date"
              class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ffb700]/50 transition"
            />
          </div>

          <!-- BARBERO -->
          <div>
            <label
              class="text-[9px] uppercase tracking-[0.25em] text-white/30 block mb-2"
            >
              Barbero
            </label>
            <select
              v-model="editForm.barber"
              class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ffb700]/50 transition"
            >
              <option
                v-for="barber in barberStore.barbers"
                :key="barber._id"
                :value="barber._id"
              >
                {{ barber.name }}
              </option>
            </select>
          </div>

          <!-- HORA -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label
                class="text-[9px] uppercase tracking-[0.25em] text-white/30"
              >
                Hora
              </label>

              <div
                v-if="!loadingHours"
                class="flex items-center gap-4 text-[8px] uppercase tracking-[0.18em]"
              >
                <div class="flex items-center gap-2 text-white/50">
                  <span class="w-2 h-2 rounded-full bg-[#ffb700]" />
                  <span>{{ availableHours.length }} libres</span>
                </div>
                <div class="flex items-center gap-2 text-white/25">
                  <span class="w-2 h-2 rounded-full bg-white/15" />
                  <span>{{ occupiedTimes.length }} ocupados</span>
                </div>
              </div>
            </div>

            <div
              v-if="loadingHours"
              class="min-h-[140px] flex flex-col items-center justify-center border border-white/5 rounded-xl bg-black/10"
            >
              <div
                class="w-6 h-6 border-2 border-white/10 border-t-[#ffb700] rounded-full animate-spin"
              />
              <p
                class="text-white/30 text-[9px] uppercase tracking-[0.3em] mt-3"
              >
                Cargando horarios...
              </p>
            </div>

            <div
              v-else
              class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2"
            >
              <button
                v-for="hour in hoursList"
                :key="hour"
                type="button"
                class="relative py-3 text-xs font-barber uppercase tracking-[0.1em] border rounded-lg transition-all duration-300"
                :class="{
                  'bg-[#ffb700] text-black border-[#ffb700] shadow-lg shadow-[#ffb700]/20':
                    editForm.time === hour,
                  'bg-white/[0.02] text-white/15 border-white/5 cursor-not-allowed line-through':
                    isHourOccupied(hour) && editForm.time !== hour,
                  'bg-transparent text-white/60 border-white/10 hover:text-white hover:border-[#ffb700]/50 hover:bg-[#ffb700]/5':
                    !isHourOccupied(hour) && editForm.time !== hour,
                }"
                :disabled="isHourOccupied(hour)"
                @click="editForm.time = hour"
              >
                {{ hour }}

                <span
                  v-if="isHourOccupied(hour)"
                  class="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500/50"
                />
              </button>
            </div>
          </div>

          <!-- SERVICIOS -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label
                class="text-[9px] uppercase tracking-[0.25em] text-white/30"
              >
                Servicios
              </label>

              <span class="text-[10px] text-[#ffb700] font-barber">
                Total: {{ formatCurrency(editTotal) }}
              </span>
            </div>

            <div
              class="border border-white/10 rounded-xl divide-y divide-white/5 overflow-hidden"
            >
              <label
                v-for="service in serviceStore.services"
                :key="service._id"
                class="flex items-center justify-between px-4 py-2.5 hover:bg-white/[0.02] cursor-pointer"
              >
                <span class="flex items-center gap-3">
                  <input
                    type="checkbox"
                    :value="service._id"
                    v-model="editForm.services"
                    class="accent-[#ffb700]"
                  />
                  <span class="text-xs text-white/75">{{ service.name }}</span>
                </span>
                <span class="text-[10px] text-white/35">
                  {{ formatCurrency(service.price) }}
                </span>
              </label>
            </div>
          </div>
        </div>

        <div
          class="flex flex-col sm:flex-row justify-end gap-2 mt-6 pt-5 border-t border-white/5"
        >
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 border border-white/10 text-white/55 hover:text-white hover:border-white/25 text-[10px] uppercase tracking-[0.2em] rounded-lg transition"
          >
            Cancelar
          </button>

          <button
            type="button"
            :disabled="saving || !editForm.date || !editForm.time || !editForm.barber"
            @click="handleUpdate"
            class="px-4 py-2 bg-[#ffb700] text-black text-[10px] uppercase tracking-[0.2em] font-medium rounded-lg hover:bg-[#ffb700]/90 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {{ saving ? "Guardando..." : "Guardar cambios" }}
          </button>
        </div>
      </div>
    </div>

    <!-- ============ MODAL ELIMINAR ============ -->
    <div
      v-if="activeModal === 'delete' && selectedAppointment"
      class="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <div
        class="w-full max-w-md bg-[#0b0b0b] border border-white/10 rounded-2xl p-6"
      >
        <p
          class="text-[9px] uppercase tracking-[0.3em] text-red-400/70 font-medium mb-2"
        >
          Confirmar eliminación
        </p>

        <h2 class="text-lg font-barber uppercase text-white mb-3">
          ¿Eliminar esta cita?
        </h2>

        <p class="text-white/45 text-xs leading-relaxed mb-6">
          Se eliminará la reserva de
          <span class="text-white/80 font-medium">
            {{ selectedAppointment.user?.name || "Cliente" }}
          </span>
          del
          <span class="text-white/80">
            {{ displayDate(selectedAppointment.date) }}
          </span>
          a las
          <span class="text-[#ffb700]">
            {{ selectedAppointment.time }}
          </span>
          . Esta acción no se puede deshacer.
        </p>

        <div class="flex flex-col sm:flex-row justify-end gap-2">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 border border-white/10 text-white/55 hover:text-white hover:border-white/25 text-[10px] uppercase tracking-[0.2em] rounded-lg transition"
          >
            Cancelar
          </button>

          <button
            type="button"
            :disabled="deleting"
            @click="handleDelete"
            class="px-4 py-2 bg-red-500/90 text-white text-[10px] uppercase tracking-[0.2em] font-medium rounded-lg hover:bg-red-500 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {{ deleting ? "Eliminando..." : "Sí, eliminar" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";

import { useAdminStore, type AdminAppointment } from "@/stores/admin";
import { useBarberStore } from "@/stores/barber";
import { useServiceStore } from "@/stores/service";

import { displayDate, convertToDatePicker } from "@/helpers/date";
import { formatCurrency } from "@/helpers";

import { useToast } from "vue-toast-notification";

const adminStore = useAdminStore();
const barberStore = useBarberStore();
const serviceStore = useServiceStore();

const toast = useToast();

/* =========================================================
   FECHA: helpers
   ========================================================= */
const toKey = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const todayKey = toKey(new Date());

const getAppointmentDateKey = (date: string) => {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";
  return toKey(parsed);
};

const statusOf = (dateIso: string): "hoy" | "pasada" | "proxima" => {
  const key = getAppointmentDateKey(dateIso);
  if (key === todayKey) return "hoy";
  return key < todayKey ? "pasada" : "proxima";
};

const initialOf = (appointment: AdminAppointment) =>
  appointment.user?.name?.trim().charAt(0).toUpperCase() || "C";

/* =========================================================
   FILTROS
   ========================================================= */
const search = ref("");
const filterDate = ref("");
const filterBarber = ref("");
const quickFilter = ref<"todas" | "hoy" | "futuras" | "pasadas">("todas");

const quickOptions = [
  { value: "todas" as const, label: "Todas" },
  { value: "hoy" as const, label: "Hoy" },
  { value: "futuras" as const, label: "Futuras" },
  { value: "pasadas" as const, label: "Pasadas" },
];

const clearFilters = () => {
  search.value = "";
  filterDate.value = "";
  filterBarber.value = "";
  quickFilter.value = "todas";
};

/* =========================================================
   COMPUTED: lista filtrada + stats
   ========================================================= */
const filteredAppointments = computed(() => {
  const text = search.value.trim().toLowerCase();

  return adminStore.appointments
    .filter((appointment) => {
      if (text) {
        const name = appointment.user?.name?.toLowerCase() ?? "";
        const email = appointment.user?.email?.toLowerCase() ?? "";
        if (!name.includes(text) && !email.includes(text)) return false;
      }

      if (filterDate.value) {
        const key = getAppointmentDateKey(appointment.date);
        if (key !== filterDate.value) return false;
      }

      if (filterBarber.value && appointment.barber?._id !== filterBarber.value) {
        return false;
      }

      const status = statusOf(appointment.date);
      if (quickFilter.value === "hoy" && status !== "hoy") return false;
      if (quickFilter.value === "futuras" && status !== "proxima") return false;
      if (quickFilter.value === "pasadas" && status !== "pasada") return false;

      return true;
    })
    .sort((a, b) => {
      const aKey = `${getAppointmentDateKey(a.date)}T${a.time}`;
      const bKey = `${getAppointmentDateKey(b.date)}T${b.time}`;
      return aKey.localeCompare(bKey);
    });
});

const statistics = computed(() => {
  const total = adminStore.appointments.length;
  const hoy = adminStore.appointments.filter(
    (a) => statusOf(a.date) === "hoy",
  ).length;
  const futuras = adminStore.appointments.filter(
    (a) => statusOf(a.date) === "proxima",
  ).length;
  const pasadas = adminStore.appointments.filter(
    (a) => statusOf(a.date) === "pasada",
  ).length;

  const ingresosHoy = adminStore.appointments
    .filter((a) => statusOf(a.date) === "hoy")
    .reduce((sum, a) => sum + Number(a.totalAmount || 0), 0);

  return [
    { label: "Total", value: total, detail: "Reservas registradas" },
    { label: "Hoy", value: hoy, detail: "Reservas del día" },
    { label: "Próximas", value: futuras, detail: "Reservas futuras" },
    {
      label: "Ingresos hoy",
      value: formatCurrency(ingresosHoy),
      detail: `Pasadas: ${pasadas}`,
    },
  ];
});

/* =========================================================
   MODAL
   ========================================================= */
const activeModal = ref<null | "detail" | "edit" | "delete">(null);
const selectedAppointment = ref<AdminAppointment | null>(null);

const saving = ref(false);
const deleting = ref(false);

/* --------- Formulario de edición --------- */
const editForm = ref<{
  date: string;
  time: string;
  barber: string;
  services: string[];
}>({
  date: "",
  time: "",
  barber: "",
  services: [],
});

/* --------- Horas fijas 07:00 a 23:00 --------- */
const HOUR_START = 7;
const HOUR_END = 23;

const hoursList = computed(() => {
  const list: string[] = [];
  for (let h = HOUR_START; h <= HOUR_END; h++) {
    list.push(`${String(h).padStart(2, "0")}:00`);
  }
  return list;
});

/* --------- Horas ocupadas (fetch) --------- */
const occupiedTimes = ref<string[]>([]);
const loadingHours = ref(false);

const availableHours = computed(() =>
  hoursList.value.filter((h) => !occupiedTimes.value.includes(h)),
);

const isHourOccupied = (hour: string) => occupiedTimes.value.includes(hour);


/* Recargar horas cuando cambia fecha o barbero */
watch(
  () => [editForm.value.date, editForm.value.barber],
  async ([newDate, newBarber]) => {
    if (!newDate || !newBarber) {
      occupiedTimes.value = [];
      return;
    }

    loadingHours.value = true;

    try {
      // Import dinámico de AdminAPI para no cargar arriba si no se usa
      const { default: AdminAPI } = await import("@/api/adminAPI");

      const { data } = await AdminAPI.getOccupiedTimes(newDate, newBarber);

      // Excluir la propia cita
      occupiedTimes.value = (data as { _id: string; time: string }[])
        .filter((a) => a._id !== selectedAppointment.value?._id)
        .map((a) => a.time);
    } catch {
      occupiedTimes.value = [];
    } finally {
      loadingHours.value = false;
    }
  },
);

/* --------- Total recalculado --------- */
const editTotal = computed(() =>
  editForm.value.services.reduce((sum, id) => {
    const service = serviceStore.services.find((s) => s._id === id);
    return sum + (service?.price || 0);
  }, 0),
);

/* --------- Abrir/cerrar modales --------- */
const openModal = (
  modal: "detail" | "edit" | "delete",
  appointment: AdminAppointment,
) => {
  selectedAppointment.value = appointment;
  activeModal.value = modal;

  if (modal === "edit") {
    editForm.value = {
      date: convertToDatePicker(appointment.date),
      time: appointment.time,
      barber: appointment.barber?._id || "",
      services: appointment.services.map((s) => s._id),
    };

    occupiedTimes.value = [];
  }
};

const closeModal = () => {
  activeModal.value = null;
  selectedAppointment.value = null;
  saving.value = false;
  deleting.value = false;
};

/* --------- Guardar cambios --------- */
const handleUpdate = async () => {
  if (
    !selectedAppointment.value ||
    !editForm.value.date ||
    !editForm.value.time ||
    !editForm.value.barber ||
    editForm.value.services.length === 0
  ) {
    toast.open({
      message: "Completa todos los campos y elige al menos un servicio",
      type: "warning",
    });
    return;
  }

  saving.value = true;

  const success = await adminStore.updateAppointment(
    selectedAppointment.value._id,
    {
      date: editForm.value.date,
      time: editForm.value.time,
      barber: editForm.value.barber,
      services: editForm.value.services,
      totalAmount: editTotal.value,
    },
    toast,
  );

  saving.value = false;

  if (success) closeModal();
};

/* --------- Eliminar --------- */
const handleDelete = async () => {
  if (!selectedAppointment.value) return;

  deleting.value = true;

  const success = await adminStore.deleteAppointment(
    selectedAppointment.value._id,
    toast,
  );

  deleting.value = false;

  if (success) closeModal();
};

/* =========================================================
   MOUNT
   ========================================================= */
onMounted(async () => {
  await Promise.all([
    adminStore.getAllAppointments(),
    barberStore.barbers.length ? Promise.resolve() : barberStore.getBarbers(),
    serviceStore.services.length
      ? Promise.resolve()
      : serviceStore.loadServices(),
  ]);
});
</script>

<style scoped></style>