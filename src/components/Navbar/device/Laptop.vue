<template>
  <nav aria-label="Navegación principal" class="hidden min-w-0 items-center gap-3 lg:flex xl:gap-6">
    <NavigationItem v-for="link in links" :key="link.name" :link="link" />
  </nav>
</template>
<script setup lang="ts">
import NavigationItem from "../NavigationItem.vue";
import { useNavigationLinks } from "@/composables/useNavigationLinks";
const links=useNavigationLinks();
</script>
