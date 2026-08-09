<template>
  <h1 class="text-6xl font-extrabold text-white text-center mt-10">
    iniciar Sesion
  </h1>
  <p class="text-2xl text-white text-center my-5">
    Si tien esun acuenta ncia sesion
  </p>

  <FormKit
    id="loginForm"
    type="form"
    :actions="false"
    incomplete-message="No se pudo enviar, revisa los msg"
    @submit="handleSubmit"
  >
    <FormKit
      type="email"
      label="Email"
      name="email"
      placeholder="tucorreo@ejemplo.com"
      validation="required|email"
      :validation-messages="{
        required: 'El email es obligatorio',
        email: 'Ingresa un email válido',
      }"
    />

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

    <FormKit type="submit">Iniciar sesion </FormKit>
  </FormKit>
</template>

<script setup lang="ts">
import AuthAPI from "@/api/AuthAPI";
import { inject } from "vue";
import { useRouter } from "vue-router";

interface loginFormData {
  email: string;
  password: string;
}

interface loginResponse {
  token: string;
}

const toast = inject("toast") as any;
const router = useRouter();

const handleSubmit = async (fromData: loginFormData) => {
  try {
    const {
      data: { token },
    } = (await AuthAPI.login(fromData)) as { data: loginResponse };
    localStorage.setItem("AUTH_TOKEN", token);
    router.push({ name: "My-appoiments" });
  } catch (error) {
    const errorMsg =
      (error as any)?.response?.data?.msg || "Error al iniciar Sesion (Login)";
    toast?.open({
      message: errorMsg,
      type: "error",
    });
  }
};
</script>

<style scoped></style>
