<template>
  <div><h1>Desde Confirmar-cuenta</h1></div>
</template>

<script setup lang="ts">
import AuthAPI from "@/api/AuthAPI";
import { inject, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const toast = inject("toast") as any;
const Router = useRouter();
const Route = useRoute(); 
const { token } = Route.params as { token?: string };

interface VerifyResponse {
  msg: string;
}

onMounted(async () => {
  if (!token) {
    toast?.open({
      message: "Token de verificación no encontrado",
      type: "error",
    });
    setTimeout(() => Router.push({ name: "Login" }), 2000);
    return;
  }
  try {
    const { data } = (await AuthAPI.verifyAccount(token)) as {
      data: VerifyResponse;
    };
    toast.open({
      message: data.msg,
      type: "success",
    });

    setTimeout(() => {
      Router.push({ name: "Login" });
    }, 1000);
  } catch (error) {
    const errorMsg =
      (error as any)?.response?.data?.msg || "Error al verificar la cuenta (token)";

    toast?.open({
      message: errorMsg,
      type: "error",
    });
  }
});
</script>

<style scoped></style>
