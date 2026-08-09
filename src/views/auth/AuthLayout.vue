<template>
  <div class="mx-auto lg:w-4/5 mt-20">
    <RouterView />

    <nav
      class="mt-10 flex items-center space-y-5 lg:justify-between lg:space-y-0"
    >
      <RouterLink
        v-for="authRoute in authRoutes"
        class="uppercase font-bold text-white"
        :to="{ name: authRoute.name }"
        :class="{'hidden' : route.name === authRoute.name}"
        >{{ authRoute.text }}</RouterLink
      >
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';


interface  AuthRoute {
  name: string;
  text: string;
};
const route = useRoute()
const authRoutes: AuthRoute [] = [
  { name: "Register", text: "Crear una cuenta" },
  { name: "Login", text: "Iniciar Sesión" },
  { name: "Olvide-password", text: "olvide password" },
] as const;
</script>
