<template>
  <span class="barber-portrait relative flex h-[174px] min-w-0 items-center justify-center overflow-hidden border-b border-white/10 bg-[#171717] sm:h-[190px]">
    <img v-if="source && !failed" :key="source" :src="source" :alt="'Fotografía de ' + name" loading="lazy" class="absolute inset-0 size-full object-cover" @error="failed = true" />
    <template v-else><svg class="barber-portrait-icon text-white/20" :class="compact ? 'h-10 w-10' : 'h-[72px] w-[62px]'" viewBox="0 0 64 72" fill="none" stroke="currentColor" stroke-width="1.1" role="img" :aria-label="'Sin fotografía de ' + name"><circle cx="32" cy="24" r="12" /><path d="M9 65v-5c0-13 10-22 23-22s23 9 23 22v5" /><path d="M19 10h-7v7M45 10h7v7M12 54v7h7M52 54v7h-7" opacity=".45" /></svg><span v-if="!compact" class="barber-portrait-caption absolute inset-x-2 bottom-3.5 text-center text-[11px] text-white/40" aria-hidden="true">Sin fotografía</span></template>
  </span>
</template>
<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { barberPhotoUrl } from "@/helpers/barberPhoto";
const props = defineProps<{ name: string; id?: string; revision?: string; compact?: boolean }>();
const failed = ref(false);
const source = computed(() => barberPhotoUrl(props.id, props.revision));
watch(() => [props.id, props.revision], () => { failed.value = false; });
</script>
