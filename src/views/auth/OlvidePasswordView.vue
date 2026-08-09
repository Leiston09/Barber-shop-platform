<template>
  <h1 class="text-6xl font-extrabold text-white text-center mt-10">
    Olvide mi password
  </h1>
  <p class="text-2xl text-white text-center my-5">
    Recuepera el acceso a tu cuenta
  </p>
  <FormKit
    id="olvidePassword"
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
    <FormKit type="submit"> enviar correo </FormKit>
  </FormKit>
</template>

<script setup lang="ts">
import AuthAPI from '@/api/AuthAPI';
import { reset } from '@formkit/vue';
import { inject } from 'vue';
const toast = inject('toast')
const handleSubmit = async ({ email }) => {
  try {
    const {data} = await AuthAPI.olvidePasswor({email})
    toast.open({
      message: data.msg,
      type: "success",
    });
    reset('olvidePassword')
  } catch (error) {
    const errorMsg =
      (error as any)?.response?.data?.msg || "Error al olvidePassword)";
    toast?.open({
      message: errorMsg,
      type: "error",
    });
  }
};
</script>

<style scoped></style>
