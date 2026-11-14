
<template>
  <div class="absolute inset-0 flex items-center pointer-events-none">
    <div
      class="mx-auto w-full max-w-7xl px-5 pt-[calc(var(--app-header-height)+1rem)] pb-[calc(var(--app-mobile-nav-clearance)+1rem)] sm:pl-24 sm:pr-8 lg:pl-32 lg:pr-12 xl:pl-36 xl:pr-16"
    >
      <div
        class="grid grid-cols-1 items-center gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-10 xl:gap-16"
      >
        <!-- TEXTO -->
        <div class="min-w-0 max-w-xl text-left order-2 lg:order-1">
          <p
            data-anim
            class="flex items-center gap-3 text-[11px] font-medium tracking-[0.16em] text-[#ffb700] sm:text-xs"
          >
            02 / La experiencia
          </p>

          <h2
            data-anim
            class="mt-3 font-barber text-[clamp(1.75rem,6vw,2.25rem)] font-medium uppercase leading-[1.02] tracking-[-0.025em] text-white sm:text-[2.5rem] lg:mt-4 lg:text-[clamp(3.25rem,5vw,4.75rem)] lg:leading-[0.92] lg:tracking-[-0.03em]"
          >
            MÁS QUE UNA
            <br />
            <span class="text-[#ffb700]">BARBERÍA.</span>
          </h2>

          <p
            data-anim
            class="mt-4 max-w-[440px] text-sm font-light leading-6 text-white/75 sm:text-[15px] lg:mt-5 lg:text-base lg:leading-7"
          >
            Un lugar donde el ambiente, la atención y los
            pequeños detalles hacen que cada visita sea diferente.
          </p>

          <p
            data-anim
            class="mt-4 max-w-[440px] pt-4 text-xs leading-5 text-white/55 sm:text-sm sm:leading-6 lg:text-[15px]"
          >
            Un espacio para desconectarte, disfrutar el momento
            y dedicarte tiempo.
          </p>
        </div>

        <!-- IMAGEN -->
        <div data-anim class="min-w-0 order-1 lg:order-2">
          <div
            class="relative h-[clamp(180px,27svh,300px)] w-full overflow-hidden rounded-2xl border border-white/15 bg-neutral-900 shadow-2xl shadow-black/30 sm:h-[clamp(260px,34svh,380px)] lg:h-[clamp(300px,56svh,560px)]"
          >
            <SiteImage
              slot="home-experience"
              class="h-full w-full object-cover object-center"
            />

            <div
              class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent"
            />

            <div
              class="absolute inset-x-0 bottom-0 p-4 sm:p-5 lg:p-6"
            >
              <p
                class="text-[10px] font-medium tracking-[0.12em] text-[#ffb700] sm:text-[11px]"
              >
                {{ media.find("home-experience")?.title }}
              </p>

              <p
                class="mt-2 max-w-xs font-barber text-base leading-snug text-white sm:text-lg lg:text-xl"
              >
                {{ media.find("home-experience")?.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const media = useSiteMediaStore();
import { useSiteMediaStore } from "@/stores/siteMedia";
import SiteImage from "@/components/UI/SiteImage.vue";
</script>
