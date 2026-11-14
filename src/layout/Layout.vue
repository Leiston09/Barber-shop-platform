<template>
  <div
    class="app-shell flex flex-col bg-[#0a0a0a] text-white"
    :style="{ '--app-header-height': headerHeight + 'px' }"
  >
    <Navbar @height-change="headerHeight = $event" />

    <main class="site-content flex min-w-0 flex-1 flex-col">
      <RouterView />
    </main>

    <Footer class="site-footer shrink-0" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { RouterView } from "vue-router";
import Footer from "@/components/Home/Footer.vue";
import Navbar from "@/components/Navbar/Navbar.vue";

const headerHeight = ref(64);
</script>

<style scoped>
.site-content {
  padding-block-start: var(--app-header-height);
}

.site-footer {
  /* La barra inferior solo necesita esta reserva en movil. */
  padding-block-end: var(--app-mobile-nav-clearance);
}
</style>
