<template>
  <footer class="w-full border-t border-white/10 bg-[#050505] text-white">
    <div class="mx-auto max-w-7xl px-5 sm:px-10 lg:px-20">
      <div class="flex flex-col gap-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:py-7">
        <RouterLink :to="{ name: 'Home' }" aria-label="The Barber Studio, ir al inicio"
          class="flex w-fit max-w-full items-center gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffb700]">
          <SiteImage slot="logo" alt="" width="44" height="44" loading="lazy" class="size-11 shrink-0 object-contain" />
          <div class="min-w-0">
            <p class="font-barber text-lg leading-tight text-white/90 sm:text-xl">The Barber Studio</p>
            <p class="mt-1 text-xs leading-5 text-white/40">Estilo, precisión y confianza.</p>
          </div>
        </RouterLink>

        <a v-if="business.data.mapsUrl" :href="business.data.mapsUrl" target="_blank" rel="noopener noreferrer"
          aria-label="Ver la ubicación en Google Maps, en una nueva pestaña"
          class="group flex w-fit max-w-full items-center gap-3 rounded-lg text-white/55 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffb700] motion-reduce:transition-none">
          <svg aria-hidden="true" class="size-5 shrink-0 text-[#ffb700]/70 transition-colors group-hover:text-[#ffb700]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" stroke-linejoin="round" /><circle cx="12" cy="10" r="2.5" />
          </svg>
          <span class="min-w-0 text-xs leading-5">
            <span class="block text-white/75">{{ business.data.city || 'Cómo llegar' }}</span>
            <span class="block break-words text-white/40">{{ business.data.address || 'Ver ubicación en Google Maps' }}</span>
          </span>
        </a>
      </div>

      <div class="flex items-center justify-between gap-4 border-t border-white/[0.07] py-2">
        <p class="min-w-0 text-[11px] leading-5 text-white/35">
          © {{ year }} The Barber Studio.
          <span class="block sm:inline">Todos los derechos reservados.</span>
        </p>
        <details ref="credits" class="group relative shrink-0" @keydown.esc.stop.prevent="closeCredits">
          <summary aria-label="Información del sitio"
            class="flex size-11 cursor-pointer list-none items-center justify-center rounded-lg text-white/30 transition-colors hover:bg-white/[0.03] hover:text-white/65 group-open:text-[#ffb700] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb700] motion-reduce:transition-none [&::-webkit-details-marker]:hidden">
            <svg aria-hidden="true" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="9" /><path d="M12 11v6m0-10v1" stroke-linecap="round" />
            </svg>
            <span class="sr-only">Información del sitio</span>
          </summary>
          <div class="absolute bottom-full right-0 z-30 mb-2 w-56 max-w-[calc(100vw_-_2.5rem)] rounded-xl border border-white/15 bg-neutral-900 p-4 shadow-xl shadow-black/40">
            <p class="text-xs text-white/50">Diseño y desarrollo</p>
            <a href="https://leiston-holguin.com" target="_blank" rel="noopener noreferrer"
              class="mt-1 inline-flex min-h-10 items-center gap-2 rounded-sm text-sm font-medium text-white/90 transition-colors hover:text-[#ffb700] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffb700] motion-reduce:transition-none">
              Leiston Holguin
              <svg aria-hidden="true" class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M7 17 17 7M7 7h10v10" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </a>
          </div>
        </details>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import SiteImage from "@/components/UI/SiteImage.vue";
import { useBusinessStore } from "@/stores/business";

const business = useBusinessStore();
const year = new Date().getFullYear();
const credits = ref<HTMLDetailsElement | null>(null);

function closeCredits() {
  if (!credits.value?.open) return;
  credits.value.open = false;
  credits.value.querySelector("summary")?.focus();
}
function closeCreditsOutside(event: PointerEvent) {
  if (event.target instanceof Node && !credits.value?.contains(event.target)) {
    if (credits.value) credits.value.open = false;
  }
}
onMounted(() => document.addEventListener("pointerdown", closeCreditsOutside));
onBeforeUnmount(() => document.removeEventListener("pointerdown", closeCreditsOutside));
</script>
