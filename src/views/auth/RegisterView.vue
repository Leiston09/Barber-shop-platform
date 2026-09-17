<template>
  <div
    class="relative z-10 w-full h-full flex items-center justify-center px-4 sm:px-6 overflow-y-auto overflow-x-hidden"
  >
    <div class="w-full max-w-2xl mx-auto py-6 sm:py-8">
      <div
        class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/60 relative overflow-hidden"
      >
        <!-- Línea decorativa dorada superior -->
        <div
          class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ffb700] to-transparent"
        />

        <!-- BOTÓN VOLVER -->
        <!-- <RouterLink
          to="/"
          class="absolute top-5 left-5 text-white/30 hover:text-[#ffb700] transition-colors duration-300"
          aria-label="Volver al inicio"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </RouterLink> -->

        <!-- TÍTULO -->
        <h1
          class="text-3xl sm:text-4xl md:text-5xl font-barber font-light text-white text-center tracking-[0.05em]"
        >
          Crear
          <span class="text-[#ffb700] font-semibold">Cuenta</span>
        </h1>

        <p
          class="text-white/40 text-[11px] sm:text-sm font-barber font-light text-center mt-2 tracking-[0.12em] uppercase"
        >
          Únete a The Barber
        </p>

        <!-- Separador -->
        <div class="w-12 h-px bg-[#ffb700]/40 mx-auto mt-4" />

        <FormKit
          id="registerForm"
          type="form"
          :actions="false"
          incomplete-message="No se pudo enviar, revisa los mensajes"
          @submit="handleSubmit"
          class="mt-6 sm:mt-8"
        >
          <!-- CAMPOS EN 2 COLUMNAS DESDE TABLET/LAPTOP -->

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-0">
            <!-- NOMBRE -->
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
              outer-class="mb-4 sm:mb-5"
              label-class="text-white/50 text-[10px] sm:text-xs font-barber tracking-[0.2em] font-medium uppercase"
              input-class="w-full px-4 py-3 sm:py-3.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm sm:text-base placeholder-white/30 focus:outline-none focus:border-[#ffb700] transition-colors duration-300"
            />

            <!-- EMAIL -->
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
              outer-class="mb-4 sm:mb-5"
              label-class="text-white/50 text-[10px] sm:text-xs font-barber tracking-[0.2em] font-medium uppercase"
              input-class="w-full px-4 py-3 sm:py-3.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm sm:text-base placeholder-white/30 focus:outline-none focus:border-[#ffb700] transition-colors duration-300"
            />

            <!-- CONTRASEÑA -->
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
              outer-class="mb-4 sm:mb-5"
              label-class="text-white/50 text-[10px] sm:text-xs font-barber tracking-[0.2em] font-medium uppercase"
              input-class="w-full px-4 py-3 sm:py-3.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm sm:text-base placeholder-white/30 focus:outline-none focus:border-[#ffb700] transition-colors duration-300"
            />

            <!-- REPETIR CONTRASEÑA -->
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
              outer-class="mb-5 sm:mb-6"
              label-class="text-white/50 text-[10px] sm:text-xs font-barber tracking-[0.2em] font-medium uppercase"
              input-class="w-full px-4 py-3 sm:py-3.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm sm:text-base placeholder-white/30 focus:outline-none focus:border-[#ffb700] transition-colors duration-300"
            />
          </div>

          <!-- BOTÓN -->
          <FormKit
            type="submit"
            outer-class="w-full"
            input-class="w-full py-3 sm:py-4 bg-[#ffb700] hover:bg-[#e6a500] text-black font-barber font-semibold text-sm sm:text-base rounded-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-lg shadow-[#ffb700]/25 hover:shadow-[#ffb700]/50"
          >
            Crear cuenta
          </FormKit>
        </FormKit>

        <p
          class="text-white/30 text-[10px] sm:text-xs text-center mt-5 sm:mt-6 font-barber font-light tracking-[0.05em]"
        >
          ¿Ya tienes cuenta?
          <RouterLink
            :to="{ name: 'Login' }"
            class="text-[#ffb700] hover:text-white transition-colors duration-300 font-medium"
          >
            Inicia sesión aquí
          </RouterLink>
        </p>

        <div
          class="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#ffb700]/50 to-transparent"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AuthAPI from "@/api/AuthAPI";
import { reset } from "@formkit/vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  password_confirm: string;
}

const toast = useToast();
const router = useRouter();

const handleSubmit = async ({
  password_confirm,
  ...formdata
}: RegisterFormData) => {
  try {
    const { data } = await AuthAPI.register(formdata);

    toast.open({
      message: data.msg,
      type: "success",
    });

    reset("registerForm");

    // ✅ REDIRIGIR AL LOGIN DESPUÉS DE REGISTRARSE
    setTimeout(() => {
      router.push({ name: "Login" });
    }, 2500);

  } catch (error: any) {
    const errorMsg =
      error?.response?.data?.msg || "Error al registrar usuario";

    toast.open({
      message: errorMsg,
      type: "error",
    });
  }
};

</script>

<style scoped>
</style>