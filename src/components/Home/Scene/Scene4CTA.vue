<template>
  <div
    class="absolute inset-0 flex items-center justify-center pointer-events-none"
  >
    <div class="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-25 pt-10">
      <div class="max-w-3xl mx-auto text-center">

        <div class="flex items-center justify-center gap-5">
          <span class="w-10 h-px bg-[#ffb700]/50" />

          <span
            class="text-[#ffb700] text-[9px] uppercase tracking-[0.35em] font-medium"
          >
            04 / Ahora es tu turno
          </span>

          <span class="w-10 h-px bg-[#ffb700]/50" />
        </div>

        <h2
          class="mt-3 font-barber uppercase text-white font-medium leading-[0.86] tracking-[-0.035em] text-[clamp(48px,6vw,82px)]"
        >
          Tu próximo
          <br />
          <span class="text-[#ffb700] font-bold">corte</span>
          empieza aquí.
        </h2>

        <div class="mt-6 flex items-start justify-center gap-5">
          <span class="w-px h-12 bg-[#ffb700]/70 shrink-0" />

          <div>
            <p
              class="text-white/75 text-sm sm:text-[15px] leading-[1.7] font-light max-w-[400px] mx-auto"
            >
              Elige el momento.
              <br />
              Nosotros nos encargamos del resto.
            </p>

            <div class="flex items-center justify-center gap-3 mt-4">
              <span
                class="text-[#ffb700]/70 text-[8px] uppercase tracking-[0.28em]"
              >
                Estilo
              </span>

              <span class="w-1 h-1 rounded-full bg-white/25" />

              <span
                class="text-white/40 text-[8px] uppercase tracking-[0.28em]"
              >
                Detalle
              </span>

              <span class="w-1 h-1 rounded-full bg-white/25" />

              <span
                class="text-white/40 text-[8px] uppercase tracking-[0.28em]"
              >
                Confianza
              </span>
            </div>
          </div>

          <span class="w-px h-12 bg-[#ffb700]/70 shrink-0" />
        </div>

        <div class="mt-7 flex flex-wrap items-center justify-center gap-3">
          <RouterLink
            v-if="user.user"
            :to="{ name: 'Reservaciones' }"
            class="group inline-flex items-center gap-4 px-7 py-3.5 bg-[#ffb700] text-black text-sm font-semibold uppercase tracking-[0.12em] transition-all duration-300 hover:bg-white"
          >
            <span>Agendar cita</span>

            <span
              class="text-lg transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </RouterLink>

          <RouterLink
            v-else
            :to="{ name: 'Login' }"
            class="inline-flex items-center px-7 py-3.5 border border-white/25 text-white/75 text-sm font-medium uppercase tracking-[0.12em] transition-all duration-300 hover:border-[#ffb700] hover:text-white"
          >
            Iniciar sesión
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