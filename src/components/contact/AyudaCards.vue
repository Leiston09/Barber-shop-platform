<template>
  <div ref="gridRef" class="grid grid-cols-1 items-stretch lg:grid-cols-12 gap-5">
    <!-- Contacto principal -->
    <div
      data-anim
      :class="business.whatsapp ? 'lg:col-span-6' : 'lg:col-span-12'" class="relative overflow-hidden rounded-2xl border border-[#ffb700]/20 bg-[#0b0b0b] p-7 sm:p-8"
    >
      <div
        class="absolute -right-24 -top-24 w-64 h-64 rounded-full bg-[#ffb700]/5 blur-3xl"
      />

      <div class="relative">
        <div class="flex items-start justify-between gap-6">
          <div>
            <span
              class="text-[9px] uppercase tracking-[0.3em] text-[#ffb700]/70"
            >
              Atención prioritaria
            </span>

            <h3
              class="font-barber text-2xl sm:text-3xl uppercase tracking-wide mt-3"
            >
              ¿Tuviste un problema?
            </h3>

            <p class="text-white/40 text-sm leading-relaxed max-w-md mt-3">
              Si ocurrió algún inconveniente con tu reserva o necesitas
              asistencia, contáctanos directamente.
            </p>
          </div>

          <div
            class="hidden sm:flex w-12 h-12 rounded-full border border-[#ffb700]/20 items-center justify-center shrink-0"
          >
            <svg
              class="w-5 h-5 text-[#ffb700]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M12 9v3m0 4h.01M10.29 3.86l-8.18 14A2 2 0 003.84 21h16.32a2 2 0 001.73-3.14l-8.18-14a2 2 0 00-3.42 0z"
              />
            </svg>
          </div>
        </div>

        <a
          v-if="business.whatsapp" :href="business.whatsapp"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-3 mt-8 px-6 py-3.5 rounded-lg bg-[#ffb700] text-black text-[10px] font-barber uppercase tracking-[0.2em] hover:bg-[#e6a500] transition-all duration-300"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.075-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
            />
            <path
              d="M20.52 3.449A11.815 11.815 0 0012.081 0C5.444 0 .04 5.4.04 12.03c0 2.12.554 4.19 1.607 6.015L.04 24l6.1-1.597a12.05 12.05 0 005.94 1.51h.005c6.636 0 12.04-5.4 12.04-12.03a11.94 11.94 0 00-3.605-8.434z"
            />
          </svg>
          Contactar por WhatsApp
        </a>
      </div>
    </div>

    <!-- WhatsApp -->
    <a
      data-anim
      v-if="business.whatsapp" :href="business.whatsapp"
      target="_blank"
      rel="noopener noreferrer"
      class="lg:col-span-6 group rounded-2xl border border-white/8 bg-white/[0.02] p-7 sm:p-8 hover:border-[#25D366]/30 transition-all duration-300"
    >
      <div class="flex items-start justify-between">
        <div
          class="w-11 h-11 rounded-xl border border-white/10 flex items-center justify-center"
        >
          <svg
            class="w-5 h-5 text-white/60 group-hover:text-[#25D366] transition-colors"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.198-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.075-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
            />
          </svg>
        </div>

        <svg
          class="w-4 h-4 text-white/20 group-hover:text-[#25D366] group-hover:translate-x-1 transition-all"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M5 12h14m-6-6 6 6-6 6"
          />
        </svg>
      </div>

      <p class="text-[9px] uppercase tracking-[0.3em] text-white/30 mt-7">
        Atención directa
      </p>

      <h3 class="font-barber text-xl uppercase mt-2">WhatsApp</h3>

      <p class="text-white/35 text-sm mt-2">
        Resolvemos tus dudas de forma rápida y directa.
      </p>
    </a>

    <!-- Redes sociales -->
    <div v-if="networks.length"
      data-anim
      class="lg:col-span-6 rounded-2xl border border-white/8 bg-white/[0.02] p-7 sm:p-8"
    >
      <div class="flex items-center justify-between mb-7">
        <div>
          <p class="text-[9px] uppercase tracking-[0.3em] text-white/30">
            También estamos aquí
          </p>

          <h3 class="font-barber text-xl uppercase mt-2">Redes sociales</h3>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <a
          v-for="network in networks" :key="network.key" :href="network.href"
          target="_blank"
          rel="noopener noreferrer"
          class="group flex items-center justify-between gap-3 rounded-xl border p-4 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb700] motion-reduce:transition-none"
          :class="socialStyles[network.key]?.card"
        >
          <div class="flex min-w-0 items-center gap-4">
            <div
              class="flex size-10 shrink-0 items-center justify-center rounded-lg border" :class="socialStyles[network.key]?.icon"
            >
              <svg aria-hidden="true" class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <template v-if="network.key === 'instagram'"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".5" fill="currentColor" /></template>
                <path v-else-if="network.key === 'facebook'" d="M14 22v-9h3l.5-4H14V7c0-1 .5-2 2-2h2V1h-3c-4 0-5 2-5 6v2H7v4h3v9" />
                <path v-else-if="network.key === 'tiktok'" d="M14 3v12a5 5 0 1 1-5-5m5-7c1 4 3 5 7 5" />
                <template v-else><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/></template>
              </svg>
            </div>

            <div>
              <p class="text-sm text-white/80">{{ network.label }}</p>
              <p class="break-all text-[11px] text-white/30 mt-1">
                {{ network.display }}
              </p>
            </div>
          </div>

          <svg
            class="size-4 shrink-0 opacity-50 transition-opacity group-hover:opacity-100 motion-reduce:transition-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M5 12h14m-6-6 6 6-6 6"
            />
          </svg>
        </a>
      </div>
    </div>

    <!-- Información -->
    <div
      data-anim
      :class="networks.length ? 'lg:col-span-6' : 'lg:col-span-12'" class="rounded-2xl border border-white/8 bg-white/[0.02] p-7 sm:p-8"
    >
      <p class="text-[9px] uppercase tracking-[0.3em] text-white/30">
        Información
      </p>

      <h3 class="font-barber text-xl uppercase mt-2 mb-6">Encuéntranos</h3>

      <BusinessContact class="mb-5" />
      <div class="space-y-5">
        <div v-if="business.data.address || business.data.city || business.data.mapsUrl" class="flex gap-4">
          <div
            class="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center shrink-0"
          >
            <svg
              class="w-4 h-4 text-[#ffb700]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M12 21s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z"
              />
              <circle cx="12" cy="9" r="2.5" stroke-width="1.5" />
            </svg>
          </div>

          <div>
            <p class="text-xs text-white/70">Ubicación</p>
            <p v-if="business.data.address" class="text-xs text-white/30 mt-1">{{ business.data.address }}</p><p v-if="business.data.city" class="text-xs text-white/30 mt-1">{{ business.data.city }}</p><a v-if="business.data.mapsUrl" :href="business.data.mapsUrl" target="_blank" rel="noopener noreferrer" class="mt-2 inline-block text-xs text-[#ffb700] hover:text-white focus-visible:outline-2 focus-visible:outline-[#ffb700]">Cómo llegar</a>
          </div>
        </div>


      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useBusinessStore } from "@/stores/business";
import BusinessContact from "@/components/UI/BusinessContact.vue";
import { useRevealOnScroll } from "@/composables/useRevealOnScroll";

const business = useBusinessStore();
const socialStyles: Record<string, {card: string; icon: string}> = {
  instagram: {
    card: "border-pink-400/20 bg-pink-400/[0.035] text-pink-300 hover:border-pink-400/45 hover:bg-pink-400/[0.07]",
    icon: "border-pink-400/25 bg-linear-to-br from-amber-400/15 via-pink-500/15 to-violet-500/15 text-pink-300",
  },
  facebook: {
    card: "border-blue-400/20 bg-blue-400/[0.035] text-blue-300 hover:border-blue-400/45 hover:bg-blue-400/[0.07]",
    icon: "border-blue-400/25 bg-blue-500/15 text-blue-400",
  },
  tiktok: {
    card: "border-cyan-300/20 bg-cyan-300/[0.025] text-cyan-200 hover:border-cyan-300/40 hover:bg-cyan-300/[0.055]",
    icon: "border-cyan-300/20 bg-cyan-300/10 text-cyan-200 [&>svg]:drop-shadow-[1px_1px_0_#fe2c55]",
  },
};
const networks = computed(() => ["instagram", "facebook", "tiktok"].filter(key => business.data[key]).map(key => {
  const href = business.data[key] as string;
  let display = href;
  try { const url = new URL(href); display = decodeURIComponent(url.pathname).replace(/^\/+|\/+$/g, ""); } catch {}
  return { key, href, display, label: ({instagram: "Instagram", facebook: "Facebook", tiktok: "TikTok"} as Record<string, string>)[key] };
}));
onMounted(() => business.load());
const gridRef = ref<HTMLElement | null>(null);

// Anima cada cuadro por separado (selector por defecto: [data-anim])
useRevealOnScroll(gridRef, {
  y: 50,
  stagger: 0.12,
  start: "top 85%",
});
</script>

<style scoped></style>