<template>
  <div class="h-screen">
    <h1 class="text-3xl font-extrabold text-white mt-10">Servicios</h1>
    <p class="text-white text-lg mt-5">
      A continuacion elige al menos un servicio para tu cita
    </p>

    <div class="grid grid-cols-2 gap-5 mt-5 ">
      <ServiceItem 
      v-for="service in store.services " 
      :key="service._id" 
      :service="service"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ServiceItem from "@/components/ServiceItem.vue";
import { useServiceStore } from "@/stores/service";


const store = useServiceStore();
</script>
