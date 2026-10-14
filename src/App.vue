<template>
  <SplashScreen v-if="!userStore.initialized" />
  <RouterView v-else />
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import SplashScreen from "@/components/UI/SplashScreen.vue";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();

onMounted(() => {
  userStore.init();
});
</script>