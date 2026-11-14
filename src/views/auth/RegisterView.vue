<template>
  <div
    class="relative z-10 w-full flex flex-1 items-center justify-center px-4 py-6 sm:px-6 sm:py-8"
  >
    <div class="w-full max-w-2xl mx-auto py-6 sm:py-8">
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

        <AuthForm id="registerForm" @submit="handleSubmit" class="mt-5">
          <!-- CAMPOS EN 2 COLUMNAS DESDE TABLET/LAPTOP -->

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-0">
            <!-- NOMBRE -->
            <AuthField type="text" name="name" label="Nombre y apellido" placeholder="Tu Nombre" outer-class="mb-4 sm:mb-5" :required="true" />

            <AuthField type="tel" name="phone" label="Teléfono (opcional)" placeholder="Ej.: 0991234567" outer-class="mb-4" :required="false" />
            <!-- EMAIL -->
            <AuthField type="email" name="email" label="Email" placeholder="tucorreo@ejemplo.com" outer-class="mb-4 sm:mb-5 sm:col-span-2" :required="true" />

            <!-- CONTRASEÑA -->
            <AuthField type="password" name="password" label="Contraseña" placeholder="Mínimo 8 caracteres" outer-class="mb-4 sm:mb-5" :required="true" />

            <!-- REPETIR CONTRASEÑA -->
            <AuthField type="password" name="password_confirm" label="Repetir Contraseña" placeholder="Repite tu contraseña" outer-class="mb-5 sm:mb-6" :required="true" />
          </div>

          <!-- BOTÓN -->
          <AuthSubmit>
            Crear cuenta
          </AuthSubmit>
        </AuthForm>

        <p
          class="text-white/55 text-xs text-center mt-5 sm:mt-6 font-normal leading-6"
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
import { ref } from "vue";
import AuthAPI from "@/api/AuthAPI";
import { resetAuthForm as reset } from "@/helpers/authForm";
import { useRouter } from "vue-router";
import { useToast } from "@/lib/notifications";

interface RegisterFormData {
  phone?: string;
  name: string;
  email: string;
  password: string;
  password_confirm: string;
}

const toast = useToast();
const router = useRouter();
const submitting = ref(false);

const handleSubmit = async ({
  password_confirm,
  ...formdata
}: RegisterFormData) => {
  if (submitting.value) return;
  submitting.value = true;
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
  } finally { submitting.value = false; }
};

</script>

<style scoped>
</style>