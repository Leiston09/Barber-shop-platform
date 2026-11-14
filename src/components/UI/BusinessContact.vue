<template>
  <div v-if="contacts.length" class="space-y-2">
    <a v-for="contact in contacts" :key="contact.label" :href="contact.href"
      :target="contact.label === 'WhatsApp' ? '_blank' : undefined" rel="noopener noreferrer"
      class="group flex min-h-9 w-fit max-w-full items-center gap-3 rounded-sm text-sm font-light text-white/55 transition-colors duration-200 hover:text-[#ffb700] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffb700] motion-reduce:transition-none">
      <svg aria-hidden="true" class="size-4 shrink-0 text-[#ffb700]/65 transition-colors group-hover:text-[#ffb700]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <template v-if="contact.label === 'Correo'"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></template>
        <path v-else-if="contact.label === 'Teléfono'" d="M6 3h3l2 5-2 2a14 14 0 0 0 5 5l2-2 5 2v3a3 3 0 0 1-3 3C9 20 4 15 3 6a3 3 0 0 1 3-3Z"/>
        <path v-else d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 21l2.1-5.4A8.5 8.5 0 1 1 21 11.5ZM9 8c0 3 2 5 5 6"/>
      </svg>
      <span class="min-w-0 break-words [overflow-wrap:anywhere]">{{contact.value}}</span>
      <span v-if="contact.label === 'WhatsApp'" class="text-[10px] font-medium text-white/35">WhatsApp</span>
    </a>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useBusinessStore } from "@/stores/business";
defineProps<{compact?: boolean}>();
const business = useBusinessStore();
const contacts = computed(() => business.links.filter(link => ["Teléfono", "Correo", "WhatsApp"].includes(link.label)).sort((a,b)=>["Teléfono","Correo","WhatsApp"].indexOf(a.label)-["Teléfono","Correo","WhatsApp"].indexOf(b.label)));
onMounted(() => business.load());
</script>
