<template>
 <label :for="id" class="mb-4 block min-w-0" :class="outerClass"><span class="mb-2 block text-xs text-white/60">{{ label }}</span><input :id="id" :name="name" :type="type" :placeholder="placeholder" :autocomplete="autocomplete" :required="required" :aria-invalid="invalid || undefined" @input="invalid=false" class="min-h-11 w-full min-w-0 rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#ffb700] focus:outline-none aria-invalid:border-red-400/60" /></label>
</template>
<script setup lang="ts">
import {ref,useId,onMounted,onBeforeUnmount} from "vue";
const props=withDefaults(defineProps<{name:string;label:string;type?:string;placeholder?:string;outerClass?:string;required?:boolean}>(),{type:"text",required:true});
const id=useId(),invalid=ref(false);
const autocomplete=props.name==="email"?"email":props.name==="phone"?"tel":props.name==="name"?"name":props.name==="password_confirm"?"new-password":props.type==="password"?"current-password":undefined;
function mark(e:Event){invalid.value=(e as CustomEvent).detail===props.name;}
onMounted(()=>document.addEventListener("appsalon:invalid-field",mark));onBeforeUnmount(()=>document.removeEventListener("appsalon:invalid-field",mark));
</script>