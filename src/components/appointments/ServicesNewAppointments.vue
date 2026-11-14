<template>
  <div
    class="booking-flow grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px] text-[#ededed] [&_button]:cursor-pointer [&_button:disabled]:cursor-not-allowed"
    :aria-busy="booking.saving"
  >
    <div class="min-w-0">
      <div v-if="['AppointmentSlot', 'BarberSelect'].includes(String(route.name))" class="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2">
        <p id="booking-mode-label" class="text-xs text-white/55">¿Qué quieres elegir primero?</p>
        <div role="group" aria-labelledby="booking-mode-label" class="inline-flex w-full gap-1 rounded-lg border border-white/10 bg-[#111111] p-1 sm:w-auto">
          <button type="button" :disabled="booking.saving" @click="changeMode('time')" :aria-pressed="booking.bookingMode === 'time'" aria-label="Empezar por día y hora entre todos los barberos"
            class="flex min-h-10 min-w-0 flex-1 items-center justify-center gap-2 rounded-md px-3 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-[#ffb700] motion-reduce:transition-none sm:flex-none"
            :class="booking.bookingMode === 'time' ? 'bg-[#ffb700]/10 text-[#ffb700]' : 'text-white/55 hover:bg-white/5 hover:text-white'">
            <svg aria-hidden="true" class="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v4m8-4v4M4 10h16M5 5h14v16H5zM8 14h3m-3 3h7" /></svg>
            Día y hora
          </button>
          <button type="button" :disabled="booking.saving" @click="changeMode('barber')" :aria-pressed="booking.bookingMode === 'barber'" aria-label="Empezar eligiendo barbero y después consultar su horario"
            class="flex min-h-10 min-w-0 flex-1 items-center justify-center gap-2 rounded-md px-3 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-[#ffb700] motion-reduce:transition-none sm:flex-none"
            :class="booking.bookingMode === 'barber' ? 'bg-[#ffb700]/10 text-[#ffb700]' : 'text-white/55 hover:bg-white/5 hover:text-white'">
            <svg aria-hidden="true" class="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21v-2a8 8 0 0 1 16 0v2" /></svg>
            Barbero
          </button>
        </div>
      </div>
      <div
        ref="stepContent"
        :inert="booking.saving"
        tabindex="-1"
        class="outline-none scroll-mt-[calc(var(--app-header-height)+1rem)]"
      >
        <RouterView />
      </div>
    </div>
    <aside
      ref="sidebarCard"
      class="booking-summary-sticky mt-2 hidden sticky top-[var(--summary-sticky-top,calc(var(--app-header-height)+1rem))] self-start min-w-0 pt-3 px-[15px] pb-[5px] rounded-[18px] border border-[#ffffff18] border-t-white/15 bg-[#101010] shadow-[0_10px_35px_#00000018] xl:block"
      :style="{ '--summary-sticky-top': summaryTop + 'px' }"
      aria-label="Resumen y siguiente paso"
    >
      <BookingSummary presentation="sidebar" />
      <div class="booking-summary-action mt-[19px]">
        <BookingAction presentation="sidebar" />
      </div>
    </aside>
    <div
      class="booking-floating-actions pointer-events-none sticky z-40 col-span-full flex items-center gap-3 xl:hidden bottom-[calc(var(--app-mobile-nav-clearance)+.5rem)] mt-4"
    >
      <div
        class="pointer-events-auto flex w-full items-center gap-3 rounded-2xl border border-white/15 bg-[#111]/95 p-3 shadow-2xl backdrop-blur-md"
      >
        <button
          ref="summaryButton"
          type="button"
          @click="summaryDialog?.showModal()"
          class="shrink-0 rounded-lg px-2 py-2 text-left text-sm text-white/85 focus-visible:outline focus-visible:outline-[#ffb700]"
          aria-haspopup="dialog"
        >
          Ver resumen<span class="block text-[#ffb700] font-medium mt-0.5">{{
            formatCurrency(booking.totalService)
          }}</span>
        </button>
        <div class="min-w-0 flex-1 border-l border-white/10 pl-3">
          <BookingAction />
        </div>
      </div>
    </div>

    <dialog
      ref="summaryDialog"
      aria-labelledby="booking-summary-title"
      class="fixed inset-0 m-auto w-11/12 max-w-xl max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl border border-white/15 bg-neutral-950 p-0 text-white shadow-2xl backdrop:bg-black/75 backdrop:backdrop-blur-sm sm:rounded-3xl"
      @click="closeOutside"
      @close="summaryButton?.focus()"
    >
      <div class="p-4 sm:p-7">
        <!-- ENCABEZADO -->
        <div
          class="mb-5 flex justify-between gap-4 border-b border-white/10 pb-4"
        >
            <!-- DETALLE DECORATIVO -->

            <div>
              <p
                class="mb-1 text-xs font-medium tracking-widest text-amber-400 uppercase"
              >
                Tu reservación
              </p>

              <h2
                id="booking-summary-title"
                class="text-xl font-semibold text-white sm:text-2xl"
              >
                Resumen de la reserva
              </h2>
          </div>

          <!-- CERRAR -->
          <button
            type="button"
            autofocus
            aria-label="Cerrar resumen"
            class="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/5 text-neutral-400 transition-colors hover:border-amber-400/40 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
            @click="summaryDialog?.close()"
          >
            <svg
              class="size-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- CONTENIDO -->

          <BookingSummary />


        <!-- PIE DEL MODAL -->
        <div class="mt-5 flex items-center justify-end">
          <button
            type="button"
            class="min-h-11 cursor-pointer rounded-xl border border-white/15 px-5 text-sm font-medium text-neutral-200 transition-colors hover:border-amber-400/40 hover:text-amber-400 focus-visible:outline-2 focus-visible:outline-amber-400"
            @click="summaryDialog?.close()"
          >
            Volver a la reserva
          </button>
        </div>
      </div>
    </dialog>
  </div>
</template>
<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import {
  onBeforeRouteLeave,
  onBeforeRouteUpdate,
  useRoute,
  useRouter,
  RouterView,
} from "vue-router";
import { useAppointmentBookingStore } from "@/stores/appointmentCreator";
import { formatCurrency } from "@/helpers";
import { useSettingsStore } from "@/stores/settings";
import { useServiceStore } from "@/stores/service";
import BookingSummary from "@/components/UI/BookingSummary.vue";
import BookingAction from "./BookingAction.vue";
const route = useRoute();
const router = useRouter();
const booking = useAppointmentBookingStore();
const catalogStore = useServiceStore();
let stopCatalog: (() => void) | undefined;
const summaryDialog = ref<HTMLDialogElement | null>(null);
const summaryButton = ref<HTMLButtonElement | null>(null);
const stepContent = ref<HTMLElement | null>(null);
const sidebarCard = ref<HTMLElement | null>(null);
const summaryTop = ref(80);
let summaryObserver: ResizeObserver | undefined;
function updateSummaryPosition() {
  const card = sidebarCard.value;
  if (!card || !card.offsetHeight) return;
  const header =
    parseFloat(
      getComputedStyle(card).getPropertyValue("--app-header-height"),
    ) || 64;
  // Keep following the page even when the second service makes the card taller.
  // Oversized cards can move upward with the page until their action is visible.
  summaryTop.value = Math.min(
    header + 16,
    window.innerHeight - card.offsetHeight - 16,
  );
}
function changeMode(mode: "time" | "barber") {
  if (booking.bookingMode === mode || booking.saving) return;
  booking.setBookingMode(mode);
  void router.replace({ name: mode === "barber" ? "BarberSelect" : "AppointmentSlot" });
}
function guard() {
  const preferred = booking.bookingMode === "barber";
  if (route.name === "AppointmentSlot" && preferred && !booking.barber) return router.replace({ name: "BarberSelect" });
  if (route.name === "BarberSelect" && !preferred && (!booking.date || !booking.time)) return router.replace({ name: "AppointmentSlot" });
  if (["New-appointments", "New-Appointments-details"].includes(String(route.name)) && (!booking.barber || !booking.date || !booking.time)) {
    return router.replace({ name: preferred && !booking.barber ? "BarberSelect" : "AppointmentSlot" });
  }
  if (route.name === "New-Appointments-details" && !booking.services.length) return router.replace({ name: "New-appointments" });
}
function closeOutside(event: MouseEvent) {
  if (event.target === summaryDialog.value) summaryDialog.value?.close();
}
watch(
  () => route.name,
  async () => {
    summaryDialog.value?.close();
    await guard();
    await nextTick();
    stepContent.value?.focus({ preventScroll: true });
    const top = stepContent.value?.getBoundingClientRect().top ?? 0;
    if (top < 0)
      stepContent.value?.scrollIntoView({
        block: "start",
        behavior: "instant",
      });
  },
);
onBeforeRouteLeave(() => !booking.saving);
onBeforeRouteUpdate(() => !booking.saving);
let clockTimer: ReturnType<typeof setInterval> | undefined;
onMounted(() => {
  void useSettingsStore().load();
  stopCatalog = catalogStore.observeCatalog();
  void guard();
  clockTimer = setInterval(booking.refreshClock, 30000);
  summaryObserver = new ResizeObserver(updateSummaryPosition);
  if (sidebarCard.value) summaryObserver.observe(sidebarCard.value);
  window.addEventListener("resize", updateSummaryPosition);
  updateSummaryPosition();
});
onUnmounted(() => {
  stopCatalog?.();
  clearInterval(clockTimer);
  summaryObserver?.disconnect();
  window.removeEventListener("resize", updateSummaryPosition);
});
</script>
