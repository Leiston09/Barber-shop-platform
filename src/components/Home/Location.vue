
<template>
  <section
    id="ubicacion"
    aria-labelledby="location-title"
    class="w-full border-t border-white/10 bg-neutral-950 px-5 py-12 text-white sm:px-10 lg:px-15 lg:py-14"
  >
    <div class="mx-auto max-w-7xl">
      <!-- ENCABEZADO -->
      <header class="mb-8 max-w-2xl">
        <p class="mb-2 text-xs font-semibold uppercase tracking-widest text-amber-400">
          Ubicación
        </p>

        <h2
          id="location-title"
          class="font-barber text-4xl font-light tracking-tight sm:text-5xl lg:text-6xl"
        >
          Encuéntranos
        </h2>

        <p class="mt-3 max-w-lg text-sm leading-6 text-white/50">
          Conoce el espacio donde cuidamos
          cada detalle de tu estilo.
        </p>
      </header>

      <!-- CONTENIDO PRINCIPAL -->
      <div
        class="grid grid-cols-1 items-stretch gap-7 lg:grid-cols-[minmax(0,1.3fr)_minmax(300px,0.7fr)] lg:gap-9"
      >
        <!-- COLUMNA IZQUIERDA -->
        <div class="flex min-w-0 flex-col gap-7">
          <!-- MAPA -->
          <div>
            <div class="mb-3 flex items-center justify-between gap-3">
              <h3 class="font-barber text-xl font-light sm:text-2xl">
                Nuestra ubicación
              </h3>

              <span class="text-xs text-white/40">
                {{ business.data.city }}
              </span>
            </div>

            <a
              :href="mapsUrl"
              :aria-disabled="!mapsUrl"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abrir ubicación en Google Maps"
              class="group relative block h-56 w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 sm:h-64 lg:h-72"
            >
              <SiteImage
                slot="location-map"
                loading="lazy"
                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
              />

              <div
                class="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/35"
              />

              <div
                class="absolute right-4 bottom-4 left-4 flex flex-wrap items-center justify-between gap-2"
              >
                <span
                  class="rounded-lg border border-white/15 bg-neutral-950/90 px-3 py-2 text-xs font-medium backdrop-blur-sm"
                >
                  The Barber Studio
                </span>

                <span
                  v-if="mapsUrl" class="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-3 py-2 text-xs font-semibold text-neutral-950 transition-colors group-hover:bg-amber-300"
                >
                  Cómo llegar

                  <svg
                    class="size-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    aria-hidden="true"
                  >
                    <path
                      d="M7 17 17 7M7 7h10v10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </a>

            <!-- DIRECCIÓN -->
            <div
              class="mt-3 flex items-start gap-3 rounded-xl border border-white/10 bg-neutral-900/60 p-3.5"
            >
              <svg
                class="mt-0.5 size-5 shrink-0 text-amber-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                aria-hidden="true"
              >
                <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>

              <div>
                <p class="text-sm font-medium">
                  {{ business.data.city }}
                </p>
                <p class="mt-1 text-xs text-white/45">
                  {{ business.data.address }}
                </p>
              </div>
            </div>
          </div>

          <!-- GALERÍA -->
          <div class="flex flex-col lg:flex-1">
            <div class="mb-4">
              <p class="mb-1 text-xs font-semibold uppercase tracking-widest text-amber-400">
                Nuestro espacio
              </p>

              <h3 class="font-barber text-2xl font-light sm:text-3xl">
                Conoce The Barber Studio
              </h3>
            </div>

            <div
              class="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 lg:flex-1"
            >
              <div
                role="region"
                aria-roledescription="carrusel"
                aria-label="Fotografías del local"
                tabindex="0"
                class="relative h-56 overflow-hidden bg-neutral-900 sm:h-72 lg:h-auto lg:min-h-72 lg:flex-1 focus-visible:outline-2 focus-visible:outline-amber-400"
                @keydown.left.prevent="changePhoto(-1)"
                @keydown.right.prevent="changePhoto(1)"
              >
                <Transition
                  enter-active-class="transition-opacity duration-300 motion-reduce:transition-none"
                  enter-from-class="opacity-0"
                  enter-to-class="opacity-100"
                  leave-active-class="absolute inset-0 transition-opacity duration-300 motion-reduce:transition-none"
                  leave-from-class="opacity-100"
                  leave-to-class="opacity-0"
                >
                  <div :key="photoIndex" class="absolute inset-0">
                    <img
                      v-if="currentPhoto.src && !failedPhotos.has(photoIndex)"
                      :src="currentPhoto.src"
                      :alt="currentPhoto.alt"
                      :data-photo-index="photoIndex"
                      loading="lazy"
                      class="h-full w-full object-cover"
                      @error="markPhotoFailed"
                    />

                    <div
                      v-else
                      class="flex h-full flex-col items-center justify-center gap-3 px-6 text-center"
                    >
                      <svg
                        class="size-9 text-amber-400/50"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.4"
                        aria-hidden="true"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="3" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="m3 17 5-5 4 4 3-3 6 6" />
                      </svg>

                      <p class="text-xs text-white/40">
                        Fotografía próximamente
                      </p>
                    </div>

                    <div
                      class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"
                    />
                  </div>
                </Transition>

                <div
                  class="pointer-events-none absolute right-5 bottom-4 left-5 flex items-end justify-between gap-3"
                >
                  <div>
                    <p class="text-xs text-white/60">
                      The Barber Studio
                    </p>

                    <h4 class="mt-1 font-barber text-xl sm:text-2xl">
                      {{ currentPhoto.title }}
                    </h4>
                  </div>

                  <span
                    class="rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs tabular-nums"
                  >
                    {{ photoIndex + 1 }} / {{ photos.length }}
                  </span>
                </div>

                <!-- ANTERIOR -->
                <button
                  type="button"
                  aria-label="Fotografía anterior"
                  class="absolute top-1/2 left-3 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/60 transition-colors hover:border-amber-400 hover:text-amber-400 focus-visible:outline-2 focus-visible:outline-amber-400"
                  @click="changePhoto(-1)"
                >
                  <svg
                    class="size-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    aria-hidden="true"
                  >
                    <path d="m15 18-6-6 6-6" stroke-linecap="round" />
                  </svg>
                </button>

                <!-- SIGUIENTE -->
                <button
                  type="button"
                  aria-label="Fotografía siguiente"
                  class="absolute top-1/2 right-3 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/60 transition-colors hover:border-amber-400 hover:text-amber-400 focus-visible:outline-2 focus-visible:outline-amber-400"
                  @click="changePhoto(1)"
                >
                  <svg
                    class="size-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    aria-hidden="true"
                  >
                    <path d="m9 18 6-6-6-6" stroke-linecap="round" />
                  </svg>
                </button>
              </div>

              <!-- DESCRIPCIÓN -->
              <div
                class="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 px-4 py-3"
              >
                <p class="max-w-md text-xs leading-5 text-white/55">
                  {{ currentPhoto.description }}
                </p>

                <div class="flex items-center">
                  <button
                    v-for="(photo, index) in photos"
                    :key="photo._id"
                    type="button"
                    :aria-label="`Ver ${photo.title}`"
                    :aria-current="photoIndex === index ? 'true' : undefined"
                    class="flex size-9 cursor-pointer items-center justify-center focus-visible:outline-2 focus-visible:outline-amber-400"
                    @click="photoIndex = index"
                  >
                    <span
                      class="h-1.5 rounded-full transition-all"
                      :class="
                        photoIndex === index
                          ? 'w-5 bg-amber-400'
                          : 'w-1.5 bg-white/30'
                      "
                    />
                  </button>
                </div>
              </div>

              <p class="sr-only" aria-live="polite">
                {{ currentPhoto.title }},
                fotografía {{ photoIndex + 1 }} de {{ photos.length }}
              </p>
            </div>
          </div>
        </div>

        <!-- COLUMNA DERECHA -->
        <aside class="flex min-w-0 flex-col gap-5">
          <!-- HORARIO COMPACTO -->
          <div
            class="overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/70"
          >
            <div
              class="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4"
            >
              <div>
                <p
                  class="text-xs font-semibold uppercase tracking-widest text-amber-400"
                >
                  Atención
                </p>

                <h3
                  class="mt-1 font-barber text-xl font-light sm:text-2xl"
                >
                  Horario de atención
                </h3>
              </div>

              <div
                class="flex size-9 shrink-0 items-center justify-center rounded-lg border border-amber-400/20 bg-amber-400/10"
              >
                <svg
                  class="size-5 text-amber-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" stroke-linecap="round" />
                </svg>
              </div>
            </div>

            <!-- SIETE DÍAS -->
            <div :aria-busy="loading" class="px-5 py-1">
              <span v-if="loading" class="sr-only" role="status">
                Consultando horario
              </span>

              <dl>
                <div
                  v-for="day in orderedDays"
                  :key="day"
                  class="flex min-h-10 items-center justify-between gap-3 border-b border-white/5 py-2 last:border-0"
                >
                  <dt class="text-xs text-white/60 sm:text-sm">
                    {{ dayNames[day] }}
                  </dt>

                  <dd
                    v-if="loading"
                    class="text-xs text-white/40"
                  >
                    Consultando…
                  </dd>

                  <dd
                    v-else-if="error"
                    class="text-xs text-white/40"
                  >
                    Sin confirmar
                  </dd>

                  <dd
                    v-else-if="hours[day]?.isWorking"
                    class="shrink-0 text-xs font-medium tabular-nums text-white/90 sm:text-sm"
                  >
                    {{ hours[day]?.startTime }}
                    —
                    {{ hours[day]?.endTime }}
                  </dd>

                  <dd
                    v-else
                    class="text-xs font-medium text-white/35 sm:text-sm"
                  >
                    Cerrado
                  </dd>
                </div>
              </dl>
            </div>

            <div class="border-t border-white/10 px-5 py-3">
              <p class="text-xs leading-5 text-white/40">
                Horario habitual. Consulta los turnos disponibles
                al realizar tu reserva.
              </p>
            </div>
          </div>

          <!-- CONTACTO COMPACTO -->
          <div
            class="rounded-2xl border border-white/10 bg-neutral-900/50 p-5"
          >
            <p
              class="text-xs font-semibold uppercase tracking-widest text-amber-400"
            >
              Contacto
            </p>

            <h3 class="mt-2 font-barber text-xl font-light">
              Estamos para atenderte
            </h3>

            <BusinessContact compact class="mt-4" />
          </div>


<!-- TARJETA DE EXPERIENCIA -->
<div
  class="relative flex flex-col justify-center overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/60 p-6 lg:flex-1"
>
  <!-- DETALLE DECORATIVO -->
  <div
    class="absolute top-0 left-0 h-1 w-20 rounded-br-full bg-amber-400"
  ></div>

  <!-- ENCABEZADO -->
  <div class="mb-4 flex items-center justify-between">
    <span
      class="text-xs font-semibold uppercase tracking-widest text-amber-400"
    >
      The Barber Studio
    </span>

    <div
      class="flex size-10 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10"
    >
      <svg
        class="size-5 text-amber-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
        aria-hidden="true"
      >
        <circle cx="6" cy="6" r="2" />
        <circle cx="6" cy="18" r="2" />
        <path
          d="m8 8 12 12M14 10l6-6M8 16l12-12"
          stroke-linecap="round"
        />
      </svg>
    </div>
  </div>

  <!-- TÍTULO -->
  <h3
    class="font-barber text-2xl font-light leading-tight text-white sm:text-3xl"
  >
    Más que un corte,
    <span class="text-amber-400">
      una experiencia.
    </span>
  </h3>

  <!-- DESCRIPCIÓN -->
  <p
    class="mt-4 text-sm leading-6 font-light text-white/55"
  >
    Un espacio donde el estilo, la atención personalizada
    y el cuidado de cada detalle forman parte de tu experiencia.
  </p>

  <!-- PIE -->
  <div
    class="mt-6 flex items-center gap-3 border-t border-white/10 pt-4"
  >

    <p
      class="text-xs font-medium uppercase tracking-wider text-white/50"
    >
      Tu estilo, nuestra dedicación.
    </p>
  </div>
</div>



        </aside>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import BusinessContact from "@/components/UI/BusinessContact.vue";
import {computed as contactComputed} from "vue";
import {useBusinessStore} from "@/stores/business";
const business=useBusinessStore();
import { watch } from "vue";
import { useSiteMediaStore, siteMediaUrl } from "@/stores/siteMedia";
import SiteImage from "@/components/UI/SiteImage.vue";
import {
  computed,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
} from "vue";

import {
  getBusinessHours,
  type BusinessDayHours,
} from "@/api/LocationAPI";

// GOOGLE MAPS
const mapsUrl=contactComputed(()=>business.data.mapsUrl || undefined);

// FOTOGRAFÍAS
const media = useSiteMediaStore();
const photos = computed(() => {
  const gallery = media.items.filter(item => item.slot === "gallery").sort((a, b) => a.order - b.order || a._id.localeCompare(b._id))
    .map(item => ({ ...item, src: siteMediaUrl(item) }));
  return gallery.length ? gallery : [{ _id: "empty-gallery", title: "Nuestro espacio", description: "", alt: "Fotografías del local", src: "" }];
});

const photoIndex = ref(0);

const currentPhoto = computed(
  () => photos.value[photoIndex.value] || photos.value[0]!
);

const failedPhotos = reactive(new Set<number>());
watch(photos, () => { photoIndex.value = 0; failedPhotos.clear(); });

function markPhotoFailed(event: Event) {
  const index = Number(
    (event.target as HTMLImageElement).dataset.photoIndex
  );

  if (Number.isInteger(index)) {
    failedPhotos.add(index);
  }
}

function changePhoto(direction: number) {
  photoIndex.value =
    (photoIndex.value + direction + photos.value.length) %
    photos.value.length;
}

// HORARIO
const orderedDays = [1, 2, 3, 4, 5, 6, 0];

const dayNames = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

const hours = ref<BusinessDayHours[]>([]);
const loading = ref(true);
const error = ref(false);

let request: AbortController | undefined;

async function loadHours() {
  request?.abort();

  const controller = new AbortController();
  request = controller;

  loading.value = true;
  error.value = false;

  try {
    const days = await getBusinessHours(
      controller.signal
    );

    if (!controller.signal.aborted) {
      hours.value = days;
    }
  } catch {
    if (!controller.signal.aborted) {
      error.value = true;
    }
  } finally {
    if (!controller.signal.aborted) {
      loading.value = false;
    }
  }
}

onMounted(() => {
  void loadHours();
});

onBeforeUnmount(() => {
  request?.abort();
});
</script>
