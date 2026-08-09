import ServiceAPI from "@/api/ServiceAPI";
import { defineStore } from "pinia";
import { onMounted, ref } from "vue";

export const useServiceStore = defineStore("service", () => {
  type typeService = {
    _id: string;
    name: string;
    price: number;
  };

  const services = ref<typeService[]>([]);

  onMounted(async () => {
    try {
      const { data } = await ServiceAPI.all();
      services.value = data;
    } catch (error) {
      console.log(error);
    }
  });

  return {
    services,
  };
});
