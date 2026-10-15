<template>
  <div class="min-h-screen flex flex-col bg-[#0a0a0a] text-white">
    <Navbar />

    <main class="flex-1 pt-15">
      <RouterView />
    </main>

    <footer class="mt-auto">
      <Footer class="mb-15" />
    </footer>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import Footer from "@/components/Home/Footer.vue";
import Navbar from "@/components/Navbar/Navbar.vue";
</script>