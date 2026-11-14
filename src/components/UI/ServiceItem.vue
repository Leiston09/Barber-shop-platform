<template>
  <button
    type="button"
    :data-service-id="service._id"
    class="booking-choice service-card w-full text-left rounded-[.875rem] border border-[#ffffff20] bg-[#111] transition-[border-color,background-color] duration-150 enabled:hover:border-[#ffb700] enabled:hover:bg-[#ffb70008] aria-pressed:border-[#ffb700] aria-pressed:bg-[#ffb70008] focus-visible:outline-2 focus-visible:outline-[#ffb700] focus-visible:outline-offset-4 disabled:opacity-[.45] motion-reduce:transition-none flex items-center gap-3.5 overflow-hidden"
    :aria-pressed="selected"
    :disabled="!selected && booking.services.length >= settings.maxServicesPerAppointment"
    @click="booking.onServiceSelect(service)"
  >
    <ServicePhoto :id="service._id" :name="service.name" :revision="service.photoUpdatedAt" class="flex-[0_0_80px] self-stretch min-h-[104px] border-r border-white/10 sm:basis-[88px]" />
    <span class="min-w-0 flex-1 py-3 pr-3 sm:pr-4">
      <span class="flex items-start justify-between gap-2">
        <span
          class="min-w-0 text-base font-medium leading-snug text-white break-words"
          >{{ service.name }}</span
        >
        <span
          class="selection-mark flex size-5 shrink-0 items-center justify-center rounded-full border text-xs"
          :class="
            selected
              ? 'border-[#ffb700] bg-[#ffb700] text-black'
              : 'border-white/25 text-white/40'
          "
          aria-hidden="true"
          >{{ selected ? "✓" : " " }}</span
        >
      </span>
      <span v-if="service.promotion && service.basePrice !== undefined" class="mt-1 block text-[11px] text-[#ffb700]">{{ service.promotion.title }} · {{ service.promotion.kind === 'percentage' ? service.promotion.value + ' % menos' : 'Precio especial' }}</span>
      <span v-if="service.description" class="mt-1 block line-clamp-2 text-xs leading-5 text-white/50">{{ service.description }}</span>
      <del v-if="service.promotion && service.basePrice !== undefined" class="mt-1 block text-xs text-white/35">{{ formatCurrency(service.basePrice) }}</del>
      <span class="mt-1 block text-sm font-medium text-[#ffb700]">{{
        formatCurrency(service.price)
      }}</span>
      <span
        class="mt-1 block text-xs leading-relaxed"
        :class="selected ? 'text-[#ffb700]/85' : 'text-white/55'"
        >{{
          selected
            ? "Seleccionado · Quitar"
            : booking.services.length >= settings.maxServicesPerAppointment
              ? "Máximo " + settings.maxServicesPerAppointment + (settings.maxServicesPerAppointment === 1 ? " servicio" : " servicios")
              : "Añadir servicio"
        }}</span
      >
    </span>
  </button>
</template>
<script setup lang="ts">
import ServicePhoto from "@/components/UI/ServicePhoto.vue";
import { useSettingsStore } from "@/stores/settings";
import { computed } from "vue";
import { formatCurrency } from "@/helpers";
import { useAppointmentBookingStore } from "@/stores/appointmentCreator";
import type { Service } from "@/stores/service";
const props = defineProps<{ service: Service }>();
const booking = useAppointmentBookingStore();
const settings = useSettingsStore();
const selected = computed(() => booking.isServiceSelected(props.service._id));
</script>
