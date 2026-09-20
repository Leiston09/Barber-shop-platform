<template>
  <!-- NAVIGATION -->
  <Navbar />

  <!-- Container -->
  <main class="pt-15">
    <RouterView />
  </main>

  <!-- CRÉDITOS / FOOTER -->
  <footer class="pb-10 lg:pb-0"><Footer /></footer>
</template>

<script setup lang="ts">
import Footer from "@/components/Home/Footer.vue";
import Navbar from "@/components/Navbar/Navbar.vue";
</script>

<style scoped></style>
