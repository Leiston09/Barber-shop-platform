<template>
  <div
    class="w-full flex-1 bg-[#050505] flex items-center justify-center px-5 py-6 sm:px-8 sm:py-8"
  >
    <div class="w-full max-w-md">
      <AuthBackLink />
      <!-- TOKEN VÁLIDO -->
      <div
        v-if="validToken"
        class="relative bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50"
      >
        <div
          class="h-px w-1/2 mx-auto bg-gradient-to-r from-transparent via-[#ffb700] to-transparent"
        />

        <div class="p-7 sm:p-10">
          <div class="mb-8">
            <div class="flex items-center justify-center gap-3 mb-5">
              <span
                class="text-[#ffb700] text-[9px] uppercase tracking-[0.35em] font-medium"
              >
                Seguridad
              </span>
            </div>

            <h1
              class="font-barber text-3xl sm:text-4xl font-light text-white text-center tracking-tight"
            >
              Nueva <span class="text-[#ffb700] font-medium">contraseña</span>
            </h1>

            <p
              class="text-white/40 text-sm text-center font-light mt-3 leading-relaxed"
            >
              Crea una nueva contraseña para recuperar el acceso a tu cuenta.
            </p>
          </div>

          <AuthForm id="newPasswordForm" @submit="handleSubmit" class="mt-5">
            <AuthField type="password" name="password" label="Nueva contraseña" placeholder="Ingresa tu nueva contraseña" :required="true" />

            <AuthSubmit>
              Actualizar contraseña
            </AuthSubmit>
          </AuthForm>
        </div>
      </div>

      <!-- TOKEN NO VÁLIDO -->
      <div
        v-else
        class="relative bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50"
      >
        <div
          class="h-px w-1/2 mx-auto bg-gradient-to-r from-transparent via-red-500/60 to-transparent"
        />

        <div class="p-7 sm:p-10 text-center">
          <div
            class="w-14 h-14 mx-auto rounded-full border border-red-500/20 bg-red-500/5 flex items-center justify-center mb-6"
          >
            <svg
              class="w-5 h-5 text-red-400/80"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <div class="flex items-center justify-center gap-3 mb-5">
            <span class="w-8 h-px bg-red-500/40" />

            <span
              class="text-red-400/80 text-[9px] uppercase tracking-[0.35em] font-medium"
            >
              Acceso no disponible
            </span>

            <span class="w-8 h-px bg-red-500/40" />
          </div>

          <h1
            class="font-barber text-3xl sm:text-4xl font-light text-white tracking-tight"
          >
            Enlace <span class="text-red-400/90">inválido</span>
          </h1>

          <p
            class="text-white/40 text-sm font-light mt-4 leading-relaxed max-w-sm mx-auto"
          >
            El enlace para recuperar tu contraseña no es válido o ha expirado.
            Solicita un nuevo enlace para continuar.
          </p>

          <button
            type="button"
            @click="router.push({ name: 'Login' })"
            class="w-full mt-8 px-5 py-3.5 border border-white/15 hover:border-[#ffb700]/50 text-white/70 hover:text-white text-[10px] font-barber uppercase tracking-[0.25em] rounded-lg transition-all duration-300 hover:bg-white/[0.03]"
          >
            Volver al inicio de sesión
          </button>
          </div>
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
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "@/lib/notifications";

const toast = useToast();
const route = useRoute();
const router = useRouter();

const { token } = route.params as { token: string };

const validToken = ref(false);

onMounted(async () => {
  if (!token) {
    toast.open({
      message: "Abre el enlace completo que recibiste por correo para cambiar tu contraseña.",
      type: "error",
    });

    return;
  }

  try {
    await AuthAPI.verifyPasswordResetToken(token);
    validToken.value = true;
  } catch (error: any) {
    const errorMsg =
      error?.response?.data?.msg || "Error al verificar el token";

    toast.open({
      message: errorMsg,
      type: "error",
    });
  }
});

const handleSubmit = async (formData: { password: string }) => {
  const { password } = formData;

  if (!token) {
    toast.open({
      message: "Este enlace ya no está disponible. Solicita uno nuevo para cambiar tu contraseña.",
      type: "error",
    });

    return;
  }

  try {
    const { data } = await AuthAPI.updatePassword(token, {
      password,
    });

    toast.open({
      message: data.msg,
      type: "success",
    });

    setTimeout(() => {
      router.push({ name: "Login" });
    }, 3000);
  } catch (error: any) {
    const errorMsg =
      error?.response?.data?.msg || "Error al actualizar contraseña";

    toast.open({
      message: errorMsg,
      type: "error",
    });
  }
};
</script>

<style scoped></style>
