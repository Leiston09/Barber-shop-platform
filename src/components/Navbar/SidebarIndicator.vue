<template>
  <div
    v-if="currentScene >= 1"
    class="absolute left-6 sm:left-10 lg:left-14 top-1/2 -translate-y-1/2 z-20 hidden sm:block"
  >
    <div class="relative h-[260px] w-px bg-white/15">
      <span
        class="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full"
        :class="currentScene >= 1 ? 'bg-[#ffb700]' : 'bg-white/20'"
      />
      <span
        class="absolute -left-[5px] top-[85px] w-2.5 h-2.5 rounded-full"
        :class="currentScene >= 2 ? 'bg-[#ffb700]' : 'bg-white/20'"
      />
      <span
        class="absolute -left-[5px] top-[170px] w-2.5 h-2.5 rounded-full"
        :class="currentScene >= 3 ? 'bg-[#ffb700]' : 'bg-white/20'"
      />
      <span
        class="absolute -left-[5px] bottom-0 w-2.5 h-2.5 rounded-full"
        :class="currentScene >= 4 ? 'bg-[#ffb700]' : 'bg-white/20'"
      />
    </div>
    <div
      class="absolute left-4 -top-3 text-lg transition-colors duration-300"
      :class="currentScene === 1 ? 'text-[#ffb700]' : 'text-white/25'"
    >
      01
    </div>
    <div
      class="absolute left-4 top-[82px] text-lg transition-colors duration-300"
      :class="currentScene === 2 ? 'text-[#ffb700]' : 'text-white/25'"
    >
      02
    </div>
    <div
      class="absolute left-4 top-[167px] text-lg transition-colors duration-300"
      :class="currentScene === 3 ? 'text-[#ffb700]' : 'text-white/25'"
    >
      03
    </div>
    <div
      class="absolute left-4 top-[252px] text-lg transition-colors duration-300"
      :class="currentScene === 4 ? 'text-[#ffb700]' : 'text-white/25'"
    >
      04
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  currentScene: number
}>()
</script>