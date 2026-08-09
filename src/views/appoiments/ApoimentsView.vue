<template>
  <div>
    <h1 class="text-3xl font-extrabold text-white mt-10">
      detalles Cita y Resumen
    </h1>
    <p class="text-white text-lg mt-5">
      A continuacion verifica la informacion y confirma tu cita
    </p>

    <h3 class="text-3xl font-extrabold text-white">Servicios</h3>
  </div>
  <p
    v-if="appoiments.noServiceSelect"
    class="flex justify-center font-black text-white"
  >
    No hay servicios selecionados
  </p>
  <div v-else>
    <div class="grid gap-5">
      <selectService
        v-for="service in appoiments.services"
        :key="service._id"
        :service="service"
      />
    </div>

    <p class="flex justify-end text-white text-2xl">
      Total a pagar:
      <span class="font-black">{{
        formatCurrency(appoiments.totalService)
      }}</span>
    </p>
  </div>
  <div v-if="!appoiments.noServiceSelect" class="spac-y-8">
    <h3 class="text-3xl font-extrabold text-white">fecha y hora</h3>
    <div class="lg:flex gap-5 items-start">
      <div class="w-96 bg-white flex justify-center rounded-lg">
        <vueTailwindDatepicker
          :disable-date="disableDate"
          i18n="es-mx"
          as-single
          no-input
          :formatter="formatter"
          v-model="appoiments.date"
        />
      </div>
      <div v-if="appoiments.isDateSelect" class="flex-1 grid grid-cols-2 gap-5">
        <button
          type="button"
          v-for="hour in appoiments.hours"
          :key="hour"
          class="p-3 rounded-2xl font-black text-2xl disabled:opacity-10"
          :class="
            appoiments.time === hour
              ? 'bg-blue-400 text-white'
              : 'text-blue-400 bg-white'
          "
          @click="appoiments.time = hour"
          :disabled="appoiments.disableTime(hour) ? true : false"
        >
          {{ hour }}
        </button>
      </div>
    </div>
  </div>
  <div v-if="appoiments.validateReservations" class="flex justify-end">
    <button
      class="bg-blue-400 text-xl rounded-lg p-3 font-extrabold text-white"
      @click="appoiments.saveAppointment"
    >
      Confirmar Reservacion
    </button>
  </div>
</template>

<script setup lang="ts">
import vueTailwindDatepicker from "vue-tailwind-datepicker";
import selectService from "@/components/selectService.vue";
import { formatCurrency } from "@/helpers";
import { useAppoimentStore } from "@/stores/appoiment";
import { ref } from "vue";

const appoiments = useAppoimentStore();

const formatter = ref({
  date: "DD/MM/YYYY",
  month: "MMM",
});
const disableDate = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    date < today ||
    date.getMonth() > today.getMonth() + 5 ||
    [0, 6].includes(date.getDay())
  );
};
</script>

<style scoped></style>
