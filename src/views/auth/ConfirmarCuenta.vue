<template>
  <div><h1>Desde Confirmar-cuenta</h1></div>
</template>

<script setup lang="ts">
import AuthAPI from "@/api/AuthAPI";
import { onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";

// Tipar toast correctamente
import { useToast } from 'vue-toast-notification'

const toast = useToast()

const router = useRouter();
const route = useRoute();
const { token } = route.params as { token?: string };

// Timeout ref para cleanup
let timeoutId: ReturnType<typeof setTimeout> | null = null;

onMounted(async () => {
  if (!token) {
    toast?.open({
      message: "Token de verificación no encontrado",
      type: "error",
    });
    timeoutId = setTimeout(() => router.push({ name: "Login" }), 2000);
    return;
  }

  try {
    const { data } = await AuthAPI.verifyAccount(token);
    
    toast.open({
      message: data.msg,
      type: "success",
    });

    timeoutId = setTimeout(() => {
      router.push({ name: "Login" });
    }, 1000);
    
  } catch (error: any) {
    const errorMsg = error?.response?.data?.msg || "Error al verificar la cuenta (token)";

    toast.open({
      message: errorMsg,
      type: "error",
    });
  }
});

// Limpiar timeout si el componente se destruye
onUnmounted(() => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
});
</script>