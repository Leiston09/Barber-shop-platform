<template>
  <dialog ref="dialog" aria-labelledby="cancel-appointment-title" aria-describedby="cancel-appointment-description"
    @cancel.prevent="close" @click.self="close"
    class="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-2xl border border-white/15 bg-[#111111] p-0 text-white shadow-2xl backdrop:bg-black/75 backdrop:backdrop-blur-sm">
    <div class="p-5 sm:p-6">
      <div class="flex items-start justify-between gap-4"><span aria-hidden="true" class="flex size-11 items-center justify-center rounded-xl border border-rose-300/20 bg-rose-300/5 text-rose-300"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="size-5"><path d="M8 3v4m8-4v4M4 10h16M5 5h14v16H5zM9 14l6 4m0-4-6 4" stroke-linecap="round" stroke-linejoin="round" /></svg></span><button type="button" :disabled="busy" @click="close" aria-label="Cerrar confirmación" class="flex size-11 items-center justify-center rounded-lg text-xl text-white/50 hover:bg-white/5 disabled:opacity-40">×</button></div>
      <h2 id="cancel-appointment-title" class="mt-4 text-xl font-semibold">¿Cancelar tu cita?</h2>
      <p id="cancel-appointment-description" class="mt-2 text-sm leading-6 text-white/55">Se liberará este turno y tendrás que crear una nueva reserva si quieres volver a agendarlo.</p>
      <div class="mt-5 rounded-xl border border-white/10 bg-black/20 p-4"><p class="text-sm font-medium">{{ date }} <span class="ml-1 tabular-nums text-[#ffb700]">{{ appointment.time }}</span></p><p class="mt-2 break-words text-sm text-white/70">{{ appointment.barber?.name || 'Tu barbero' }}</p><p class="mt-1 text-xs leading-5 text-white/45">{{ appointment.services.filter(Boolean).map(s => s.name).join(', ') }}</p></div>
      <p v-if="error" role="alert" class="mt-4 text-sm leading-6 text-rose-200">{{ error }}</p>
      <div class="mt-6 grid gap-2 sm:grid-cols-2"><button type="button" autofocus :disabled="busy" @click="close" class="min-h-12 rounded-lg bg-[#ffb700] px-4 text-sm font-semibold text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb700] disabled:opacity-40">Conservar mi cita</button><button type="button" :disabled="busy" @click="$emit('confirm')" class="min-h-12 rounded-lg border border-rose-300/35 px-4 text-sm font-medium text-rose-200 hover:bg-rose-300/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-300 disabled:opacity-40">{{ busy ? 'Cancelando…' : 'Sí, cancelar cita' }}</button></div>
    </div>
  </dialog>
</template>
<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import type { MyAppointment } from "@/stores/myAppointments";
const props = defineProps<{ appointment: MyAppointment; busy: boolean; error: string }>();
const emit = defineEmits<{ close: []; confirm: [] }>(), dialog = ref<HTMLDialogElement>();
const date = computed(() => new Intl.DateTimeFormat("es-EC", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(props.appointment.date.slice(0, 10) + "T12:00:00Z")));
function close() { if (!props.busy) emit("close"); }
onMounted(async () => { await nextTick(); dialog.value?.showModal(); });
onBeforeUnmount(() => { dialog.value?.close(); });
</script>
