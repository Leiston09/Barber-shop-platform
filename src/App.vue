<template>
  <SplashScreen v-if="!userStore.initialized" />
  <RouterView v-else />
  <NotificationHost />
</template>

<script setup lang="ts">
import {useBusinessStore} from "@/stores/business";
import { useSiteMediaStore } from "@/stores/siteMedia";
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import NotificationHost from "@/components/UI/NotificationHost.vue";
import SplashScreen from "@/components/UI/SplashScreen.vue";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();

onMounted(() => {
  userStore.init();
  useBusinessStore().load();
  useSiteMediaStore().load();
});
</script>