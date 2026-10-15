
<template>
  <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
    <div class="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-25 pt-10">
      <div class="max-w-3xl mx-auto text-center">

        <div data-anim class="flex items-center justify-center">
          <span class="text-[#ffb700] text-[10px] uppercase tracking-[0.2em] font-semibold">
            04 / Ahora es tu turno
          </span>
        </div>

        <h2
          data-anim
          class="mt-4 font-barber uppercase text-white font-medium leading-[0.92] tracking-[-0.03em] text-[clamp(48px,6vw,82px)]"
        >
          Tu próximo<br />
          <span class="text-[#ffb700] font-bold">corte</span> empieza aquí.
        </h2>

        <div data-anim class="mt-6">
          <p class="text-white/70 text-sm sm:text-[15px] leading-[1.7] font-light max-w-[400px] mx-auto">
            Elige el momento.<br />
            Nosotros nos encargamos del resto.
          </p>

          <div class="flex items-center justify-center gap-3 mt-5">
            <span class="text-[#ffb700] text-[9px] uppercase tracking-[0.15em] font-medium">
              Estilo
            </span>
            <span class="w-1 h-1 rounded-full bg-white/30" />
            <span class="text-white/50 text-[9px] uppercase tracking-[0.15em]">
              Detalle
            </span>
            <span class="w-1 h-1 rounded-full bg-white/30" />
            <span class="text-white/50 text-[9px] uppercase tracking-[0.15em]">
              Confianza
            </span>
          </div>
        </div>

        <div data-anim class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <RouterLink
            v-if="user.user"
            :to="{ name: 'Reservaciones' }"
            class="pointer-events-auto group inline-flex items-center gap-3 rounded-xl px-6 py-3.5 bg-[#ffb700] text-black text-sm font-semibold uppercase tracking-[0.08em] transition-colors duration-200 hover:bg-[#e6a500] active:scale-[0.98]"
          >
            <span>Agendar cita</span>
            <span class="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center transition-transform duration-200 group-hover:translate-x-0.5">
              <svg
                class="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </RouterLink>

          <RouterLink
            v-else
            :to="{ name: 'Login' }"
            class="pointer-events-auto inline-flex items-center gap-3 rounded-xl px-6 py-3.5 border border-white/20 text-white text-sm font-semibold uppercase tracking-[0.08em] transition-colors duration-200 hover:border-[#ffb700] hover:text-[#ffb700] active:scale-[0.98]"
          >
            <span>Iniciar sesión</span>
          </RouterLink>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { RouterLink } from "vue-router";

const user = useUserStore();
</script>
