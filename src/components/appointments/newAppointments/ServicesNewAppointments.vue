<template>
  <section
    aria-labelledby="services-title"
    class="service-selection space-y-4 sm:space-y-5"
  >
    <div class="flex items-start justify-between gap-4"><div class="min-w-0">
      <h2 id="services-title" class="booking-title font-barber text-[clamp(1.8rem,3.5vw,3rem)] font-normal leading-[1.15] text-balance">
        Elige tus <span class="text-[#ffb700]">servicios.</span>
      </h2>
      <p class="booking-description mt-2.5 max-w-[42rem] text-[.9375rem] leading-[1.7] text-[#aaa]">
        Elige hasta {{ settings.maxServicesPerAppointment }} {{ settings.maxServicesPerAppointment === 1 ? "servicio" : "servicios" }} para tu turno de 60 minutos.
      </p>
    </div><ServicePromotions @select="showOffer" /></div>
    <!-- <div
      class="booking-panel service-context flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm rounded-2xl border border-[#ffffff12] bg-[#101010] p-5 max-[360px]:p-3.5 max-sm:p-3.5!"
    >
      <p>
        <span class="text-[#ffb700]">{{ booking.barber?.name }}</span> ·
        {{ shortDate }} · {{ booking.time }}
      </p>
      <RouterLink class="booking-link text-sm text-[#ffbf28] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-[#ffb700] focus-visible:outline-offset-4" :to="{ name: 'BarberSelect' }"
        >Cambiar barbero</RouterLink
      >
    </div> -->
    <div v-if="serviceStore.loading" class="booking-message rounded-2xl border border-[#ffffff16] bg-[#111] p-6 text-[.9375rem] leading-[1.6] text-[#ccc]" role="status">
      Cargando servicios y precios…
    </div>
    <div v-else-if="serviceStore.error" class="booking-message rounded-2xl border border-[#ffffff16] bg-[#111] p-6 text-[.9375rem] leading-[1.6] text-[#ccc]" role="alert">
      <p>
        No pudimos cargar los servicios. Tu selección de horario se conserva.
      </p>
      <button class="booking-link mt-3 text-sm text-[#ffbf28] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-[#ffb700] focus-visible:outline-offset-4" @click="serviceStore.loadServices()">
        Reintentar
      </button>
    </div>
    <div v-else-if="!serviceStore.services.length" class="booking-message rounded-2xl border border-[#ffffff16] bg-[#111] p-6 text-[.9375rem] leading-[1.6] text-[#ccc]">
      Por ahora no hay servicios disponibles. Vuelve a consultar más tarde.
    </div>
    <template v-else>
      <div class="space-y-3">
        <label for="booking-service-search" class="block text-sm text-white/80"
          >Buscar un servicio</label
        >
        <div
          class="flex items-center gap-3 rounded-xl border border-white/20 bg-[#111] px-3 focus-within:border-[#ffb700] focus-within:ring-1 focus-within:ring-[#ffb700]"
        >
          <svg
            class="size-5 shrink-0 text-white/50"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            aria-hidden="true"
          >
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m16 16 4 4" />
          </svg>
          <input
            id="booking-service-search"
            v-model="search"
            type="search"
            autocomplete="off"
            placeholder="Ej.: corte, barba…"
            class="min-w-0 flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-white/40"
            aria-controls="booking-service-results"
          />
          <button
            v-if="search"
            type="button"
            @click="clearSearch"
            class="min-h-11 px-1 text-xs text-[#ffb700]"
            aria-label="Borrar búsqueda"
          >
            Limpiar
          </button>
        </div>
        <div
          class="flex flex-wrap justify-between gap-2 text-xs text-white/65"
          role="status"
          aria-live="polite"
        >
          <p>
            {{ filteredServices.length }}
            {{ filteredServices.length === 1 ? "servicio" : "servicios"
            }}{{ search.trim() ? " encontrados" : " disponibles" }}
          </p>
          <p>{{ booking.services.length }} de {{ settings.maxServicesPerAppointment }} seleccionados</p>
        </div>
        <p
          v-if="booking.services.length >= settings.maxServicesPerAppointment"
          class="text-xs text-[#ffb700]/85"
        >
          Máximo {{ settings.maxServicesPerAppointment }} {{ settings.maxServicesPerAppointment === 1 ? "servicio" : "servicios" }}. Quita uno para cambiarlo.
        </p>
        <div
          v-if="booking.services.length && search.trim()"
          class="flex flex-wrap gap-2"
          aria-label="Servicios seleccionados"
        >
          <button
            v-for="service in booking.services"
            :key="service._id"
            type="button"
            @click="booking.deleteService(service._id)"
            class="max-w-full break-words rounded-full border border-[#ffb700]/30 bg-[#ffb700]/5 px-3 py-2 text-xs text-[#ffb700]"
            :aria-label="'Quitar ' + service.name"
          >
            {{ service.name }} <span aria-hidden="true" class="ml-1">×</span>
          </button>
        </div>
      </div>
      <div id="booking-service-results">
        <div v-if="filteredServices.length" class="grid gap-3 sm:grid-cols-2">
          <ServiceItem
            v-for="service in filteredServices"
            :key="service._id"
            :service="service"
          />
        </div>
        <div v-else class="booking-message rounded-2xl border border-[#ffffff16] bg-[#111] p-6 text-[.9375rem] leading-[1.6] text-[#ccc]">
          <p>No encontramos servicios con «{{ search.trim() }}».</p>
          <button type="button" class="booking-link mt-3 text-sm text-[#ffbf28] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-[#ffb700] focus-visible:outline-offset-4" @click="clearSearch">
            Ver todos los servicios
          </button>
        </div>
      </div>
    </template>
  </section>
</template>
<script setup lang="ts">
import { useSettingsStore } from "@/stores/settings";
import { computed, nextTick, ref } from "vue";
import { RouterLink } from "vue-router";
import ServicePromotions from "@/components/UI/ServicePromotions.vue";
import type { Service } from "@/stores/service";
import ServiceItem from "@/components/UI/ServiceItem.vue";
import { useServiceStore } from "@/stores/service";
import { useAppointmentBookingStore } from "@/stores/appointmentCreator";
const settings = useSettingsStore();
const serviceStore = useServiceStore();
const booking = useAppointmentBookingStore();
const search = ref("");
async function showOffer(service: Service) {
  search.value = service.name;
  await nextTick();
  const item = document.querySelector<HTMLElement>('[data-service-id="' + service._id + '"]');
  item?.scrollIntoView({ block: "center" }); item?.focus({ preventScroll: true });
}
const shortDate = computed(() =>
  booking.date
    ? new Intl.DateTimeFormat("es-EC", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }).format(new Date(booking.date + "T12:00:00"))
    : "",
);
const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es");
const filteredServices = computed(() => {
  const words = normalize(search.value).trim().split(/\s+/).filter(Boolean);
  return serviceStore.services.filter((service) =>
    words.every((word) => normalize(service.name + " " + (service.description ?? "")).includes(word)),
  );
});
async function clearSearch() {
  search.value = "";
  await nextTick();
  document.getElementById("booking-service-search")?.focus();
}
</script>
