<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />

    <main class="pt-15 flex-1">
      <RouterView />
    </main>

    <footer class="pb-10 lg:pb-0">
      <Footer />
    </footer>
  </div>
</template>

<script setup lang="ts">
import Footer from "@/components/Home/Footer.vue";
import Navbar from "@/components/Navbar/Navbar.vue";
</script>

<style scoped></style>