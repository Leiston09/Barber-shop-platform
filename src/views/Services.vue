<template>
  <section
    aria-labelledby="services-title"
    class="w-full flex-1 bg-neutral-950 px-5 py-6 text-white sm:px-10 sm:py-8 lg:px-15"
  >
    <div class="mx-auto max-w-4xl">
      <!-- ENCABEZADO CENTRADO -->
      <header class="mx-auto mb-5 max-w-2xl text-center sm:mb-6">
        <p class="mb-2 text-xs font-medium text-[#ffb700]">The Barber Studio</p>

        <h1
          id="services-title"
          class="font-barber text-3xl font-medium uppercase leading-none tracking-tight sm:text-3xl lg:text-4xl"
        >
          Tu estilo, en buenas manos.
        </h1>

        <p class="mx-auto mt-2 max-w-xl text-sm leading-6 text-white/60">
          Descubre nuestros servicios y prepara tu próxima visita. La barbería
          ya está disponible para reservar en línea.
        </p>
      </header>

      <!-- TARJETAS SIN MODIFICACIONES -->
      <div class="grid items-stretch gap-4 sm:gap-5 md:grid-cols-2">
        <!-- BARBERÍA -->
        <RouterLink
          :to="{ name: 'Reservaciones' }"
          aria-labelledby="barber-service-title"
          class="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-white/15 bg-neutral-900/60 transition-colors hover:border-[#ffb700]/60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffb700]"
        >
          <div class="relative h-36 overflow-hidden bg-[#201b15] sm:h-40">
            <SiteImage
              v-if="!failedImages.has('barber')"
              slot="service-barber"
              decoding="async"
              draggable="false"
              class="h-full w-full select-none object-cover"
              @error="failedImages.add('barber')"
            />

            <div
              v-else
              class="flex h-full items-center justify-center text-white/35"
            >
              <svg
                aria-hidden="true"
                class="size-16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.2"
              >
                <circle cx="6" cy="6" r="2.5" />
                <circle cx="6" cy="18" r="2.5" />
                <path
                  d="m8 8 12 12M14 10l6-6M8 16l12-12"
                  stroke-linecap="round"
                />
              </svg>
            </div>

            <div
              class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 to-transparent"
            />
          </div>

          <div class="flex flex-1 flex-col p-4 sm:p-5">
            <div
              class="mb-2 flex items-center gap-2 text-xs font-medium text-[#ffb700]"
            >
              <svg
                aria-hidden="true"
                class="size-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
              >
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path
                  d="M16 3v4M8 3v4M3 11h18m-13 5 2 2 5-5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>

              Reserva en línea
            </div>

            <h2
              id="barber-service-title"
              class="font-barber text-2xl font-medium uppercase leading-none tracking-tight "
            >
              Barbería
            </h2>

            <p class="mt-2 text-sm leading-5 text-white/65">
              Cortes, arreglo de barba, afeitado clásico y asesoría para
              encontrar el estilo que va contigo.
            </p>

            <div class="mt-auto pt-4">
              <span
                class="flex min-h-10 w-full items-center justify-between gap-3 rounded-xl bg-[#ffb700] px-4 py-2.5 text-sm font-semibold text-neutral-950 transition-colors hover:bg-[#e6a500] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffb700] motion-reduce:transition-none"
              >
                <span>Ir a reservas de barbería</span>

                <svg
                  aria-hidden="true"
                  class="size-4 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <path
                    d="m9 5 7 7-7 7"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>

              <p class="mt-2 text-xs leading-5 text-white/45">
                Consulta los horarios y elige a tu barbero al reservar.
              </p>
            </div>
          </div>
        </RouterLink>

        <!-- TATUAJES -->
        <article
          aria-labelledby="tattoo-service-title"
          role="link"
          aria-disabled="true"
          class="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/40 cursor-not-allowed"
        >
          <div class="relative h-36 overflow-hidden bg-[#e8e7e3] sm:h-40">
            <SiteImage
              v-if="!failedImages.has('tattoo')"
              slot="service-tattoo"
              decoding="async"
              draggable="false"
              class="h-full w-full select-none object-contain p-5 grayscale mix-blend-multiply sm:p-7"
              @error="failedImages.add('tattoo')"
            />

            <div
              v-else
              class="flex h-full items-center justify-center text-neutral-500"
            >
              <svg
                aria-hidden="true"
                class="size-16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.2"
              >
                <path
                  d="m4 20 3-1 12-12-2-2L5 17l-1 3Zm10-12 3 3M16 4l4 4M3 22h18"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>

          <div class="flex flex-1 flex-col p-4 sm:p-5">
            <p class="mb-2 text-xs font-medium text-white/50">Próximamente</p>

            <h2
              id="tattoo-service-title"
              class="font-barber text-2xl font-medium uppercase leading-none tracking-tight"
            >
              Tatuajes
            </h2>

            <p class="mt-2 text-sm leading-5 text-white/55">
              Diseños personalizados, línea fina, blackwork y color. Un nuevo
              espacio para llevar tus ideas a la piel.
            </p>

            <div class="mt-auto pt-4">
              <p
                class="flex min-h-10 items-center gap-3 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white/50"
              >
                <svg
                  aria-hidden="true"
                  class="size-4 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                >
                  <rect x="5" y="10" width="14" height="11" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke-linecap="round" />
                </svg>

                Reservas aún no disponibles
              </p>

              <p class="mt-2 text-xs leading-5 text-white/45">
                Esta categoría estará disponible más adelante.
              </p>
            </div>
          </div>
        </article>
      </div>

      <!-- MENSAJE INFERIOR CENTRADO -->
      <p
        class="mx-auto mt-4 max-w-2xl text-center text-xs leading-5 text-white/50"
      >
        Para gestionar tus citas necesitas iniciar sesión. Dentro de reservas
        podrás consultar tus citas o crear una nueva.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import SiteImage from "@/components/UI/SiteImage.vue";
import { reactive } from "vue";
import { RouterLink } from "vue-router";

const failedImages = reactive(new Set<string>());
</script>
