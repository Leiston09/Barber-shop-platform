<template>
  <div>
    <nav class="my-5 flex gap-3">
      <RouterLink
        class="flex-1 text-center font-extrabold p-3 uppercase hover:bg-blue-600 hover:text-white"
        :class="
          route.name === 'new-appoiments'
            ? 'bg-blue-500 text-white'
            : 'bg-white text-blue-500'
        "
        :to="{ name: 'new-appoiments' }"
      >
        SERVICIOS
      </RouterLink>
      <RouterLink
        class="flex-1 text-center font-extrabold p-3 uppercase hover:bg-blue-600 hover:text-white"
        :class="
          route.name === 'new-appoiments'
            ? 'bg-white text-blue-500'
            : 'bg-blue-500 text-white'
        "
        :to="{ name: 'Appoiments-details' }"
      >
        CITAS Y RESUMEN
      </RouterLink>
    </nav>
  </div>
  <RouterView />
</template>

<script setup lang="ts">
import { useAppoimentStore } from "@/stores/appoiment";
import { onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const appointments = useAppoimentStore();
onMounted(() => {
  appointments.clearAppointmentsData();
});
</script>

