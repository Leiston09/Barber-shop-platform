<template>
  <h1 class="text-6xl font-extrabold text-white text-center mt-10">
    Crear una cuenta
  </h1>
  <p class="text-2xl text-white text-center my-5">
    Crea una cuenta en AppSalon
  </p>

  <FormKit
    id="registerFrom"
    type="form"
    :actions="false"
    incomplete-message="No se pudo enviar, revisa los msg"
    @submit="handleSubmit"
  >
    <FormKit
      type="text"
      label="Nombre"
      name="name"
      placeholder="Tu Nombre"
      validation="required|length:3"
      :validation-messages="{
        required: 'El nombre es obligatorio',
        length: 'El nombre es muy corto',
      }"
    >
    </FormKit>

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
      placeholder="Mínimo 8 caracteres"
      validation="required|length:8"
      :validation-messages="{
        required: 'La contraseña es obligatoria',
        length: 'La contraseña debe tener al menos 8 caracteres',
      }"
    />

    <FormKit
      type="password"
      label="Repetir Contraseña"
      name="password_confirm"
      placeholder="Repite tu contraseña"
      validation="required|confirm"
      :validation-messages="{
        required: 'Debes confirmar la contraseña',
        confirm: 'Las contraseñas no coinciden',
      }"
    />

    <FormKit type="submit">Crear cuenta </FormKit>
  </FormKit>
</template>

<script setup lang="ts">
import AuthAPI from "@/api/AuthAPI";
import { reset } from "@formkit/vue";
import { inject } from "vue";

// Interfaces
interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  password_confirm: string;
}

interface RegisterResponse {
  msg: string;
}

const toast = inject("toast") as any;

const handleSubmit = async ({ password_confirm, ...formdata }: RegisterFormData) => {
  try {
    const { data } = await AuthAPI.register(formdata) as { data: RegisterResponse };
    
    toast?.open({
      message: data.msg,
      type: "success",
    });
    
    reset("registerFrom");
    
  } catch (error) {
    const errorMsg = (error as any)?.response?.data?.msg || 'Error al registrar usuario';
    toast?.open({
      message: errorMsg,
      type: "error",
    });
  }
};
</script>

<style scoped></style>
