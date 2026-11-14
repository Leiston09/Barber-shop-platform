<template>
  <img v-if="source && !failed" v-bind="$attrs" :src="source" :alt="alt ?? item?.alt ?? ''" @error="failed = true" />
  <span v-else v-bind="$attrs" class="inline-flex items-center justify-center bg-neutral-900 text-white/20" role="img" :aria-label="alt === '' ? undefined : (alt || item?.alt || 'Imagen pendiente')" :aria-hidden="alt === '' ? true : undefined">
    <svg aria-hidden="true" class="h-8 max-h-[45%] w-8 max-w-[45%]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8" cy="8" r="1.5" /><path d="m3 17 5-5 4 4 3-3 6 6" /></svg>
  </span>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useSiteMediaStore } from "@/stores/siteMedia";
defineOptions({ inheritAttrs: false });
const props = defineProps<{ slot: string; alt?: string }>();
const media = useSiteMediaStore(), failed = ref(false);
const item = computed(() => media.find(props.slot));
const source = computed(() => media.url(props.slot));
watch(source, () => { failed.value = false; });
onMounted(() => media.load());
</script>
