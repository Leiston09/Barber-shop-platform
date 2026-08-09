<template>
  <div>
    <nav class="my-5 flex gap-3">
      <RouterLink
        class="flex-1 text-center font-extrabold p-3 uppercase hover:bg-blue-600 hover:text-white"
        :class="
          route.name === 'Edit-appoiments'
            ? 'bg-blue-500 text-white'
            : 'bg-white text-blue-500'
        "
        :to="{ name: 'Edit-appoiments' }"
      >
        SERVICIOS
      </RouterLink>
      <RouterLink
        class="flex-1 text-center font-extrabold p-3 uppercase hover:bg-blue-600 hover:text-white"
        :class="
          route.name === 'Edit-Appoiments-details'
            ? 'bg-blue-500 text-white'
            : 'bg-white text-blue-500'
        "
        :to="{ name: 'Edit-Appoiments-details' }"
      >
        CITAS Y RESUMEN
      </RouterLink>
    </nav>
  </div>
  <RouterView />
</template>

<script setup lang="ts">
import AppointmentsAPI from "@/api/AppointmentsAPI";
import { useAppoimentStore } from "@/stores/appoiment";
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const { id } = route.params;
const appointment = useAppoimentStore()
onMounted(async () => {
  try {
    const { data } = await AppointmentsAPI.getById(id);
    console.log(data);
    appointment.setSelectedAppointments(data)
  } catch (error) {
    console.log(error);
    router.push({ name: "My-appoiments" });
  }
});
</script>

<style scoped></style>
