<template>
  <div class="flex flex-1 flex-col bg-[#0a0a0a] text-white">
    <header
      class="reservation-header border-b border-white/10 px-5 py-4 sm:px-10 lg:px-14"
    >
      <div
        class="reservation-header-grid mx-auto max-w-7xl grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-8"
      >
        <div class="min-w-0">
          <h1
            class="font-barber text-2xl font-light tracking-tight text-white lg:text-3xl"
          >
            {{ isBooking ? "Nueva" : "Mis" }}
            <span class="text-[#ffb700]">{{
              isBooking ? "Cita" : "Reservaciones"
            }}</span>
          </h1>
          <p class="mt-1 text-xs text-white/45">The Barber Studio</p>
        </div>
        <Buttons
          v-if="isBooking"
          class="reservation-progress col-span-full row-start-2 w-full lg:col-span-1 lg:col-start-2 lg:row-start-1 lg:max-w-[560px] lg:justify-self-center"
        />
        <nav
          aria-label="Reservaciones"
          class="reservation-tabs flex w-fit items-center rounded-lg border border-white/10 bg-white/[0.025] p-1 col-start-2 row-start-1 justify-self-end lg:col-start-3 [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-[#ffb700] [&_a:focus-visible]:outline-offset-3 max-[360px]:[&_a]:px-2.5 max-[360px]:[&_a]:text-[.6875rem]"
        >
          <RouterLink
            :to="{ name: 'My-appointments' }"
            class="rounded-md px-3 py-2.5 text-xs transition-colors sm:px-4"
            :class="
              !isBooking
                ? 'bg-[#ffb700] text-black'
                : 'text-white/65 hover:text-white'
            "
            >Mis citas</RouterLink
          >
          <RouterLink
            :to="{ name: 'AppointmentSlot' }"
            class="rounded-md px-3 py-2.5 text-xs transition-colors sm:px-4"
            :class="
              isBooking
                ? 'bg-[#ffb700] text-black'
                : 'text-white/65 hover:text-white'
            "
            >Nueva cita</RouterLink
          >
        </nav>
      </div>
    </header>
    <section class="mx-auto w-full max-w-7xl flex-1 px-5 py-6">
      <RouterView />
    </section>
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
import Buttons from "./AppointmentSteps/Buttons.vue";
const route = useRoute();
const isBooking = computed(() => route.name !== "My-appointments");
</script>
