<template>
  <component :is="link.disabled ? 'button' : RouterLink" :to="link.disabled ? undefined : {name:link.name}" :type="link.disabled ? 'button' : undefined" :aria-current="active ? 'page' : undefined" :aria-label="link.disabled ? link.label + ': inicia sesión para reservar' : link.label" @click="explainAccess"
    class="group relative min-w-0 rounded-xl border font-medium transition-[background-color,border-color,color] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb700] motion-reduce:transition-none"
    :class="[mobile ? 'flex min-h-14 flex-1 flex-col items-center justify-center gap-1 px-1 py-2 text-[10px]' : 'inline-flex min-h-10 items-center gap-2 whitespace-nowrap px-2.5 text-xs', active ? 'border-white/10 bg-white/[0.055] text-white' : 'border-transparent text-white/60 hover:border-white/10 hover:bg-white/[0.035] hover:text-white']">
    <svg aria-hidden="true" class="shrink-0 transition-[color,transform] duration-200 group-hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none" :class="[mobile ? 'size-[19px]' : 'size-4',active || link.private ? 'text-[#ffb700]' : 'text-white/45 group-hover:text-[#ffb700]']" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path :d="link.icon" /></svg>
    <span class="leading-4" :class="active ? 'text-white' : ''">{{ mobile && link.name === 'Admin' ? 'Admin' : link.label }}</span>
    <svg v-if="link.disabled && !mobile" aria-hidden="true" class="size-2.5 text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
  </component>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";
import type { NavigationLink } from "@/composables/useNavigationLinks";
import { toast } from "@/lib/notifications";
const props = defineProps<{
    link: NavigationLink;
    mobile?: boolean;
}>(), route = useRoute();
const active = computed(() => !props.link.disabled && (props.link.path === "/" ? route.path === "/" : route.path === props.link.path || route.path.startsWith(props.link.path + "/")));
function explainAccess() { if (props.link.disabled)
    toast.info("Inicia sesión para elegir servicios y reservar tu cita."); }
</script>
