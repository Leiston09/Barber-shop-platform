<template>
  <div class="min-h-screen flex flex-col bg-[#0a0a0a]">
    <Navbar />

    <main class="flex-1 pt-[64px]">
      <RouterView />
    </main>

    <footer>
      <Footer class="mb-15" />
    </footer>
  </div>
</template>

<script setup lang="ts">
import Footer from "@/components/Home/Footer.vue";
import Navbar from "@/components/Navbar/Navbar.vue";
</script>