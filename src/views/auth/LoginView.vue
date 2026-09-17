<template>
  <div
    class="relative z-10 w-full h-full flex items-center justify-center px-4 sm:px-6 overflow-hidden"
  >
    <!-- CONTENIDO -->
    <div class="w-full max-w-md mx-auto">
      <!-- RECUADRO FLOTANTE -->
      <div
        class="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/60 relative overflow-hidden"
      >
        <!-- Línea decorativa dorada superior -->
        <div
          class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ffb700] to-transparent"
        />

        <!-- BOTÓN VOLVER -->
        <RouterLink
          to="/"
          class="absolute top-4 left-4 text-white/30 hover:text-[#ffb700] transition-colors duration-300"
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
        </RouterLink>

        <!-- TÍTULO -->
        <h1
          class="text-2xl sm:text-3xl md:text-4xl font-barber font-light text-white text-center tracking-[0.05em]"
        >
          Iniciar
          <span class="text-[#ffb700] font-medium">Sesión</span>
        </h1>

        <p
          class="text-white/40 text-[11px] sm:text-sm font-barber font-light text-center mt-1 tracking-[0.08em] uppercase"
        >
          Bienvenido de vuelta
        </p>

        <FormKit
          id="loginForm"
          type="form"
          :actions="false"
          incomplete-message="No se pudo enviar, revisa los mensajes"
          @submit="handleSubmit"
          class="mt-4 sm:mt-6"
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
            outer-class="mb-3 sm:mb-4"
            label-class="text-white/50 text-[10px] sm:text-xs font-barber tracking-[0.2em] font-medium"
            input-class="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm sm:text-base placeholder-white/30 focus:outline-none focus:border-[#ffb700] transition-colors duration-300"
          />

          <FormKit
            type="password"
            label="Contraseña"
            name="password"
            placeholder="Password de usuario"
            validation="required|length:8"
            :validation-messages="{
              required: 'La contraseña es obligatoria',
              length: 'La contraseña debe tener al menos 8 caracteres',
            }"
            outer-class="mb-4 sm:mb-5"
            label-class="text-white/50 text-[10px] sm:text-xs font-barber tracking-[0.2em] font-medium"
            input-class="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm sm:text-base placeholder-white/30 focus:outline-none focus:border-[#ffb700] transition-colors duration-300"
          />

          <FormKit
            type="submit"
            outer-class="w-full"
            input-class="w-full py-2.5 sm:py-3 bg-[#ffb700] hover:bg-[#e6a500] text-black font-barber font-medium text-sm sm:text-base rounded-lg transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] cursor-pointer shadow-lg shadow-[#ffb700]/20 hover:shadow-[#ffb700]/40"
          >
            Iniciar sesión
          </FormKit>
        </FormKit>

        <!-- ✅ OLVIDASTE CONTRASEÑA -->
        <div class="text-center mt-3">
          <RouterLink
            :to="{ name: 'Olvide-password' }"
            class="text-white/25 hover:text-[#ffb700] text-[10px] sm:text-xs font-barber font-light tracking-[0.05em] transition-colors duration-300"
          >
            ¿Olvidaste tu contraseña?
          </RouterLink>
        </div>

        <p
          class="text-white/30 text-[10px] sm:text-xs text-center mt-4 sm:mt-5 font-barber font-light tracking-[0.05em]"
        >
          ¿No tienes cuenta?
          <RouterLink
            :to="{ name: 'Register' }"
            class="text-[#ffb700] hover:text-white transition-colors duration-300 font-medium"
          >
            Regístrate aquí
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
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";

interface LoginFormData {
  email: string;
  password: string;
}

const toast = useToast();
const router = useRouter();
const userStore = useUserStore();

const handleSubmit = async (formData: LoginFormData) => {
  try {
    const { data } = await AuthAPI.login(formData);

    localStorage.setItem("AUTH_TOKEN", data.token);

    await userStore.init();

    router.push({ name: "Home" });
  } catch (error: any) {
    const errorMsg =
      error?.response?.data?.msg || "Error al iniciar sesión";

    toast.open({
      message: errorMsg,
      type: "error",
    });
  }
};
</script>

<style scoped>
</style>