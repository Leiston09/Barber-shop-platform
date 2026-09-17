import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useSceneStore = defineStore("scene", () => {
  const currentScene = ref(0);
  watch(currentScene, a=> {
    console.log(a);
  });
  function setScene(value: number) {
    currentScene.value = value;
  }

  return { currentScene, setScene };
});
