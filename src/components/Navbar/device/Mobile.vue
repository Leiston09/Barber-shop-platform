<template>
  <nav aria-label="Navegación móvil" class="mobile-navigation fixed left-1/2 z-40 w-[calc(100%_-_1.5rem)] max-w-md -translate-x-1/2 rounded-[1.125rem] border border-white/15 bg-[#101010]/95 p-1 shadow-[0_8px_28px_#00000055] backdrop-blur-xl lg:hidden">
    <div class="flex items-stretch gap-1"><NavigationItem v-for="link in links" :key="link.name" :link="link" mobile /></div>
  </nav>
</template>
<script setup lang="ts">
import NavigationItem from "../NavigationItem.vue";
import { useNavigationLinks } from "@/composables/useNavigationLinks";
const links=useNavigationLinks();
</script>
<style scoped>
.mobile-navigation { bottom: calc(var(--app-mobile-nav-gap) + env(safe-area-inset-bottom, 0px)); }
</style>
