<template>
  <!-- SCROLL -->
  <Container @update:currentScene="handleSceneChange" />

  <!-- SECCIÓN UBICACIÓN + MAPA -->
  <Location />

</template>

<script setup lang="ts">
import Container from "@/components/Home/Container.vue";
import Location from "@/components/Home/Location.vue";
import { ref } from "vue";


const showNavbarBackground = ref(false);

const handleSceneChange = (scene: number) => {
  showNavbarBackground.value = scene === 4;
};

</script>

<style scoped></style>
