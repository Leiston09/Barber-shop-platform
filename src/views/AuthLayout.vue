<template>
  <div
    class="relative w-full h-[100dvh] bg-[#0a0a0a] flex items-center justify-center overflow-hidden"
  >
    <!-- FONDO CON IMAGEN -->
    <div
      class="absolute inset-0 z-0"
      style="
        background-image: url('/img/auth/login.jpg');
        background-size: cover;
        background-position: center;
      "
    >
      <div
        class="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50"
      />
    </div>

    <!-- CONTENIDO -->
    <div class="relative z-10 w-full h-full">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
</script>