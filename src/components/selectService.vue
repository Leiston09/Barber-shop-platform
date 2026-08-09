<template>
  <div
    class="flex justify-between p-5 space-y-2 rounded-2xl cursor-pointer text-white border-2 border-gray-400"
  >
    <div>
      <p class="text-xl md:text-2xl font-extrabold text-white">
        {{ service.name }}
      </p>
      <p class="font-black text-4xl text-blue-400">
        {{ formatCurrency(service.price) }}
      </p>
    </div>
    <div class="flex items-center">
      <button @click="appoiments.deleteService(service._id)" class="bg-red-500 p-2 rounded-2xl text-white font-extrabold">Eliminar</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatCurrency } from "@/helpers";
import { useAppoimentStore } from "@/stores/appoiment";

const appoiments = useAppoimentStore()

interface TypeService {
    _id: string
  name: string;
  price: number;
}

defineProps<{
  service: TypeService;
}>();
</script>

<style scoped></style>
