<template>
 <button v-bind="$attrs" ref="trigger" type="button" @click="toggle" :aria-expanded="open" :aria-controls="id" :aria-label="'Información sobre ' + label" class="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-white/45 hover:text-[#ffb700] focus-visible:outline-2 focus-visible:outline-[#ffb700]"><slot><span aria-hidden="true" class="flex size-4 items-center justify-center rounded-full border border-current text-[10px] font-semibold">!</span></slot></button>
 <Teleport to="body"><div v-if="open" :id="id" ref="bubble" popover="manual" role="region" :aria-label="label" :style="position" class="fixed m-0 overflow-visible z-[100] w-64 max-w-[calc(100vw-1.5rem)] rounded-xl border border-white/20 bg-[#202020] p-3 text-xs leading-5 text-white/80 shadow-xl"><span aria-hidden="true" class="absolute -top-1.5 size-3 rotate-45 border-l border-t border-white/20 bg-[#202020]" :style="{ left: arrow + 'px' }" /><p class="relative">{{ text }}</p></div></Teleport>
</template>
<script setup lang="ts">
import { ref, useId, nextTick, onMounted, onBeforeUnmount } from "vue";
defineOptions({ inheritAttrs: false });
defineProps<{label:string;text:string}>();
const id=useId(),trigger=ref<HTMLButtonElement>(),bubble=ref<HTMLElement>(),open=ref(false),position=ref<Record<string,string>>({}),arrow=ref(12);
function place(){const b=trigger.value?.getBoundingClientRect();if(!b)return;const width=Math.min(256,innerWidth-24),left=Math.max(12,Math.min(innerWidth-width-12,b.right-width));position.value={left:left+"px",top:(b.bottom+8)+"px"};arrow.value=Math.max(12,Math.min(width-20,b.left+b.width/2-left-6));nextTick(()=>{const h=bubble.value?.offsetHeight||0;if(b.bottom+8+h>innerHeight-12)position.value={left:left+"px",top:Math.max(12,b.top-h-8)+"px"};});}
function toggle(){open.value=!open.value;if(open.value){nextTick(()=>{bubble.value?.showPopover();place();});}}
function outside(e:Event){if(!trigger.value?.contains(e.target as Node)&&!bubble.value?.contains(e.target as Node))open.value=false;}
function key(e:KeyboardEvent){if(e.key==="Escape")open.value=false;}
function hide(){open.value=false;}
onMounted(()=>{document.addEventListener("pointerdown",outside);document.addEventListener("keydown",key);window.addEventListener("resize",hide);window.addEventListener("scroll",hide,true);});
onBeforeUnmount(()=>{document.removeEventListener("pointerdown",outside);document.removeEventListener("keydown",key);window.removeEventListener("resize",hide);window.removeEventListener("scroll",hide,true);});
</script>