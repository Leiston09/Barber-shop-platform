<template>
  <span class="relative flex items-center justify-center overflow-hidden bg-[#191919]">
    <img v-if="source && !failed" :src="source" :alt="name || 'Fotografía del servicio'" class="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" @error="failed = true" />
    <svg v-else aria-hidden="true" class="size-8 text-white/20" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.1"><rect x="4" y="5" width="24" height="22" rx="3" /><circle cx="12" cy="12" r="2.5" /><path d="m5 24 8-8 5 5 4-4 5 6" /></svg>
  </span>
</template>
<script setup lang="ts">
import { computed, ref, watch } from "vue";
const props = defineProps<{ id?: string; name?: string; revision?: string | null; preview?: string; hidden?: boolean }>();
const failed = ref(false);
const source = computed(() => props.hidden ? "" : props.preview || (props.id && props.revision && /^[a-f\d]{24}$/i.test(props.id)
  ? (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "") + "/services/" + props.id + "/photo?v=" + encodeURIComponent(props.revision) : ""));
watch(source, () => { failed.value = false; });
</script>
