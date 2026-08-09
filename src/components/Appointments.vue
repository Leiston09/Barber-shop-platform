<template>
  <div class="bg-white p-5 space-y-3 rounded-lg">
    <p class="text-gray-500 font-black">
      Fecha:
      <span class="font-light">{{ displayDate(appointment.date) }}</span> Hora:
      <span class="font-light">{{ appointment.time }}</span>
    </p>
    <p class="text-lg font-black">Servicios Solicitados en la cita</p>
    <div v-for="service in appointment.services">
      <p>{{ service.name }}</p>
      <p>{{ formatCurrency(service.price) }}</p>
    </div>
    <p>total a pagar : {{ formatCurrency(appointment.totalAmount) }}</p>
    <RouterLink :to="{name : 'Edit-appoiments', params: {id: appointment._id}}" class="bg-blue-500 p-3 mx-2">Editar cita</RouterLink>
    <button @click="appointments.cancelAppointments(appointment._id)" class="bg-red-500 p-3 mx-2">Cancelar cita</button>
  </div>
</template>

<script setup lang="ts">
import { formatCurrency } from "@/helpers";
import { displayDate } from "@/helpers/date";
import { useAppoimentStore } from "@/stores/appoiment";

export interface Service {
  _id: string;
  name: string;
  price: number;
  __v: number;
}

export interface MainData {
  _id: string;
  date: string;
  services: Service[];
  time: string;
  user: string[];
  totalAmount: number;
  __v: number;
}

defineProps<{ appointment: MainData }>();

const appointments = useAppoimentStore()

</script>
