<template>
  <div v-if="validToken">
    <h1 class="text-6xl font-extrabold text-white text-center mt-10">
      nuevo password
    </h1>
    <p class="text-2xl text-white text-center my-5">coloca tu neuvo password</p>
    <FormKit
      id="newPasswordFrom"
      type="form"
      :actions="false"
      incomplete-message="No se pudo enviar, revisa los msg"
      @submit="handleSubmit"
    >
      <FormKit
        type="password"
        label="Contraseña"
        name="password"
        placeholder="password de usuario"
        validation="required|length:8"
        :validation-messages="{
          required: 'La contraseña es obligatoria',
        }"
      />
      <FormKit type="submit"> enviar correo </FormKit>
    </FormKit>
  </div>
  <div v-else>
    <h1 class="text-6xl font-extrabold text-white text-center mt-10">
      token no valido
    </h1>
  </div>
</template>

<script setup lang="ts">
import AuthAPI from "@/api/AuthAPI";
import { inject, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const toast = inject("toast");
const route = useRoute();
const router = useRouter();
const { token } = route.params;

const validToken = ref(false);

onMounted(async () => {
  try {
    const { data } = await AuthAPI.verifyPasswordResetToken(token);
    validToken.value = true;
  } catch (error) {
    const errorMsg =
      (error as any)?.response?.data?.msg || "Error al verificar oken";
    toast?.open({
      message: errorMsg,
      type: "error",
    });
  }
});
const handleSubmit = async ({ password }) => {
  try {
    const response = await AuthAPI.updatePassword(token, { password });
    console.log("📦 RESPONSE COMPLETA:", response);
    console.log("📦 RESPONSE DATA:", response.data);

    toast.open({
      message: response.data.msg,
      type: "success",
    });

    setTimeout(() => {
      router.push({ name: "Login" });
    }, 3000);
    
  } catch (error) {
    const errorMsg = (error as any)?.response?.data?.msg;
    toast?.open({
      message: errorMsg,
      type: "error",
    });
  }
};
</script>

<style scoped></style>
