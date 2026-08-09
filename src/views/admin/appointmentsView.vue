<template>
  <div>
    <h1 class="text-white text-lg">
      a continuacion podras administrar tu srproximasa citas
    </h1>
  </div>
  <p v-if="user.loading">Cargando....</p>
  <div v-else>
    <p v-if="user.noAppointments">No tienes proxiams citas</p>
    <div v-else class="grid grid-cols-1 gap-5 mt-10">
      <AdminAppointments
        v-for="appointment in user.userAppointments"
        :key="appointment._id"
        :appointment="appointment"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import AdminAppointments from "@/components/AdminAppointments.vue";
import { useUserStore } from "@/stores/user";

const user = useUserStore();
</script>
