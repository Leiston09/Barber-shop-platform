<!-- src/views/admin/Customer.vue -->

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
            Usuarios
          </h1>
          <p class="text-white/35 text-sm mt-2">
            Consulta, gestiona roles y administra el acceso de los usuarios.
          </p>
        </div>

        <p class="text-white/25 text-[10px] uppercase tracking-[0.25em]">
          {{ filteredUsers.length }} de {{ adminStore.users.length }} usuarios
        </p>
      </div>
    </div>

    <!-- LOADING -->
    <div
      v-if="adminStore.loadingUsers"
      class="flex items-center justify-center py-20"
    >
      <div
        class="w-7 h-7 rounded-full border-2 border-white/10 border-t-[#ffb700] animate-spin"
      ></div>
    </div>

    <!-- ERROR -->
    <div
      v-else-if="adminStore.usersError"
      class="py-12 text-center border border-dashed border-red-500/20 rounded-2xl"
    >
      <p class="text-red-400/70 text-sm">{{ adminStore.usersError }}</p>
      <button
        type="button"
        @click="adminStore.getAllUsers()"
        class="mt-3 text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-[#ffb700] transition"
      >
        Reintentar
      </button>
    </div>

    <template v-else>
      <!-- STATS -->
      <section class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <div
          v-for="stat in statistics"
          :key="stat.label"
          class="bg-white/[0.02] border border-white/10 rounded-2xl p-5 hover:border-[#ffb700]/25 transition-all duration-300"
        >
          <p class="text-[9px] uppercase tracking-[0.25em] text-white/30 mb-3">
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
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div class="md:col-span-2">
            <label
              class="text-[9px] uppercase tracking-[0.25em] text-white/30 block mb-2"
            >
              Buscar
            </label>
            <input
              v-model="search"
              type="text"
              placeholder="Nombre o correo"
              class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#ffb700]/50 transition"
            />
          </div>

          <div>
            <label
              class="text-[9px] uppercase tracking-[0.25em] text-white/30 block mb-2"
            >
              Estado
            </label>
            <select
              v-model="filterStatus"
              class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ffb700]/50 transition"
            >
              <option value="">Todos</option>
              <option value="active">Activos</option>
              <option value="blocked">Bloqueados</option>
              <option value="unverified">Sin verificar</option>
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
      <section>
        <div
          v-if="filteredUsers.length === 0"
          class="py-16 text-center border border-dashed border-white/10 rounded-2xl"
        >
          <p class="text-white/25 text-sm">
            No hay usuarios que coincidan con los filtros.
          </p>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <article
            v-for="user in filteredUsers"
            :key="user._id"
            class="relative bg-white/[0.02] border rounded-2xl p-5 transition-all duration-300 hover:border-[#ffb700]/25 overflow-hidden"
            :class="user.blocked ? 'border-red-500/20' : 'border-white/10'"
          >
            <span
              v-if="user.blocked"
              class="absolute left-0 top-5 bottom-5 w-[3px] rounded-r-full bg-red-500/60"
            />

            <div class="flex items-start gap-4">
              <div
                class="shrink-0 w-12 h-12 rounded-full border flex items-center justify-center"
                :class="
                  user.blocked
                    ? 'border-red-500/30 bg-red-500/5'
                    : 'border-[#ffb700]/30 bg-[#ffb700]/5'
                "
              >
                <span
                  :class="
                    'font-barber text-lg ' +
                    (user.blocked ? 'text-red-400/70' : 'text-[#ffb700]')
                  "
                >
                  {{ initialOf(user.name) }}
                </span>
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-center gap-2 mb-1">
                  <p class="text-white/90 text-sm font-barber truncate">
                    {{ user.name }}
                  </p>

                  <!-- Badge protegido -->
                  <span
                    v-if="user.protected"
                    class="text-[8px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border bg-blue-500/5 border-blue-500/20 text-blue-400/80"
                  >
                    Protegido
                  </span>

                  <!-- Badge bloqueado -->
                  <span
                    v-if="user.blocked"
                    class="text-[8px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border bg-red-500/5 border-red-500/20 text-red-400/80"
                  >
                    Bloqueado
                  </span>

                  <!-- Badge sin verificar -->
                  <span
                    v-else-if="!user.verified"
                    class="text-[8px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border bg-amber-500/5 border-amber-500/20 text-amber-400/80"
                  >
                    Sin verificar
                  </span>

                  <!-- Badge rol -->
                  <span
                    :class="[
                      'text-[8px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border',
                      user.role === 'admin'
                        ? 'bg-purple-500/5 border-purple-500/20 text-purple-400/80'
                        : user.role === 'barber'
                          ? 'bg-[#ffb700]/5 border-[#ffb700]/20 text-[#ffb700]/80'
                          : 'bg-white/5 border-white/10 text-white/45',
                    ]"
                  >
                    {{ roleLabel(user.role) }}
                  </span>
                </div>

                <p class="text-white/35 text-[11px] truncate">
                  {{ user.email }}
                </p>

                <div
                  class="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/5"
                >
                  <div>
                    <p
                      class="text-[8px] uppercase tracking-[0.25em] text-white/25 mb-1"
                    >
                      Citas
                    </p>
                    <p class="text-white/80 text-xs font-barber">
                      {{ user.appointmentsCount }}
                    </p>
                  </div>
                  <div>
                    <p
                      class="text-[8px] uppercase tracking-[0.25em] text-white/25 mb-1"
                    >
                      Total
                    </p>
                    <p class="text-[#ffb700] text-xs font-barber">
                      {{ formatCurrency(user.totalSpent) }}
                    </p>
                  </div>
                  <div>
                    <p
                      class="text-[8px] uppercase tracking-[0.25em] text-white/25 mb-1"
                    >
                      Registro
                    </p>
                    <p class="text-white/60 text-xs">
                      {{ shortDate(user.createdAt) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- ACCIONES -->
            <div
              class="flex flex-wrap items-center justify-end gap-2 mt-5 pt-4 border-t border-white/5"
            >
              <button
                type="button"
                @click="openModal('detail', user)"
                class="px-3 py-2 text-[9px] uppercase tracking-[0.2em] border border-white/10 text-white/55 hover:text-white hover:border-white/25 rounded-lg transition-all duration-200"
              >
                Ver detalle
              </button>

              <button
                v-if="canChangeRole(user)"
                type="button"
                @click="openModal('role', user)"
                class="px-3 py-2 text-[9px] uppercase tracking-[0.2em] border border-[#ffb700]/20 text-[#ffb700]/80 hover:text-[#ffb700] hover:border-[#ffb700]/50 hover:bg-[#ffb700]/5 rounded-lg transition-all duration-200"
              >
                Cambiar rol
              </button>

              <button
                v-if="canBlock(user) && !user.blocked"
                type="button"
                @click="openModal('block', user)"
                class="px-3 py-2 text-[9px] uppercase tracking-[0.2em] border border-red-500/20 text-red-400/70 hover:text-red-400 hover:border-red-500/50 hover:bg-red-500/5 rounded-lg transition-all duration-200"
              >
                Bloquear
              </button>

              <button
                v-else-if="canBlock(user) && user.blocked"
                type="button"
                @click="openModal('unblock', user)"
                class="px-3 py-2 text-[9px] uppercase tracking-[0.2em] border border-emerald-500/20 text-emerald-400/70 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/5 rounded-lg transition-all duration-200"
              >
                Desbloquear
              </button>
            </div>
          </article>
        </div>
      </section>
    </template>

    <!-- ============ MODAL DETALLE ============ -->
    <div
      v-if="activeModal === 'detail' && selectedUser"
      class="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-black/75 backdrop-blur-sm overflow-y-auto"
      @click.self="closeModal"
    >
      <div
        class="w-full max-w-2xl bg-[#0b0b0b] border border-white/10 rounded-2xl p-6 my-auto max-h-[90vh] overflow-y-auto"
      >
        <div class="flex items-start justify-between mb-6">
          <div>
            <p
              class="text-[9px] uppercase tracking-[0.3em] text-[#ffb700] font-medium mb-1"
            >
              Ficha del usuario
            </p>
            <h2 class="text-xl font-barber uppercase text-white">
              {{ selectedUser.name }}
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

        <div class="space-y-3 text-sm mb-6">
          <div class="flex justify-between border-b border-white/5 pb-3">
            <span class="text-white/35 text-xs">Correo</span>
            <span class="text-white/80">{{ selectedUser.email }}</span>
          </div>

          <div class="flex justify-between border-b border-white/5 pb-3">
            <span class="text-white/35 text-xs">Rol</span>
            <span class="text-white/80">{{ roleLabel(selectedUser.role) }}</span>
          </div>

          <div class="flex justify-between border-b border-white/5 pb-3">
            <span class="text-white/35 text-xs">Estado</span>
            <span
              :class="
                selectedUser.blocked
                  ? 'text-red-400/80'
                  : selectedUser.verified
                    ? 'text-emerald-400/80'
                    : 'text-amber-400/80'
              "
            >
              {{
                selectedUser.blocked
                  ? "Bloqueado"
                  : selectedUser.verified
                    ? "Verificado"
                    : "Sin verificar"
              }}
            </span>
          </div>

          <div class="flex justify-between border-b border-white/5 pb-3">
            <span class="text-white/35 text-xs">Registro</span>
            <span class="text-white/80">
              {{ longDate(selectedUser.createdAt) }}
            </span>
          </div>
        </div>

        <!-- RESUMEN -->
        <div class="grid grid-cols-3 gap-3 mb-6">
          <div
            class="bg-white/[0.02] border border-white/5 rounded-xl p-3 text-center"
          >
            <p class="text-[8px] uppercase tracking-[0.25em] text-white/30 mb-1">
              Citas
            </p>
            <p class="font-barber text-lg text-white">
              {{ selectedUser.appointmentsCount }}
            </p>
          </div>
          <div
            class="bg-white/[0.02] border border-white/5 rounded-xl p-3 text-center"
          >
            <p class="text-[8px] uppercase tracking-[0.25em] text-white/30 mb-1">
              Gastado
            </p>
            <p class="font-barber text-lg text-[#ffb700]">
              {{ formatCurrency(selectedUser.totalSpent) }}
            </p>
          </div>
          <div
            class="bg-white/[0.02] border border-white/5 rounded-xl p-3 text-center"
          >
            <p class="text-[8px] uppercase tracking-[0.25em] text-white/30 mb-1">
              Última
            </p>
            <p class="font-barber text-xs text-white/80 mt-1">
              {{ shortDate(selectedUser.lastAppointment) }}
            </p>
          </div>
        </div>

        <!-- HISTORIAL -->
        <div class="mb-2">
          <p class="text-[9px] uppercase tracking-[0.3em] text-white/35 mb-3">
            Historial reciente
          </p>

          <div
            v-if="selectedUser.appointments.length"
            class="space-y-2 max-h-64 overflow-y-auto pr-1"
          >
            <div
              v-for="cita in selectedUser.appointments"
              :key="cita._id"
              class="flex items-center justify-between bg-white/[0.02] border border-white/5 rounded-lg px-4 py-3"
            >
              <div class="min-w-0">
                <p class="text-white/80 text-xs font-barber truncate">
                  {{ cita.services.join(" · ") }}
                </p>
                <p class="text-white/35 text-[10px] mt-0.5">
                  {{ longDate(cita.date) }} · {{ cita.time }} ·
                  {{ cita.barber }}
                </p>
              </div>

              <div class="text-right shrink-0 ml-3">
                <p class="text-[#ffb700] text-xs font-barber">
                  {{ formatCurrency(cita.total) }}
                </p>
                <p
                  :class="[
                    'text-[9px] uppercase tracking-[0.15em] mt-0.5',
                    isPast(cita.date) ? 'text-white/25' : 'text-emerald-400/70',
                  ]"
                >
                  {{ isPast(cita.date) ? "Pasada" : "Próxima" }}
                </p>
              </div>
            </div>
          </div>

          <p v-else class="text-white/25 text-xs italic">
            Este usuario no tiene citas registradas.
          </p>
        </div>

        <div
          class="flex flex-col sm:flex-row justify-end gap-2 mt-6 pt-5 border-t border-white/5"
        >
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 border border-white/10 text-white/60 hover:text-white hover:border-white/25 text-[10px] uppercase tracking-[0.2em] rounded-lg transition"
          >
            Cerrar
          </button>

          <button
            v-if="canChangeRole(selectedUser)"
            type="button"
            @click="openModal('role', selectedUser)"
            class="px-4 py-2 border border-[#ffb700]/30 text-[#ffb700]/90 hover:text-black hover:bg-[#ffb700] text-[10px] uppercase tracking-[0.2em] rounded-lg transition"
          >
            Cambiar rol
          </button>
        </div>
      </div>
    </div>

    <!-- ============ MODAL ROL ============ -->
    <div
      v-if="activeModal === 'role' && selectedUser"
      class="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/75 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <div
        class="w-full max-w-md bg-[#0b0b0b] border border-white/10 rounded-2xl p-6"
      >
        <p
          class="text-[9px] uppercase tracking-[0.3em] text-[#ffb700] font-medium mb-2"
        >
          Cambiar rol
        </p>
        <h2 class="text-lg font-barber uppercase text-white mb-3">
          {{ selectedUser.name }}
        </h2>

        <p class="text-white/45 text-xs leading-relaxed mb-5">
          Elige el nuevo rol para este usuario. Los cambios de rol afectan
          directamente los permisos y el acceso al sistema.
        </p>

        <div class="space-y-2 mb-6">
          <button
            v-for="role in roleOptions"
            :key="role.value"
            type="button"
            @click="selectedRole = role.value"
            :class="[
              'w-full text-left px-4 py-3 rounded-xl border transition-all duration-200',
              selectedRole === role.value
                ? 'bg-[#ffb700]/10 border-[#ffb700]/50'
                : 'bg-white/[0.02] border-white/10 hover:border-white/25',
            ]"
          >
            <div class="flex items-center justify-between">
              <div>
                <p
                  :class="[
                    'text-xs font-barber uppercase tracking-[0.15em]',
                    selectedRole === role.value
                      ? 'text-[#ffb700]'
                      : 'text-white/85',
                  ]"
                >
                  {{ role.label }}
                </p>
                <p class="text-white/35 text-[10px] mt-1">
                  {{ role.description }}
                </p>
              </div>

              <div
                :class="[
                  'w-5 h-5 rounded-full border flex items-center justify-center shrink-0',
                  selectedRole === role.value
                    ? 'bg-[#ffb700] border-[#ffb700] text-black'
                    : 'border-white/20 text-transparent',
                ]"
              >
                <svg
                  class="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2.5"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          </button>
        </div>

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
            :disabled="!selectedRole || selectedRole === selectedUser.role"
            @click="handleChangeRole"
            class="px-4 py-2 bg-[#ffb700] text-black text-[10px] uppercase tracking-[0.2em] font-medium rounded-lg hover:bg-[#ffb700]/90 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>

    <!-- ============ MODAL BLOQUEAR ============ -->
    <div
      v-if="activeModal === 'block' && selectedUser"
      class="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <div
        class="w-full max-w-md bg-[#0b0b0b] border border-white/10 rounded-2xl p-6"
      >
        <p
          class="text-[9px] uppercase tracking-[0.3em] text-red-400/80 font-medium mb-2"
        >
          Confirmar bloqueo
        </p>
        <h2 class="text-lg font-barber uppercase text-white mb-3">
          ¿Bloquear a {{ selectedUser.name }}?
        </h2>

        <p class="text-white/45 text-xs leading-relaxed mb-4">
          El usuario no podrá iniciar sesión ni reservar nuevas citas. Si tiene
          citas futuras, se cancelarán automáticamente y se notificará al
          cliente y al barbero.
        </p>

        <div
          v-if="selectedUser.futureAppointmentsCount > 0"
          class="bg-red-500/5 border border-red-500/20 rounded-xl px-4 py-3 mb-5"
        >
          <p class="text-red-400/80 text-xs">
            <span class="font-medium">
              {{ selectedUser.futureAppointmentsCount }}
              {{
                selectedUser.futureAppointmentsCount === 1 ? "cita" : "citas"
              }}
            </span>
            serán canceladas.
          </p>
        </div>

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
            @click="handleBlock(true)"
            class="px-4 py-2 bg-red-500/90 text-white text-[10px] uppercase tracking-[0.2em] font-medium rounded-lg hover:bg-red-500 transition"
          >
            Sí, bloquear
          </button>
        </div>
      </div>
    </div>

    <!-- ============ MODAL DESBLOQUEAR ============ -->
    <div
      v-if="activeModal === 'unblock' && selectedUser"
      class="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/75 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <div
        class="w-full max-w-md bg-[#0b0b0b] border border-white/10 rounded-2xl p-6"
      >
        <p
          class="text-[9px] uppercase tracking-[0.3em] text-emerald-400/80 font-medium mb-2"
        >
          Confirmar desbloqueo
        </p>
        <h2 class="text-lg font-barber uppercase text-white mb-3">
          ¿Desbloquear a {{ selectedUser.name }}?
        </h2>

        <p class="text-white/45 text-xs leading-relaxed mb-6">
          El usuario podrá volver a iniciar sesión y reservar nuevas citas
          normalmente. Sus citas anteriores no se restauran.
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
            @click="handleBlock(false)"
            class="px-4 py-2 bg-emerald-500/90 text-white text-[10px] uppercase tracking-[0.2em] font-medium rounded-lg hover:bg-emerald-500 transition"
          >
            Sí, desbloquear
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useAdminStore, type AdminUser } from "@/stores/admin";
import { useUserStore } from "@/stores/user";
import { formatCurrency } from "@/helpers";
import { useToast } from "vue-toast-notification";

const adminStore = useAdminStore();
const userStore = useUserStore();
const toast = useToast();

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

const shortDate = (iso: string | null) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}`;
};

const longDate = (iso: string | null) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return `${d.getDate()} de ${MESES_LARGO[d.getMonth()]} de ${d.getFullYear()}`;
};

const isPast = (dateIso: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateIso);
  return d < today;
};

const initialOf = (name: string) =>
  name?.trim().charAt(0).toUpperCase() || "?";

const roleLabel = (role: string) => {
  if (role === "admin") return "Admin";
  if (role === "barber") return "Barbero";
  return "Cliente";
};

/* =========================================================
   PERMISOS: quién puede hacer qué
   ========================================================= */
const currentUserId = computed(() => userStore.user?._id);

const canChangeRole = (target: AdminUser) => {
  if (target.protected) return false;
  if (target._id === currentUserId.value) return false;
  return true;
};

const canBlock = (target: AdminUser) => {
  if (target.protected) return false;
  if (target._id === currentUserId.value) return false;
  return true;
};

/* =========================================================
   FILTROS
   ========================================================= */
const search = ref("");
const filterStatus = ref<"" | "active" | "blocked" | "unverified">("");
const quickFilter = ref<"todos" | "con_citas" | "sin_citas" | "bloqueados">(
  "todos",
);

const quickOptions = [
  { value: "todos" as const, label: "Todos" },
  { value: "con_citas" as const, label: "Con citas" },
  { value: "sin_citas" as const, label: "Sin citas" },
  { value: "bloqueados" as const, label: "Bloqueados" },
];

const clearFilters = () => {
  search.value = "";
  filterStatus.value = "";
  quickFilter.value = "todos";
};

/* =========================================================
   COMPUTED
   ========================================================= */
const filteredUsers = computed(() => {
  const text = search.value.trim().toLowerCase();

  return adminStore.users.filter((u) => {
    if (text) {
      const name = u.name.toLowerCase();
      const email = u.email.toLowerCase();
      if (!name.includes(text) && !email.includes(text)) return false;
    }

    if (filterStatus.value === "active" && u.blocked) return false;
    if (filterStatus.value === "blocked" && !u.blocked) return false;
    if (filterStatus.value === "unverified" && u.verified) return false;

    if (quickFilter.value === "con_citas" && u.appointmentsCount === 0)
      return false;
    if (quickFilter.value === "sin_citas" && u.appointmentsCount > 0)
      return false;
    if (quickFilter.value === "bloqueados" && !u.blocked) return false;

    return true;
  });
});

const statistics = computed(() => {
  const total = adminStore.users.length;
  const verificados = adminStore.users.filter((u) => u.verified).length;
  const bloqueados = adminStore.users.filter((u) => u.blocked).length;

  const now = Date.now();
  const nuevos = adminStore.users.filter((u) => {
    const d = new Date(u.createdAt).getTime();
    return now - d <= 30 * 24 * 60 * 60 * 1000;
  }).length;

  return [
    { label: "Total", value: total, detail: "Usuarios registrados" },
    { label: "Verificados", value: verificados, detail: "Cuenta confirmada" },
    { label: "Nuevos", value: nuevos, detail: "Últimos 30 días" },
    { label: "Bloqueados", value: bloqueados, detail: "Sin acceso" },
  ];
});

/* =========================================================
   MODALES
   ========================================================= */
const activeModal = ref<null | "detail" | "role" | "block" | "unblock">(null);
const selectedUser = ref<AdminUser | null>(null);
const selectedRole = ref<"client" | "barber" | "admin">("client");

const roleOptions = [
  {
    value: "client" as const,
    label: "Cliente",
    description: "Solo puede reservar citas",
  },
  {
    value: "barber" as const,
    label: "Barbero",
    description: "Gestiona su horario y sus citas asignadas",
  },
  {
    value: "admin" as const,
    label: "Administrador",
    description: "Acceso completo al panel de administración",
  },
];

const openModal = (
  modal: "detail" | "role" | "block" | "unblock",
  user: AdminUser,
) => {
  selectedUser.value = user;
  activeModal.value = modal;

  if (modal === "role") {
    selectedRole.value = user.role;
  }
};

const closeModal = () => {
  activeModal.value = null;
  selectedUser.value = null;
  selectedRole.value = "client";
};

/* =========================================================
   ACCIONES
   ========================================================= */
const handleChangeRole = async () => {
  if (!selectedUser.value || !selectedRole.value) return;

  const success = await adminStore.updateUserRole(
    selectedUser.value._id,
    selectedRole.value,
    toast,
  );

  if (success) closeModal();
};

const handleBlock = async (blocked: boolean) => {
  if (!selectedUser.value) return;

  const success = await adminStore.updateUserBlockStatus(
    selectedUser.value._id,
    blocked,
    toast,
  );

  if (success) closeModal();
};

/* =========================================================
   MOUNT
   ========================================================= */
onMounted(() => {
  adminStore.getAllUsers();
});
</script>

<style scoped></style>