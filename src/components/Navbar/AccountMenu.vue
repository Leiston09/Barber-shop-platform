<template>
  <RouterLink
    v-if="!user.isAuthenticated"
    :to="{ name: 'Login' }"
    class="inline-flex min-h-11 shrink-0 items-center justify-center gap-1 whitespace-nowrap sm:gap-2 rounded-xl border border-white/15 bg-transparent px-1.5 min-[360px]:px-2 text-[11px] font-medium text-white transition-colors hover:border-white/30 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffb700] sm:px-4 sm:text-[13px]"
  >
    <svg aria-hidden="true" class="size-3.5 shrink-0 text-white/65 sm:size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5m5 5H3" />
    </svg>
    Iniciar sesión
  </RouterLink>

  <div v-else ref="container" class="relative" @focusout="handleFocusOut">
    <button
      ref="trigger"
      type="button"
      class="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.025] px-2 py-1.5 text-white transition-colors hover:border-white/30 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffb700] sm:gap-2.5 sm:px-2.5"
      :aria-expanded="open"
      :aria-controls="panelId"
      :aria-label="'Cuenta de ' + displayName + ', ' + roleLabel"
      @click="open = !open"
      @keydown.down.prevent="openAndFocus"
    >
      <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#ffb700]/15 bg-[#ffb700]/10 text-sm font-semibold text-[#ffb700]" aria-hidden="true">
        <svg aria-hidden="true" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="8" r="3.5" /><path d="M5 21v-2a7 7 0 0 1 14 0v2" /></svg>
      </span>
      <span class="hidden min-w-0 text-left sm:block">
        <span class="block max-w-28 truncate text-[13px] font-medium leading-5">{{ displayName }}</span>
        <span class="block text-[11px] leading-4 text-white/65">{{ roleLabel }}</span>
      </span>
      <svg aria-hidden="true" class="hidden h-3.5 w-3.5 shrink-0 text-white/65 transition-transform motion-reduce:transition-none sm:block" :class="{ 'rotate-180': open }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>

    <Transition name="account">
      <div
        v-if="open"
        :id="panelId"
        ref="panel"
        role="region"
        aria-label="Mi cuenta"
        class="absolute right-0 top-full mt-3 w-72 max-w-[calc(100vw_-_2rem)] overflow-hidden rounded-xl border border-white/15 bg-[#111111]/95 backdrop-blur-xl text-white shadow-[0_16px_48px_rgba(0,0,0,0.45)]"
      >
        <div class="border-b border-white/10 px-4 py-4">
          <div class="mb-1 flex items-center justify-between gap-3">
            <p class="truncate text-sm font-semibold">{{ displayName }}</p>
            <span class="shrink-0 rounded border border-[#ffb700]/20 bg-[#ffb700]/10 px-2 py-0.5 text-[10px] text-[#ffb700]">{{ roleLabel }}</span>
          </div>
          <p class="break-all text-xs leading-5 text-white/65">{{ user.user?.email }}</p>
        </div>

        <nav aria-label="Accesos de mi cuenta" class="p-2">
          <RouterLink
            :to="{ name: accountRoute }"
            class="flex min-h-11 items-center gap-3 rounded-lg px-3 text-[13px] text-white/90 transition-colors hover:bg-white/7 focus-visible:outline-2 focus-visible:outline-[#ffb700]"
            @click="closeMenu()"
          >
            <svg aria-hidden="true" class="h-4 w-4 text-[#ffb700]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <path d="M8 3v4m8-4v4M4 10h16M5 5h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
            </svg>
            {{ accountLabel }}
          </RouterLink>
        <button type="button" @click="open = false; settingsOpen = true" class="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-[13px] text-white/80 transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-[#ffb700]"><svg aria-hidden="true" class="size-4 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4 7h16M4 17h16" /><circle cx="9" cy="7" r="2" fill="#111" /><circle cx="15" cy="17" r="2" fill="#111" /></svg>Configuración</button>
        </nav>

        <div class="border-t border-white/10 p-2">
          <button
            type="button"
            class="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-[13px] font-medium text-red-300 transition-colors hover:bg-red-400/10 hover:text-red-200 focus-visible:outline-2 focus-visible:outline-red-300"
            @click="handleLogout"
          >
            <svg aria-hidden="true" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4m7-14 5 5-5 5m5-5H9" />
            </svg>
            Cerrar sesión
          </button>
        </div>
      </div>
    </Transition>
  </div>
  <ProfileSettings v-if="settingsOpen" @close="settingsOpen = false" />
</template>

<script setup lang="ts">
import ProfileSettings from "@/components/UI/ProfileSettings.vue";
const settingsOpen = ref(false);
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";

const user = useUserStore();
const route = useRoute();
const open = ref(false);
const container = ref<HTMLElement | null>(null);
const trigger = ref<HTMLButtonElement | null>(null);
const panel = ref<HTMLElement | null>(null);
const panelId = "navbar-account-" + useId();
const displayName = computed(() => user.getUserName || "Mi cuenta");

const roleLabel = computed(() => user.isAdmin ? "Administrador" : user.isBarber ? "Barbero" : "Cliente");
const accountRoute = computed(() => user.isAdmin ? "Admin" : user.isBarber ? "Barber-Clients" : "Reservaciones");
const accountLabel = computed(() => user.isAdmin ? "Administración" : user.isBarber ? "Mi agenda" : "Mis citas");

function closeMenu(restoreFocus = false) {
  open.value = false;
  if (restoreFocus) trigger.value?.focus();
}

async function openAndFocus() {
  open.value = true;
  await nextTick();
  panel.value?.querySelector<HTMLElement>("a, button")?.focus();
}

function handleOutsideClick(event: PointerEvent) {
  if (event.target instanceof Node && !container.value?.contains(event.target)) closeMenu();
}

function handleEscape(event: KeyboardEvent) {
  if (event.key === "Escape" && open.value) {
    event.preventDefault();
    closeMenu(true);
  }
}

function handleFocusOut(event: FocusEvent) {
  if (event.relatedTarget instanceof Node && !container.value?.contains(event.relatedTarget)) closeMenu();
}

function handleLogout() {
  closeMenu();
  user.logout();
}

watch(() => route.fullPath, () => closeMenu());
watch(() => user.isAuthenticated, () => closeMenu());

onMounted(() => {
  document.addEventListener("pointerdown", handleOutsideClick);
  document.addEventListener("keydown", handleEscape);
});
onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", handleOutsideClick);
  document.removeEventListener("keydown", handleEscape);
});
</script>

<style scoped>
.account-enter-active,
.account-leave-active {
  transition: opacity 140ms ease, transform 140ms ease;
}
.account-enter-from,
.account-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
@media (prefers-reduced-motion: reduce) {
  .account-enter-active,
  .account-leave-active {
    transition: none;
  }
}
</style>
