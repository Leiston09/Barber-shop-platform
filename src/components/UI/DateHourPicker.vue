<template>
  <div class="grid min-w-0 grid-cols-[minmax(0,1fr)_100px] items-start gap-2">
    <input :id="id" type="date" :value="modelValue.slice(0,10)" @input="updateDate" :disabled="disabled" class="h-11 min-h-11 w-full min-w-0 rounded-lg border border-white/15 bg-neutral-950 px-2 text-sm text-white [color-scheme:dark] focus:outline-[#ffb700]" />
    <HourSelect :model-value="modelValue.slice(11,16)" :disabled="disabled" :aria-label="label ? 'Hora de ' + label : 'Hora'" @update:model-value="updateHour" />
  </div>
</template>
<script setup lang="ts">
import HourSelect from "./HourSelect.vue";
defineOptions({inheritAttrs:false});
const props=defineProps<{modelValue:string;id?:string;label?:string;disabled?:boolean}>(),emit=defineEmits<{'update:modelValue':[string]}>();
function updateDate(e:Event){emit('update:modelValue',(e.target as HTMLInputElement).value+'T'+(props.modelValue.slice(11,13)||'09')+':00');}
function updateHour(hour:string){emit('update:modelValue',(props.modelValue.slice(0,10)||new Date().toLocaleDateString('sv-SE'))+'T'+hour);}
</script>
