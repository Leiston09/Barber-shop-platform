import AuthAPI from "@/api/AuthAPI";
import { createRouter, createWebHistory } from "vue-router";
const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/Home.vue"),
  },
  {
    path: "/admin",
    name: "Admin",
    component: () => import("@/views/admin/AdminLayout.vue"),
    meta: { requireAdmin: true },
    children: [
      {
        path: "",
        name: "Admin-appointments",
        component: () => import("@/views/admin/appointmentsView.vue"),
      },
    ],
  },
  {
    path: "/reservaciones",
    name: "Reservaciones",
    component: () => import("@/views/appoiments/AppoimentsLayout.vue"),
    meta: { requireAuth: true },
    children: [
      {
        path: "",
        name: "My-appoiments",
        component: () => import("@/views/appoiments/MyAppoimentsView.vue"),
      },
      {
        path: "nueva",
        component: () => import("@/views/appoiments/NewAppoimentsLayout.vue"),
        children: [
          {
            path: "",
            name: "new-appoiments",
            component: () => import("@/views/appoiments/ServicesView.vue"),
          },
          {
            path: "detalles",
            name: "Appoiments-details",
            component: () => import("@/views/appoiments/ApoimentsView.vue"),
          },
        ],
      },
      {
        path: ":id/editar",
        component: () =>
          import("@/views/appoiments/EditAppoinetmentsLayout.vue"),
        children: [
          {
            path: "",
            name: "Edit-appoiments",
            component: () => import("@/views/appoiments/ServicesView.vue"),
          },
          {
            path: "detalles",
            name: "Edit-Appoiments-details",
            component: () => import("@/views/appoiments/ApoimentsView.vue"),
          },
        ],
      },
    ],
  },
  {
    path: "/auth",
    name: "Auth",
    component: () => import("@/views/auth/AuthLayout.vue"),
    children: [
      {
        path: "login",
        name: "Login",
        component: () => import("@/views/auth/LoginView.vue"),
      },
      {
        path: "register",
        name: "Register",
        component: () => import("@/views/auth/RegisterView.vue"),
      },
      {
        path: "confirmar-cuenta/:token",
        name: "Confirmar-cuenta",
        component: () => import("@/views/auth/ConfirmarCuenta.vue"),
      },
      {
        path: "olvide-password",
        name: "Olvide-password",
        component: () => import("@/views/auth/OlvidePasswordView.vue"),
      },
      {
        path: "olvide-password/:token",
        name: "new-password",
        component: () => import("@/views/auth/NewPasswprdView.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from) => {
  const requireAuth = to.matched.some((url) => url.meta.requireAuth);

  if (!requireAuth) {
    //Si no requiere auth, deja pasar
    return true;
  }

  try {
    const { data } = await AuthAPI.auth();

    if (data.admin) {
      return { name: "Admin" };
    } else {
      return true; //Autenticado, deja pasar
    }
  } catch (error) {
    return { name: "Login" }; //Redirige al login
  }
});

router.beforeEach(async (to, from) => {
  const requireAdmin = to.matched.some((url) => url.meta.requireAdmin);

  if (!requireAdmin) {
    try {
      await AuthAPI.admin();
      return true; //Autenticado, deja pasar
    } catch (error) {
      return { name: "Login" }; //Redirige al login
    }
  }
});

export default router;
