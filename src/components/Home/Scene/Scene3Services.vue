<template>
  <div class="pointer-events-none absolute inset-0 flex items-center">
    <div
      class="mx-auto w-full max-w-7xl px-5 pt-20 pb-24 sm:pl-24 sm:pr-8 sm:pt-24 sm:pb-28 lg:pl-32 lg:pr-12 lg:pt-20 lg:pb-12 xl:pl-36 xl:pr-16"
    >
      <div
        class="grid grid-cols-1 items-center gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-10 xl:gap-16"
      >
        <!-- IMÁGENES DEL EQUIPO -->
        <div
          role="region"
          aria-label="Barberos de The Barber Studio"
          :aria-busy="loading"
          class="relative min-w-0"
          @mouseenter="hovered = true"
          @mouseleave="hovered = false"
          @focusin="focused = true"
          @focusout="handleFocusOut"
        >
          <div
            ref="carousel"
            class="pointer-events-auto mx-auto w-full overflow-hidden [--team-gap:0.75rem] sm:[--team-gap:1rem]"
            :class="
              cards.length === 1 ? 'max-w-48 sm:max-w-64' : 'max-w-[33rem]'
            "
          >
            <div
              class="flex w-full items-start gap-[var(--team-gap)]"
              :class="{
                'transition-transform duration-500 ease-in-out motion-reduce:transition-none':
                  sliding,
              }"
              :style="{
                transform: sliding
                  ? 'translateX(calc((100% + var(--team-gap)) / -2))'
                  : 'translateX(0)',
              }"
              @transitionend.self="finishSlide"
            >
              <!-- TARJETAS -->
              <div
                v-for="(barber, position) in visibleCards"
                :key="barber._id"
                data-anim
                :aria-label="barber.name"
                :aria-hidden="position > 1 ? true : undefined"
                class="pointer-events-auto relative aspect-[4/5] max-w-64 min-w-0 overflow-hidden rounded-2xl border border-white/15 bg-neutral-900 shadow-2xl shadow-black/30"
                :class="
                  cards.length === 1
                    ? 'w-full shrink-0'
                    : 'w-[calc((100%_-_var(--team-gap))_/_2)] shrink-0'
                "
              >
                <BarberPortrait
                  :id="barber._id"
                  :name="barber.name"
                  :revision="barber.photoUpdatedAt"
                  compact
                  class="absolute inset-0 h-full! w-full sm:h-full!"
                />
                <!-- FONDO -->
                <div
                  class="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent"
                ></div>

                <!-- NOMBRE -->
                <div class="absolute inset-x-0 bottom-0 p-3 sm:p-4 lg:p-5">
                  <p
                    :title="barber.name"
                    class="line-clamp-4 break-words font-barber text-xs leading-snug text-white sm:text-base lg:text-lg"
                  >
                    {{ barber.name }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="barbers.length > 2"
            class="pointer-events-auto mt-2 flex justify-end gap-1"
          >
            <button
              type="button"
              class="flex size-8 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-[#ffb700]"
              :aria-label="
                paused
                  ? 'Reanudar presentación del equipo'
                  : 'Pausar presentación del equipo'
              "
              :aria-pressed="paused"
              @click="paused = !paused"
            >
              <svg
                aria-hidden="true"
                class="size-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path :d="paused ? 'm9 5 10 7-10 7Z' : 'M9 5v14M15 5v14'" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Ver siguiente barbero"
              :disabled="sliding"
              class="flex size-8 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-[#ffb700] disabled:opacity-40"
              @click="nextBarber"
            >
              <svg
                aria-hidden="true"
                class="size-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m9 5 7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <!-- TEXTO -->
        <div class="min-w-0 max-w-xl text-left">
          <p
            data-anim
            class="flex items-center gap-3 text-xs font-medium tracking-widest text-[#ffb700]"
          >
            03 / El equipo
          </p>

          <h2
            data-anim
            class="mt-3 font-barber text-3xl font-medium uppercase leading-none tracking-tight text-white sm:text-4xl lg:mt-4 lg:text-5xl xl:text-6xl"
          >
            EL TALENTO
            <br />
            DETRÁS DE
            <br />
            <span class="text-[#ffb700]">CADA CORTE.</span>
          </h2>

          <p
            data-anim
            class="mt-4 max-w-md text-sm font-light leading-6 text-white/75 sm:text-base lg:mt-5 lg:leading-7"
          >
            Detrás de un buen resultado hay alguien que sabe escuchar, conoce su
            oficio y presta atención a los detalles. Conoce a quienes harán
            realidad tu próximo estilo.
          </p>

          <p
            data-anim
            class="mt-4 max-w-md pt-4 text-xs leading-5 text-white/55 sm:text-sm sm:leading-6"
          >
            Tu estilo, en buenas manos.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import BarberPortrait from "@/components/UI/BarberPortrait.vue";
import { getPublicTeam, type PublicBarber } from "@/api/TeamAPI";
import { useSceneStore } from "@/stores/navbar/currentScene";

const barbers = ref<PublicBarber[]>([]);
const loading = ref(true);
const error = ref(false);

let request: AbortController | undefined;

type BarberCard = PublicBarber;

const cards = computed<BarberCard[]>(() => {
  if (barbers.value.length > 0) {
    return barbers.value;
  }

  const name = loading.value ? "Consultando equipo…" : "No disponible";

  return [
    { _id: "placeholder-1", name },
    { _id: "placeholder-2", name },
  ];
});

const scene = useSceneStore();
const carousel = ref<HTMLElement | null>(null);
const firstCard = ref(0);
const sliding = ref(false);
const hovered = ref(false);
const focused = ref(false);
const paused = ref(false);
const pageHidden = ref(false);
const reducedMotion = ref(false);
let rotationTimer: ReturnType<typeof setTimeout> | undefined;
let motionQuery: MediaQueryList | undefined;
let entryRotationPending = scene.currentScene === 3;

const visibleCards = computed(() => {
  if (cards.value.length <= 2) return cards.value;
  return Array.from(
    { length: 3 },
    (_, offset) =>
      cards.value[(firstCard.value + offset) % cards.value.length]!,
  );
});
const canRotate = computed(
  () =>
    barbers.value.length > 2 &&
    scene.currentScene === 3 &&
    !hovered.value &&
    !focused.value &&
    !paused.value &&
    !pageHidden.value &&
    !reducedMotion.value &&
    !sliding.value,
);

function scheduleRotation() {
  clearTimeout(rotationTimer);
  if (!canRotate.value) return;
  // Give the initial positions one render before starting the entry movement.
  rotationTimer = setTimeout(() => {
    if (!canRotate.value) return;
    entryRotationPending = false;
    nextBarber();
  }, entryRotationPending ? 32 : 2000);
}
function nextBarber() {
  if (sliding.value || cards.value.length <= 2) return;
  clearTimeout(rotationTimer);
  if (reducedMotion.value)
    firstCard.value = (firstCard.value + 1) % cards.value.length;
  else sliding.value = true;
}
function finishSlide() {
  if (!sliding.value) return;
  firstCard.value = (firstCard.value + 1) % cards.value.length;
  sliding.value = false;
}
function handleFocusOut(event: FocusEvent) {
  focused.value =
    event.relatedTarget instanceof Node &&
    !!carousel.value?.parentElement?.contains(event.relatedTarget);
}
function updateVisibility() {
  pageHidden.value = document.hidden;
}
function updateMotion() {
  reducedMotion.value = motionQuery?.matches ?? false;
  if (reducedMotion.value) finishSlide();
}
watch(canRotate, scheduleRotation);
watch(() => scene.currentScene, (current) => {
  entryRotationPending = current === 3;
  scheduleRotation();
}, { flush: "post" });
watch(barbers, () => {
  clearTimeout(rotationTimer);
  firstCard.value = 0;
  sliding.value = false;
  scheduleRotation();
});

async function loadTeam() {
  request?.abort();

  const controller = new AbortController();
  request = controller;

  loading.value = true;
  error.value = false;

  try {
    const team = await getPublicTeam(controller.signal);

    if (!controller.signal.aborted) {
      barbers.value = team;
    }
  } catch {
    if (!controller.signal.aborted) {
      error.value = true;
      barbers.value = [];
    }
  } finally {
    if (!controller.signal.aborted) {
      loading.value = false;
    }
  }
}

onMounted(() => {
  motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  updateMotion();
  updateVisibility();
  motionQuery.addEventListener("change", updateMotion);
  document.addEventListener("visibilitychange", updateVisibility);
  loadTeam();
});

onBeforeUnmount(() => {
  request?.abort();
  clearTimeout(rotationTimer);
  motionQuery?.removeEventListener("change", updateMotion);
  document.removeEventListener("visibilitychange", updateVisibility);
});
</script>
