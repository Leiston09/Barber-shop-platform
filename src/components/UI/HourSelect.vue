<template>
  <details ref="panel" :class="attrs.class" :style="attrs.style as any" class="relative min-w-0" @toggle="checkDisabled">
    <summary v-bind="controlAttrs" :aria-disabled="disabled" @click="onTrigger" class="flex min-h-11 list-none items-center justify-between gap-2 rounded-lg border border-white/15 bg-neutral-950 px-3 text-sm text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb700] [&::-webkit-details-marker]:hidden" :class="disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'">
      <span class="tabular-nums">{{ modelValue || value || 'Elegir hora' }}</span>
      <svg aria-hidden="true" class="size-3.5 shrink-0 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="m6 9 6 6 6-6" stroke-linecap="round" stroke-linejoin="round" /></svg>
    </summary>
    <div class="mt-2 grid max-h-48 grid-cols-[repeat(auto-fit,minmax(44px,1fr))] gap-1.5 overflow-y-auto rounded-lg border border-white/15 bg-[#181818] p-2">
      <button v-for="hour in hours" :key="hour" type="button" :disabled="disabled" @click="choose(hour)" :aria-pressed="hour === (modelValue || value)" class="min-h-9 rounded-md border border-white/10 text-xs tabular-nums text-white/70 aria-pressed:border-[#ffb700] aria-pressed:text-[#ffb700] hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-[#ffb700]">{{ hour }}</button>
    </div>
  </details>
</template>
<script setup lang="ts">
import { computed, ref, useAttrs } from "vue";
defineOptions({ inheritAttrs: false });
const props = defineProps<{ modelValue?: string; value?: string; disabled?: boolean }>();
const attrs = useAttrs();
const controlAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== "class" && key !== "style")));
const emit = defineEmits<{ "update:modelValue": [string]; input: [Event] }>();
const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0") + ":00");
const panel = ref<HTMLDetailsElement>();
function onTrigger(event: MouseEvent) { if (props.disabled) event.preventDefault(); }
function checkDisabled() { if (props.disabled && panel.value) panel.value.open = false; }
function choose(hour: string) {
  if (props.disabled) return;
  emit("update:modelValue", hour);
  const input = document.createElement("input"); input.value = hour;
  const change = new Event("input"); Object.defineProperty(change, "target", { value: input });
  emit("input", change);
  if (panel.value) { panel.value.open = false; panel.value.querySelector("summary")?.focus(); }
}
</script>
