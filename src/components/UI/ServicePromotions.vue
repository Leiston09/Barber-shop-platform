<template>
  <div v-if="presentation === 'bell' || offers.length" ref="root" :class="presentation === 'bell' ? 'relative shrink-0' : 'mt-6'">
    <template v-if="presentation === 'bell'">
      <button ref="bell" type="button" :disabled="!offers.length" :aria-expanded="open" :aria-controls="panelId" :aria-label="offers.length ? offers.length + ' promociones disponibles' : 'Sin promociones vigentes'" @click="open = !open" class="relative flex size-11 items-center justify-center rounded-xl border border-white/15 bg-[#111] text-white/65 hover:border-[#ffb700]/40 hover:text-[#ffb700] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb700] disabled:cursor-default disabled:text-white/30">
        <svg aria-hidden="true" class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></svg>
        <span v-if="offers.length" aria-hidden="true" class="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-[#ffb700] px-1 text-[10px] font-semibold leading-5 text-black">{{ offers.length }}</span>
      </button>
      <div v-if="open && offers.length" :id="panelId" role="region" aria-label="Promociones vigentes" class="absolute right-0 top-14 z-50 max-h-[65dvh] w-[min(320px,calc(100vw-2.5rem))] overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-xl border border-white/20 bg-[#111] p-4 text-left text-white shadow-2xl">
        <p class="mb-3 text-sm font-medium">Promociones vigentes</p>
        <ul class="space-y-3"><li v-for="service in offers" :key="service._id" class="overflow-hidden rounded-xl border border-white/10 bg-white/[0.025]">
          <div class="flex items-center gap-3 p-3"><ServicePhoto :id="service._id" :name="service.name" :revision="service.photoUpdatedAt" class="size-14 shrink-0 rounded-lg" /><div class="min-w-0"><p class="text-[11px] font-medium text-[#ffb700]">{{ promotionLabel(service.promotion!) }}</p><h3 class="mt-1 break-words text-sm font-medium">{{ service.name }}</h3></div></div>
          <div class="px-3 pb-3"><p class="text-xs leading-5 text-white/55">{{ service.promotion?.title }}</p><div class="mt-3 flex items-end justify-between gap-2"><p><span class="block text-lg font-semibold tabular-nums text-white">{{ formatCurrency(service.price) }}</span><del class="text-xs text-white/35">{{ formatCurrency(service.basePrice!) }}</del></p><button type="button" @click="select(service)" class="min-h-10 rounded-lg border border-[#ffb700]/35 px-3 text-xs font-medium text-[#ffb700] hover:bg-[#ffb700]/5 focus-visible:outline-2 focus-visible:outline-[#ffb700]">Ver servicio</button></div><p class="mt-3 text-[10px] leading-5 text-white/40">Disponible hasta {{ promotionDate(service.promotion!.endsAt) }}</p></div>
        </li></ul>
        <p class="mt-3 text-[11px] leading-5 text-white/40">El descuento se aplica al confirmar dentro del periodo indicado.</p>
      </div>
    </template>
    <section v-else aria-labelledby="public-offers-title" class="rounded-2xl border border-[#ffb700]/20 bg-neutral-900/50 p-4 sm:p-5">
      <h2 id="public-offers-title" class="font-barber text-xl text-white">Promociones vigentes</h2>
      <div class="mt-4 grid gap-3 sm:grid-cols-2"><article v-for="service in offers" :key="service._id" class="rounded-xl bg-white/[0.035] p-4"><p class="text-xs text-[#ffb700]">{{ promotionLabel(service.promotion!) }}</p><h3 class="mt-2 break-words text-base font-medium text-white">{{ service.name }}</h3><p class="mt-1 text-xs leading-5 text-white/50">{{ service.promotion?.title }}</p><p class="mt-3 flex items-baseline gap-3"><span class="text-xl text-[#ffb700]">{{ formatCurrency(service.price) }}</span><del class="text-sm text-white/35">{{ formatCurrency(service.basePrice!) }}</del></p><p class="mt-2 text-xs leading-5 text-white/40">Hasta {{ promotionDate(service.promotion!.endsAt) }}</p><RouterLink :to="{ name: 'AppointmentSlot' }" class="mt-3 inline-flex min-h-11 items-center text-sm text-[#ffb700]">Reservar una cita</RouterLink></article></div>
      <p class="mt-4 text-xs leading-5 text-white/45">Válidas al confirmar la reserva durante el periodo indicado.</p>
    </section>
  </div>
</template>
<script setup lang="ts">
import ServicePhoto from "@/components/UI/ServicePhoto.vue";
import { computed, onBeforeUnmount, onMounted, ref, useId, watch } from "vue";
import { useServiceStore, type Service } from "@/stores/service";
import { formatCurrency } from "@/helpers";
import { isCurrentPromotion, promotionDate, promotionLabel } from "@/helpers/promotions";
withDefaults(defineProps<{ presentation?: "bell" | "list" }>(), { presentation: "bell" });
const emit = defineEmits<{ select: [service: Service] }>();
const serviceStore = useServiceStore(), clock = ref(Date.now()), open = ref(false), root = ref<HTMLElement>(), bell = ref<HTMLButtonElement>();
const panelId = useId();
const offers = computed(() => serviceStore.services.filter(service => isCurrentPromotion(service, clock.value)));
let stop: (() => void) | undefined, timer: ReturnType<typeof setInterval> | undefined;
function select(service: Service) { open.value = false; emit("select", service); }
function outside(event: Event) { if (!root.value?.contains(event.target as Node)) open.value = false; }
function keydown(event: KeyboardEvent) { if (event.key === "Escape" && open.value) { open.value = false; bell.value?.focus(); } }
watch(offers, value => { if (!value.length) open.value = false; });
onMounted(() => { stop = serviceStore.observeCatalog(); timer = setInterval(() => { clock.value = Date.now(); }, 1000); document.addEventListener("pointerdown", outside); document.addEventListener("keydown", keydown); });
onBeforeUnmount(() => { stop?.(); if (timer) clearInterval(timer); document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", keydown); });
</script>
