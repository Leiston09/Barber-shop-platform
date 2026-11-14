<template>
  <RouterLink :to="{ name: 'Login' }" class="mb-4 inline-flex min-h-11 w-fit items-center gap-2 rounded-lg border border-white/15 bg-black/25 px-3 text-sm text-white/75 transition-colors hover:border-white/30 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb700]">
    <svg aria-hidden="true" class="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m14 6-6 6 6 6" /></svg>
    Volver a iniciar sesión
  </RouterLink>
</template>
<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>
