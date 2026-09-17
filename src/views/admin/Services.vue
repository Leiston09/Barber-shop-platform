<!-- src/views/admin/Services.vue -->

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
            Servicios
          </h1>
          <p class="text-white/35 text-sm mt-2">
            Administra el catálogo de servicios y sus precios.
          </p>
        </div>

        <button
          type="button"
          @click="openModal('create')"
          class="inline-flex items-center gap-2 px-5 py-3 bg-[#ffb700] text-black text-[10px] uppercase tracking-[0.2em] font-medium rounded-xl hover:bg-[#e6a500] transition-all duration-300 shadow-lg shadow-[#ffb700]/10"
        >
          <svg
            class="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Nuevo servicio
        </button>
      </div>
    </div>

    <!-- LOADING -->
    <div
      v-if="serviceStore.loading"
      class="flex items-center justify-center py-20"
    >
      <div
        class="w-7 h-7 rounded-full border-2 border-white/10 border-t-[#ffb700] animate-spin"
      ></div>
    </div>

    <!-- ERROR -->
    <div
      v-else-if="serviceStore.error"
      class="py-12 text-center border border-dashed border-red-500/20 rounded-2xl"
    >
      <p class="text-red-400/70 text-sm">{{ serviceStore.error }}</p>
      <button
        type="button"
        @click="serviceStore.loadServices()"
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
              placeholder="Nombre del servicio"
              class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#ffb700]/50 transition"
            />
          </div>

          <div>
            <label
              class="text-[9px] uppercase tracking-[0.25em] text-white/30 block mb-2"
            >
              Ordenar por
            </label>
            <select
              v-model="sortBy"
              class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ffb700]/50 transition"
            >
              <option value="name-asc">Nombre (A → Z)</option>
              <option value="name-desc">Nombre (Z → A)</option>
              <option value="price-asc">Precio (menor a mayor)</option>
              <option value="price-desc">Precio (mayor a menor)</option>
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
        <!-- Sin servicios -->
        <div
          v-if="serviceStore.services.length === 0"
          class="py-16 text-center border border-dashed border-white/10 rounded-2xl"
        >
          <div
            class="w-16 h-16 mx-auto rounded-full border border-white/10 flex items-center justify-center mb-4"
          >
            <svg
              class="w-7 h-7 text-white/20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z"
              />
            </svg>
          </div>
          <p class="text-white/40 text-sm">
            No hay servicios registrados todavía.
          </p>
          <button
            type="button"
            @click="openModal('create')"
            class="mt-4 text-[10px] uppercase tracking-[0.2em] text-[#ffb700]/80 hover:text-[#ffb700] transition"
          >
            Crear el primero
          </button>
        </div>

        <!-- Sin resultados por filtros -->
        <div
          v-else-if="filteredServices.length === 0"
          class="py-16 text-center border border-dashed border-white/10 rounded-2xl"
        >
          <p class="text-white/25 text-sm">
            No hay servicios que coincidan con los filtros.
          </p>
        </div>

        <!-- Grid -->
        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <article
            v-for="(service, index) in filteredServices"
            :key="service._id"
            class="group relative bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#ffb700]/30"
          >
            <!-- LÍNEA SUPERIOR (hover) -->
            <div
              class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ffb700] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />

            <!-- NÚMERO DECORATIVO -->
            <span
              class="absolute top-4 right-4 font-barber text-5xl text-white/[0.04] leading-none select-none"
            >
              {{ String(index + 1).padStart(2, "0") }}
            </span>

            <!-- CONTENIDO -->
            <div class="relative p-5 sm:p-6">
              <p
                class="text-[8px] uppercase tracking-[0.3em] text-[#ffb700] mb-3"
              >
                Servicio
              </p>

              <h3
                class="font-barber text-xl sm:text-2xl text-white font-light leading-snug mb-5 pr-12"
              >
                {{ service.name }}
              </h3>

              <!-- PRECIO -->
              <div class="pb-5 border-b border-white/5">
                <p
                  class="text-[8px] uppercase tracking-[0.25em] text-white/25 mb-1.5"
                >
                  Precio
                </p>
                <p class="font-barber text-3xl text-[#ffb700] leading-none">
                  {{ formatCurrency(service.price) }}
                </p>
              </div>

              <!-- META -->
              <div class="flex items-center justify-between pt-4">
                <p class="text-[10px] text-white/25">
                  Actualizado
                  <span class="text-white/40">
                    {{ shortDate(service.updatedAt) }}
                  </span>
                </p>

                <div class="flex items-center gap-1.5">
                  <button
                    type="button"
                    @click="openModal('edit', service)"
                    class="w-8 h-8 rounded-lg border border-white/10 text-white/45 hover:text-[#ffb700] hover:border-[#ffb700]/40 hover:bg-[#ffb700]/5 transition-all duration-200 flex items-center justify-center"
                    aria-label="Editar"
                  >
                    <svg
                      class="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>

                  <button
                    type="button"
                    @click="openModal('delete', service)"
                    class="w-8 h-8 rounded-lg border border-white/10 text-white/45 hover:text-red-400 hover:border-red-500/40 hover:bg-red-500/5 transition-all duration-200 flex items-center justify-center"
                    aria-label="Eliminar"
                  >
                    <svg
                      class="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </template>

    <!-- ============ MODAL CREAR / EDITAR ============ -->
    <div
      v-if="activeModal === 'create' || activeModal === 'edit'"
      class="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-black/80 backdrop-blur-sm overflow-y-auto"
      @click.self="closeModal"
    >
      <div
        class="w-full max-w-md bg-[#0b0b0b] border border-white/10 rounded-2xl p-6 my-auto relative"
      >
        <!-- LÍNEA DORADA SUPERIOR -->
        <div
          class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ffb700] to-transparent"
        />

        <div class="flex items-start justify-between mb-6">
          <div>
            <p
              class="text-[9px] uppercase tracking-[0.3em] text-[#ffb700] font-medium mb-1"
            >
              {{
                activeModal === "create" ? "Nuevo servicio" : "Editar servicio"
              }}
            </p>
            <h2 class="font-barber text-xl text-white font-light">
              {{
                activeModal === "create"
                  ? "Añade un nuevo servicio"
                  : selectedService?.name
              }}
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
          <!-- NOMBRE -->
          <div>
            <label
              class="text-[9px] uppercase tracking-[0.25em] text-white/30 block mb-2"
            >
              Nombre del servicio
            </label>
            <input
              v-model="form.name"
              type="text"
              maxlength="60"
              placeholder="Ej: Corte clásico"
              class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#ffb700]/50 transition"
            />
            <p class="text-[10px] text-white/25 mt-2 text-right">
              {{ form.name.length }} / 60
            </p>
          </div>

          <!-- PRECIO -->
          <div>
            <label
              class="text-[9px] uppercase tracking-[0.25em] text-white/30 block mb-2"
            >
              Precio
            </label>
            <div class="relative">
              <span
                class="absolute left-4 top-1/2 -translate-y-1/2 text-[#ffb700] text-sm font-barber"
              >
                $
              </span>
              <input
                v-model.number="form.price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                class="w-full bg-black/40 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#ffb700]/50 transition font-barber"
              />
            </div>
          </div>

          <!-- VISTA PREVIA -->
          <div
            v-if="form.name || form.price > 0"
            class="border border-white/5 rounded-xl bg-white/[0.02] p-4"
          >
            <p class="text-[8px] uppercase tracking-[0.25em] text-white/25 mb-2">
              Vista previa
            </p>
            <div class="flex items-center justify-between gap-4">
              <p class="text-white/85 text-sm font-barber truncate">
                {{ form.name || "Nombre del servicio" }}
              </p>
              <p class="font-barber text-xl text-[#ffb700] shrink-0">
                {{ formatCurrency(form.price || 0) }}
              </p>
            </div>
          </div>

          <!-- META (solo editar) -->
          <p
            v-if="activeModal === 'edit' && selectedService"
            class="text-[10px] text-white/25"
          >
            Creado el {{ longDate(selectedService.createdAt) }} · Última
            actualización {{ shortDate(selectedService.updatedAt) }}
          </p>
        </div>

        <div
          class="flex flex-col sm:flex-row justify-end gap-2 mt-6 pt-5 border-t border-white/5"
        >
          <button
            type="button"
            @click="closeModal"
            :disabled="saving"
            class="px-5 py-2.5 border border-white/10 text-white/55 hover:text-white hover:border-white/25 text-[10px] uppercase tracking-[0.2em] rounded-lg transition disabled:opacity-40"
          >
            Cancelar
          </button>

          <button
            type="button"
            :disabled="!canSubmit || saving"
            @click="handleSubmit"
            class="px-5 py-2.5 bg-[#ffb700] text-black text-[10px] uppercase tracking-[0.2em] font-medium rounded-lg hover:bg-[#ffb700]/90 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {{
              saving
                ? "Guardando..."
                : activeModal === "create"
                  ? "Crear servicio"
                  : "Guardar cambios"
            }}
          </button>
        </div>
      </div>
    </div>

    <!-- ============ MODAL ELIMINAR ============ -->
    <div
      v-if="activeModal === 'delete' && selectedService"
      class="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <div
        class="w-full max-w-md bg-[#0b0b0b] border border-white/10 rounded-2xl p-6 relative"
      >
        <div
          class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/60 to-transparent"
        />

        <p
          class="text-[9px] uppercase tracking-[0.3em] text-red-400/80 font-medium mb-2"
        >
          Confirmar eliminación
        </p>
        <h2 class="text-lg font-barber uppercase text-white mb-3">
          ¿Eliminar "{{ selectedService.name }}"?
        </h2>

        <p class="text-white/45 text-xs leading-relaxed mb-5">
          Esta acción no se puede deshacer. El servicio desaparecerá del
          catálogo y ya no estará disponible para nuevas reservas.
        </p>

        <div
          class="bg-red-500/5 border border-red-500/20 rounded-xl px-4 py-3 mb-6"
        >
          <p class="text-red-400/80 text-[11px] leading-relaxed">
            Si hay citas activas que incluyen este servicio, podrían verse
            afectadas. Verifica antes de continuar.
          </p>
        </div>

        <div class="flex flex-col sm:flex-row justify-end gap-2">
          <button
            type="button"
            @click="closeModal"
            :disabled="saving"
            class="px-5 py-2.5 border border-white/10 text-white/55 hover:text-white hover:border-white/25 text-[10px] uppercase tracking-[0.2em] rounded-lg transition disabled:opacity-40"
          >
            Cancelar
          </button>

          <button
            type="button"
            :disabled="saving"
            @click="handleDelete"
            class="px-5 py-2.5 bg-red-500/90 text-white text-[10px] uppercase tracking-[0.2em] font-medium rounded-lg hover:bg-red-500 transition disabled:opacity-40"
          >
            {{ saving ? "Eliminando..." : "Sí, eliminar" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useServiceStore, type Service } from "@/stores/service";
import { useToast } from "vue-toast-notification";
import { formatCurrency } from "@/helpers";

const serviceStore = useServiceStore();
const toast = useToast();

/* =========================================================
   HELPERS DE FECHA
   ========================================================= */
const MESES = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];
const MESES_LARGO = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

const shortDate = (iso?: string | null) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}`;
};

const longDate = (iso?: string | null) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return `${d.getDate()} de ${MESES_LARGO[d.getMonth()]} de ${d.getFullYear()}`;
};

/* =========================================================
   FILTROS
   ========================================================= */
const search = ref("");
const sortBy = ref<"name-asc" | "name-desc" | "price-asc" | "price-desc">(
  "name-asc",
);
const quickFilter = ref<"todos" | "economicos" | "premium">("todos");

const quickOptions = [
  { value: "todos" as const, label: "Todos" },
  { value: "economicos" as const, label: "Hasta $5" },   
  { value: "premium" as const, label: "Más de $5" },    
];

const clearFilters = () => {
  search.value = "";
  sortBy.value = "name-asc";
  quickFilter.value = "todos";
};

/* =========================================================
   COMPUTED
   ========================================================= */
const filteredServices = computed(() => {
  const text = search.value.trim().toLowerCase();

  const filtered = serviceStore.services.filter((s) => {
    if (text && !s.name.toLowerCase().includes(text)) return false;
    if (quickFilter.value === "economicos" && s.price > 5) return false;
    if (quickFilter.value === "premium" && s.price <= 5) return false;
    return true;
  });

  return [...filtered].sort((a, b) => {
    switch (sortBy.value) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      default:
        return 0;
    }
  });
});

const statistics = computed(() => {
  const total = serviceStore.services.length;

  if (total === 0) {
    return [
      { label: "Total", value: 0, detail: "Servicios registrados" },
      { label: "Promedio", value: "$0", detail: "Precio medio" },
      { label: "Más económico", value: "$0", detail: "Precio mínimo" },
      { label: "Más caro", value: "$0", detail: "Precio máximo" },
    ];
  }

  const prices = serviceStore.services.map((s) => s.price);
  const avg = prices.reduce((sum, p) => sum + p, 0) / total;
  const min = Math.min(...prices);
  const max = Math.max(...prices);

  return [
    { label: "Total", value: total, detail: "Servicios registrados" },
    {
      label: "Promedio",
      value: formatCurrency(avg),
      detail: "Precio medio",
    },
    {
      label: "Más económico",
      value: formatCurrency(min),
      detail: "Precio mínimo",
    },
    {
      label: "Más caro",
      value: formatCurrency(max),
      detail: "Precio máximo",
    },
  ];
});

/* =========================================================
   MODALES
   ========================================================= */
const activeModal = ref<null | "create" | "edit" | "delete">(null);
const selectedService = ref<Service | null>(null);
const saving = ref(false);

const form = ref({
  name: "",
  price: 0,
});

const canSubmit = computed(() => {
  return form.value.name.trim().length > 0 && form.value.price > 0;
});

const openModal = (
  modal: "create" | "edit" | "delete",
  service?: Service,
) => {
  activeModal.value = modal;

  if (modal === "create") {
    selectedService.value = null;
    form.value = { name: "", price: 0 };
  } else if (service) {
    selectedService.value = service;
    form.value = { name: service.name, price: service.price };
  }
};

const closeModal = () => {
  activeModal.value = null;
  selectedService.value = null;
  form.value = { name: "", price: 0 };
  saving.value = false;
};

/* =========================================================
   GUARDAR (crear o actualizar)
   ========================================================= */
const handleSubmit = async () => {
  if (!canSubmit.value) return;

  saving.value = true;

  const payload = {
    name: form.value.name.trim(),
    price: Number(form.value.price),
  };

  let success = false;

  if (activeModal.value === "create") {
    success = await serviceStore.createService(payload, toast);
  } else if (activeModal.value === "edit" && selectedService.value) {
    success = await serviceStore.updateService(
      selectedService.value._id,
      payload,
      toast,
    );
  }

  saving.value = false;

  if (success) closeModal();
};

/* =========================================================
   ELIMINAR
   ========================================================= */
const handleDelete = async () => {
  if (!selectedService.value) return;

  saving.value = true;

  const success = await serviceStore.deleteService(
    selectedService.value._id,
    toast,
  );

  saving.value = false;

  if (success) closeModal();
};

/* =========================================================
   MOUNT
   ========================================================= */
onMounted(() => {
  serviceStore.loadServices();
});
</script>

<style scoped></style>