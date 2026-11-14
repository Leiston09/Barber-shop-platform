<template><form v-bind="formAttrs" novalidate :aria-busy="busy" @submit.prevent="submit"><fieldset :disabled="busy" class="min-w-0 border-0 p-0 disabled:opacity-60"><slot /></fieldset></form></template>
<script setup lang="ts">
import {computed,ref,useAttrs} from "vue";import {toast} from "@/lib/notifications";import {authFormError} from "@/helpers/authForm";
defineOptions({inheritAttrs:false});
const attrs=useAttrs(),busy=ref(false);
const formAttrs=computed(()=>Object.fromEntries(Object.entries(attrs).filter(([key])=>key!=="onSubmit")));
async function submit(event:Event){
 if(busy.value)return;const form=event.currentTarget as HTMLFormElement;
 const values=Object.fromEntries(new FormData(form).entries()) as Record<string,string>;
 for(const key of ["name","email","phone"])if(typeof values[key]==="string")values[key]=values[key].trim();
 for(const input of Array.from(form.querySelectorAll<HTMLInputElement>("input[name]"))){
 const error=authFormError(input.name,input.value,values,input.required);
 if(error){document.dispatchEvent(new CustomEvent("appsalon:invalid-field",{detail:input.name}));toast.error(error);input.focus();return;}
 }
 busy.value=true;
 try{const handler=attrs.onSubmit as ((data:Record<string,string>)=>unknown)|undefined;await handler?.(values);}
 finally{busy.value=false;}
}
</script>