<template>
  <ul class="mt-4 divide-y divide-white/10">
    <li v-for="day in days" :key="day.day" class="flex items-start justify-between gap-4 py-3">
      <p class="text-sm text-white/70">{{ weekDays.find(item => item.day === day.day)?.name }}</p>
      <div class="text-right"><p class="text-sm tabular-nums" :class="day.isWorking ? 'text-white/85' : 'text-white/30'">{{ day.isWorking ? day.startTime + ' – ' + day.endTime : 'Día libre' }}</p><p v-for="(pause, index) in day.isWorking ? day.breaks : []" :key="index" class="mt-1 text-xs text-white/40">Pausa {{ pause.startTime }} – {{ pause.endTime }}</p></div>
    </li>
  </ul>
</template>
<script setup lang="ts">
import { weekDays, type ScheduleDay } from "@/helpers/barberSchedule";
defineProps<{ days: ScheduleDay[] }>();
</script>
