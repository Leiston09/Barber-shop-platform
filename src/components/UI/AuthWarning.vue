<template>
  <Teleport to="body">
    <div
      v-if="isVisible"
      class="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      @click.self="closeWarning"
    >
      <div
        class="relative w-full max-w-md bg-[#0a0a0a] border border-white/5 rounded-xl shadow-2xl shadow-black/80 overflow-hidden animate-slideUp"
      >
        <!-- Línea decorativa superior -->
        <div
          class="h-[1px] w-1/2 mx-auto bg-gradient-to-r from-transparent via-[#ffb700] to-transparent"
        />

        <!-- Contenido -->
        <div class="p-8 sm:p-10">
          <!-- Título -->
          <h3
            class="text-2xl font-barber text-white text-center font-light tracking-wide"
          >
            {{ title }}
          </h3>

          <!-- Mensaje -->
          <p
            v-if="message"
            class="mt-4 text-white/50 text-sm text-center font-light leading-relaxed"
          >
            {{ message }}
          </p>

          <!-- Pasos -->
          <div
            v-if="steps?.length"
            class="mt-8 space-y-3"
          >
            <div
              v-for="(item, index) in steps"
              :key="index"
              class="flex items-start gap-4 text-white/40 text-xs font-light"
            >
              <span
                class="text-[#ffb700] text-sm font-medium min-w-[20px]"
              >
                {{ String(index + 1).padStart(2, "0") }}
              </span>

              <span>{{ item }}</span>
            </div>
          </div>

          <!-- Botones -->
          <div
            v-if="buttons?.length"
            class="mt-10 grid grid-cols-2 gap-3"
          >
            <button
              v-for="(button, index) in buttons"
              :key="index"
              type="button"
              class="px-4 py-3 text-sm rounded transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              :class="
                index === buttons.length - 1
                  ? 'bg-[#ffb700] hover:bg-[#e6a500] text-black font-medium'
                  : 'border border-white/15 hover:border-[#ffb700]/50 text-white/70 hover:text-white hover:bg-white/5'
              "
              @click="handleButton(index)"
            >
              {{ button }}
            </button>
          </div>

          <!-- Cerrar -->
          <button
            type="button"
            aria-label="Cerrar"
            @click="closeWarning"
            class="absolute top-4 right-4 text-white/20 hover:text-white/60 transition-colors duration-300"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  visible: boolean;
  title: string;
  message?: string;
  steps?: string[];
  buttons: string[];
}>();

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (e: "button-click", index: number): void;
}>();

const isVisible = ref(props.visible);

watch(
  () => props.visible,
  (newVal) => {
    isVisible.value = newVal;
  }
);

watch(isVisible, (newVal) => {
  emit("update:visible", newVal);
});

const closeWarning = () => {
  isVisible.value = false;
};

const handleButton = (index: number) => {
  emit("button-click", index);
};
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.97);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.25s ease-out;
}

.animate-slideUp {
  animation: slideUp 0.3s ease-out;
}
</style>