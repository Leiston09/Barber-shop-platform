<template>
  <div
    class="p-5 space-y-2 rounded-2xl cursor-pointer"
    :class="onStore.isServiceSelected(service._id) ? ' text-white bg-blue-500' : 'bg-white'"
    @click="onStore.onServiceSelect(service)"
  >
    <!-- <p>{{ service._id }}</p> -->
    <p class="text-xl md:text-2xl font-light">{{ service.name }}</p>
    <p class="font-black  text-4xl"
        :class="onStore.isServiceSelected(service._id) ? ' text-white' : 'text-blue-600'"
>
      {{ formatCurrency(service.price) }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { formatCurrency } from "@/helpers";
import { useAppoimentStore } from "@/stores/appoiment";

interface TypeService {
  _id: string;
  name: string;
  price: number;
}

defineProps<{
  service: TypeService;
}>();

const onStore = useAppoimentStore();
</script>
