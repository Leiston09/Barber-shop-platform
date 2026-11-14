<template>
  <header
    data-app-navbar
    ref="headerElement"
    class="fixed inset-x-0 top-0 z-50 border-b px-2 py-2.5 transition-[background-color,border-color] duration-200 min-[360px]:px-3 sm:px-6 lg:px-8 motion-reduce:transition-none"
    :class="showBackground
      ? 'border-white/[0.06] bg-black/20 backdrop-blur-md'
      : 'border-transparent bg-black/5 backdrop-blur-sm'"
  >
    <div class="mx-auto flex w-full max-w-7xl items-center justify-between gap-1 sm:gap-3">
      <RouterLink
        :to="{ name: 'Home' }"
        class="flex shrink-0 items-center gap-1.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffb700]"
        aria-label="Studio Silhouette, inicio"
      >
        <SiteImage
          slot="logo"
          alt=""
          class="size-8 rounded-lg border border-white/10 bg-white/[0.03] object-contain p-0.5 sm:size-11"
        />
        <div class="leading-none">
          <p class="text-[11px] font-medium tracking-[0.16em] sm:text-[14px] sm:tracking-[0.24em] text-white">STUDIO</p>
          <p class="mt-1 text-[9px] tracking-[0.12em] sm:mt-1.5 sm:text-[10px] sm:tracking-[0.28em] text-[#ffb700]">SILHOUETTE</p>
        </div>
      </RouterLink>

      <Laptop />

      <div class="flex shrink-0 items-center gap-1 sm:gap-3">
        <button
          v-if="user.isAuthenticated && !user.isAdmin && !user.isBarber"
          type="button"
          aria-label="Nueva cita"
          :class="reservationButtonClass"
          @click="checkAuthAndShowWarning"
        >
          <ReservationButtonContent />
        </button>
        <DashboardHelp v-if="!user.isAuthenticated" label="Nueva cita" text="Inicia sesión para reservar tu cita." :class="reservationButtonClass"><ReservationButtonContent /></DashboardHelp>
        <ClientNotifications v-if="user.user?.role === 'client'" :key="user.user._id" />
        <AccountMenu />
      </div>
    </div>
  </header>

  <AuthWarning
    v-model:visible="showWarning"
    title="Reserva tu próxima cita"
    message="Para continuar con tu reserva, inicia sesión o crea una cuenta. Así podremos guardar tu cita, asignarte un horario y enviarte la confirmación."
    :steps="[
      'Inicia sesión si ya tienes una cuenta',
      'Crea una cuenta gratis si aún no tienes una',
      'Elige tus servicios, fecha y hora',
      'Confirma tu cita y recibe la confirmación por correo',
    ]"
    :buttons="['Iniciar sesión', 'Crear cuenta']"
    @button-click="handleWarningButton"
  />
  <Mobile />
</template>

<script setup lang="ts">
import SiteImage from "@/components/UI/SiteImage.vue";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import { useSceneStore } from "@/stores/navbar/currentScene";
import AuthWarning from "../UI/AuthWarning.vue";
import Laptop from "./device/Laptop.vue";
import Mobile from "./device/Mobile.vue";
import ClientNotifications from "./ClientNotifications.vue";
import DashboardHelp from "@/components/admin/DashboardHelp.vue";
import ReservationButtonContent from "./ReservationButtonContent.vue";
import AccountMenu from "./AccountMenu.vue";

const reservationButtonClass = "group inline-flex h-11! min-h-11 w-auto! shrink-0 items-center justify-center gap-1.5 rounded-xl! border border-[#ffb700] bg-[#ffb700]! py-0! pl-2! pr-2.5! text-[#171100]! shadow-[0_3px_14px_#ffb70018] transition-[background-color,box-shadow,transform] duration-200 hover:bg-[#ffc52e]! hover:shadow-[0_4px_18px_#ffb70025] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb700] motion-reduce:transform-none motion-reduce:transition-none sm:gap-3 sm:pl-2.5! sm:pr-4!";
const emit = defineEmits<{ "height-change": [height: number] }>();
const headerElement = ref<HTMLElement | null>(null);
let headerObserver: ResizeObserver | undefined;

const reportHeaderHeight = () => {
  const height = headerElement.value?.getBoundingClientRect().height;
  if (height) emit("height-change", Math.ceil(height));
};

onMounted(() => {
  reportHeaderHeight();
  if (typeof ResizeObserver !== "undefined" && headerElement.value) {
    headerObserver = new ResizeObserver(reportHeaderHeight);
    headerObserver.observe(headerElement.value);
  } else {
    window.addEventListener("resize", reportHeaderHeight);
  }
});

onBeforeUnmount(() => {
  headerObserver?.disconnect();
  window.removeEventListener("resize", reportHeaderHeight);
});

const router = useRouter();
const route = useRoute();
const user = useUserStore();
const sceneStore = useSceneStore();
const showWarning = ref(false);

const showBackground = computed(() =>
  route.name !== "Home" || sceneStore.currentScene === 4,
);

const checkAuthAndShowWarning = () => {
  if (!user.isAuthenticated) {
    showWarning.value = true;
    return;
  }
  router.push({ name: "AppointmentSlot" });
};

const handleWarningButton = (index: number) => {
  showWarning.value = false;
  if (index === 0) router.push({ name: "Login" });
  else if (index === 1) router.push({ name: "Register" });
};
</script>
