<template>
  <div
    class="relative z-10 w-full flex flex-1 items-center justify-center px-4 py-6 sm:px-6 sm:py-8"
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

        <AuthForm id="loginForm" @submit="handleSubmit" class="mt-5">
          <AuthField type="email" name="email" label="Email" placeholder="tucorreo@ejemplo.com" outer-class="mb-3 sm:mb-4" :required="true" />

          <AuthField type="password" name="password" label="Contraseña" placeholder="Ingresa tu contraseña" outer-class="mb-4 sm:mb-5" :required="true" />

          <AuthSubmit>
            Iniciar sesión
          </AuthSubmit>
        </AuthForm>
        <GuestAccessLink />

        <!-- ✅ OLVIDASTE CONTRASEÑA -->
        <div class="text-center mt-3">
          <RouterLink
            :to="{ name: 'Olvide-password' }"
            class="inline-flex min-h-10 items-center rounded-sm text-xs text-white/65 transition-colors hover:text-[#ffb700] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb700]"
          >
            ¿Olvidaste tu contraseña?
          </RouterLink>
        </div>

        <p
          class="text-white/55 text-xs text-center mt-4 sm:mt-5 font-normal leading-6"
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
import GuestAccessLink from "@/components/UI/GuestAccessLink.vue";
import AuthSubmit from "@/components/UI/AuthSubmit.vue";
import AuthForm from "@/components/UI/AuthForm.vue";
import AuthField from "@/components/UI/AuthField.vue";
import AuthAPI from "@/api/AuthAPI";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import { useToast } from "@/lib/notifications";

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