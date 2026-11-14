<template>
  <div
    class="relative z-10 w-full flex flex-1 items-center justify-center px-4 py-6 sm:px-6 sm:py-8"
  >
    <div class="w-full max-w-md mx-auto py-6 sm:py-8">
      <AuthBackLink />
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
        </RouterLink> -->

        <!-- TÍTULO -->
        <h1
          class="text-2xl sm:text-3xl md:text-4xl font-barber font-light text-white text-center tracking-[0.05em]"
        >
          <span class="text-[#ffb700] font-medium">Recuperar</span> acceso
        </h1>

        <p
          class="text-white/40 text-[11px] sm:text-sm font-barber font-light text-center mt-1 mb-3 tracking-[0.08em] uppercase"
        >Te enviaremos un enlace a tu correo
        </p>

        <AuthForm id="olvidePassword" @submit="handleSubmit" class="mt-5">
          <AuthField type="email" name="email" label="Email" placeholder="tucorreo@ejemplo.com" outer-class="mb-4 sm:mb-5" :required="true" />

          <AuthSubmit>
            Enviar correo
          </AuthSubmit>
        </AuthForm>

        <p
          class="text-white/55 text-xs text-center mt-4 sm:mt-5 font-normal leading-6"
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
import AuthBackLink from "@/components/UI/AuthBackLink.vue";
import AuthSubmit from "@/components/UI/AuthSubmit.vue";
import AuthForm from "@/components/UI/AuthForm.vue";
import AuthField from "@/components/UI/AuthField.vue";
import AuthAPI from "@/api/AuthAPI";
import { resetAuthForm as reset } from "@/helpers/authForm";
import { useRouter } from "vue-router";
import { useToast } from "@/lib/notifications";

const toast = useToast();
const router = useRouter();

const handleSubmit = async (formData: { email: string }) => {
  const { email } = formData;

  if (!email) {
    toast.open({
      message: "El email es obligatorio",
      type: "error",
    });

    return;
  }

  try {
    const { data } = await AuthAPI.olvidePassword({ email });

    toast.open({
      message: data.msg,
      type: "success",
    });

    reset("olvidePassword");
  } catch (error: any) {
    const errorMsg =
      error?.response?.data?.msg || "Error al recuperar password";

    toast.open({
      message: errorMsg,
      type: "error",
    });
  }
};
</script>

<style scoped>
</style>