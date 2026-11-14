<template>
  <Teleport v-if="target" :to="target">
    <div ref="stack" :style="{ '--notification-top': topOffset + 'px' }" class="pointer-events-none fixed top-[var(--notification-top)] left-4 right-4 z-[10000] overflow-visible sm:left-auto sm:right-6 sm:w-[380px]" aria-label="Notificaciones de la aplicación">
      <div role="status" aria-live="polite" aria-atomic="true" class="sr-only">{{ announcements.polite }}</div>
      <div role="alert" aria-live="assertive" aria-atomic="true" class="sr-only">{{ announcements.urgent }}</div>
      <TransitionGroup @before-leave="holdHeight" @after-leave="releaseHeight" @leave-cancelled="releaseHeight" tag="ol" class="relative flex list-none flex-col gap-3 p-0.5"
        enter-active-class="transition-[opacity,transform,filter] duration-300 ease-[cubic-bezier(.16,1,.3,1)] motion-reduce:transition-none"
        enter-from-class="translate-x-3 scale-[.98] opacity-0 blur-[2px]"
        enter-to-class="translate-x-0 scale-100 opacity-100 blur-0"
        leave-active-class="absolute left-0 right-0 transition-[opacity,transform] duration-200 ease-in motion-reduce:transition-none"
        leave-from-class="translate-x-0 scale-100 opacity-100"
        leave-to-class="translate-x-3 scale-[.98] opacity-0"
        move-class="transition-transform duration-300 ease-out motion-reduce:transition-none">
        <li v-for="notice in notifications" :key="notice.id" :data-notice-id="notice.id" :data-notice-type="notice.type"
          class="pointer-events-auto flex min-w-0 items-start gap-3 rounded-xl border border-white/15 bg-[#151515] p-4 text-white shadow-[0_12px_36px_#00000066]"
          @mouseenter="pauseNotice(notice.id, 'pointer')" @mouseleave="resumeNotice(notice.id, 'pointer')"
          @focusin="pauseNotice(notice.id, 'focus')" @focusout="leaveFocus($event, notice.id)">
          <span aria-hidden="true" class="relative mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full"
            :class="notice.type === 'error' ? 'bg-rose-400/10 text-rose-300' : notice.type === 'info' ? 'bg-white/5 text-white/65' : 'bg-[#ffb700]/10 text-[#ffb700]'">
            <svg v-if="notice.duration" class="absolute inset-0 size-10 -rotate-90" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" stroke="currentColor" stroke-width="1.3" opacity=".13" /><circle cx="20" cy="20" r="18" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-dasharray="113.1" :stroke-dashoffset="113.1 * (1 - notice.remaining / notice.duration)" opacity=".65" /></svg>
            <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
              <path v-if="notice.type === 'success'" d="m5 12 4 4L19 6" />
              <template v-else-if="notice.type === 'error'"><path d="m8 8 8 8m0-8-8 8" /><circle cx="12" cy="12" r="9" stroke-width="1.3" /></template>
              <template v-else-if="notice.type === 'warning'"><path d="M12 4 2.8 20h18.4L12 4Z" stroke-width="1.3" /><path d="M12 9v4m0 3h.01" /></template>
              <template v-else><circle cx="12" cy="12" r="8.5" stroke-width="1.3" /><path d="M12 11v5m0-9h.01" /></template>
            </svg>
          </span>
          <div class="min-w-0 flex-1 pt-0.5"><p class="text-[13px] font-semibold leading-5" :class="notice.type === 'error' ? 'text-rose-200' : 'text-white/90'">{{ notice.title }}</p><p class="mt-1 whitespace-pre-line text-[13px] leading-[1.65] text-white/65 [overflow-wrap:anywhere]">{{ notice.message }}</p></div>
          <button v-if="notice.dismissible" type="button" @click="dismiss(notice.id)" aria-label="Cerrar notificación" class="-mr-2 -mt-2 flex size-10 shrink-0 items-center justify-center rounded-lg text-white/35 transition-colors hover:bg-white/5 hover:text-[#ffb700] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb700] motion-reduce:transition-none"><svg aria-hidden="true" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="m6 6 12 12M18 6 6 18" /></svg></button>
        </li>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, shallowRef } from "vue";
import { announcements, dismiss, notifications, pauseNotice, pauseNotifications, resumeNotice } from "@/lib/notifications";
const target = shallowRef<HTMLElement | null>(null);
const stack = shallowRef<HTMLElement | null>(null);
let exiting = 0;
function holdHeight() { exiting++; if (stack.value) stack.value.style.minHeight = stack.value.getBoundingClientRect().height + "px"; }
function releaseHeight() { exiting = Math.max(0, exiting - 1); if (!exiting && stack.value) stack.value.style.minHeight = ""; }
let observer: MutationObserver | undefined, headerObserver: ResizeObserver | undefined;
let navbar: HTMLElement | null = null;
const topOffset = ref(16);
function measureNavbar() {
  const bottom = navbar?.getBoundingClientRect().bottom ?? 0;
  topOffset.value = Math.max(16, Math.ceil(bottom) + (bottom > 0 ? 12 : 0));
}
function updateNavbar() {
  const next = document.querySelector<HTMLElement>("[data-app-navbar]");
  if (navbar !== next) {
    headerObserver?.disconnect(); navbar = next;
    if (navbar && typeof ResizeObserver !== "undefined") {
      headerObserver = new ResizeObserver(measureNavbar); headerObserver.observe(navbar);
    }
  }
  measureNavbar();
}
function updateTarget(records: MutationRecord[] = []) {
  updateNavbar();
  const opened = [...records].reverse().find(record => record.type === "attributes" && record.target instanceof HTMLDialogElement && record.target.open)?.target as HTMLDialogElement | undefined;
  const focused = document.activeElement?.closest<HTMLDialogElement>("dialog[open]");
  const dialogs = document.querySelectorAll<HTMLDialogElement>("dialog[open]");
  const next = opened?.isConnected ? opened : focused || dialogs[dialogs.length - 1] || document.body;
  if (target.value !== next) target.value = next;
}
function leaveFocus(event: FocusEvent, id: number) {
  if (!(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node | null)) resumeNotice(id, "focus");
}
function visibility() { pauseNotifications("hidden", document.hidden); }
function blur() { pauseNotifications("window", true); }
function focus() { pauseNotifications("window", false); }
onMounted(() => {
  updateTarget();
  observer = new MutationObserver(updateTarget);
  observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["open", "data-app-navbar"] });
  visibility();
  window.addEventListener("resize", measureNavbar, { passive: true }); window.addEventListener("scroll", measureNavbar, { passive: true });
  window.addEventListener("blur", blur); window.addEventListener("focus", focus);
  document.addEventListener("visibilitychange", visibility);
});
onBeforeUnmount(() => {
  observer?.disconnect(); headerObserver?.disconnect();
  window.removeEventListener("resize", measureNavbar); window.removeEventListener("scroll", measureNavbar);
  window.removeEventListener("blur", blur); window.removeEventListener("focus", focus);
  document.removeEventListener("visibilitychange", visibility);
  pauseNotifications("hidden", false); pauseNotifications("window", false);
});
</script>
