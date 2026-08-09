<template>
  <div class="">
    <div class="w-full md:w-2/3">
      <h1>AppSalon</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
onMounted(() => {
  router.push({ name: "Login" });
});
</script>

<style scoped></style>
