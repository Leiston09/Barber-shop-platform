<template>
  <div
    class="app-shell relative flex w-full flex-col bg-[#0a0a0a]"
  >
    <!-- FONDO CON IMAGEN -->
    <div
      class="absolute inset-0 z-0"
    >
      <SiteImage slot="auth-background" alt="" class="absolute inset-0 h-full w-full object-cover" />
      <div
        class="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50"
      />
    </div>

    <!-- CONTENIDO -->
    <div class="relative z-10 flex w-full flex-1 flex-col">
      <RouterLink v-if="!['Login', 'Register', 'Olvide-password', 'new-password'].includes(String($route.name))" to="/" class="mx-4 mt-4 inline-flex min-h-11 w-fit items-center rounded-lg border border-white/20 bg-black/30 px-4 text-sm text-white/80 hover:text-[#ffb700]">Continuar como invitado</RouterLink>
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import SiteImage from "@/components/UI/SiteImage.vue";
</script>