<template>
  <h1 class="text-3xl font-extrabold text-white mt-10">Mis citas</h1>
  <p class="text-white text-lg mt-5">
    A continuacion podrasa dministarr tus proxima scitas
  </p>
  <p v-if="user.loading">Cargando...</p>
  <div v-else>
    <p v-if="user.noAppointments">NO tienes proximas citas</p>
    <div class="grid grid-cols-1 gap-5 mt-10">
      <Appointments
        v-for="appointment in user.userAppointments"
        :key="appointment._id"
        :appointment="appointment"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Appointments from "@/components/Appointments.vue";
import { useUserStore } from "@/stores/user";

const user : any = useUserStore()

</script>

<style scoped></style>
