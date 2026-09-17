import { useUserStore } from "@/stores/user";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Layout",
    component: () => import("@/layout/Layout.vue"),
    children: [
      {
        path: "",
        name: "Home",
        component: () => import("@/views/Home.vue"),
      },
      {
        path: "services",
        name: "Services",
        component: () => import("@/views/Services.vue"),
        children: [],
      },
      {
        path: "/services/reservaciones",
        name: "Reservaciones",
        component: () =>
          import("@/components/appointments/ServiceReservaTitle.vue"),
        meta: {
          requireAuth: true,
        },
        redirect: {
          name: "My-appointments",
        },
        children: [
          {
            path: "",
            name: "My-appointments",
            component: () =>
              import("@/components/appointments/ServicesMyAppointments.vue"),
          },
          {
            path: "nueva",
            component: () =>
              import("@/components/appointments/ServicesNewAppointmentsButtons.vue"),
            children: [
              {
                path: "barber",
                name: "BarberSelect",
                component: () =>
                  import("@/components/appointments/newAppointments/BarberSelect.vue"),
              },
              {
                path: "",
                name: "New-appointments",
                component: () =>
                  import("@/components/appointments/newAppointments/ServicesNewAppointments.vue"),
              },
              {
                path: "detalles",
                name: "New-Appointments-details",
                component: () =>
                  import("@/components/appointments/newAppointments/ServicesAppointmentsDetails.vue"),
              },
            ],
          },
          
        ],
      },
      {
        path: "history",
        name: "History",
        component: () => import("@/views/History.vue"),
      },
      {
        path: "contact",
        name: "Contact",
        component: () => import("@/views/Contact.vue"),
      },
    ],
  },

  {
    path: "/admin",
    name: "Admin",
    component: () => import("@/components/admin/AdminLayout.vue"),
    meta: {
      requireAdmin: true,
    },
    redirect: {
      name: "Admin-Home",
    },
    children: [
      {
        path: "Home",
        name: "Admin-Home",
        component: () => import("@/views/Admin.vue"),
      },
      {
        path: "appointments",
        name: "Admin-Appointments",
        component: () => import("@/views/admin/Appointments.vue"),
      },
      {
        path: "barbers",
        name: "Admin-Barbers",
        component: () => import("@/views/admin/Barbers.vue"),
      },
      {
        path: "customer",
        name: "Admin-Customer",
        component: () => import("@/views/admin/Customer.vue"),
      },
      {
        path: "services",
        name: "Admin-Services",
        component: () => import("@/views/admin//Services.vue"),
      },
    ],
  },

  {
    path: "/auth",
    name: "Auth",
    component: () => import("@/views/AuthLayout.vue"),
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
  scrollBehavior() {
    return {
      top: 0,
      behavior: "instant",
    };
  },
});

router.beforeEach(async (to) => {
  const requireAuth = to.matched.some((url) => url.meta.requireAuth);

  const requireAdmin = to.matched.some((url) => url.meta.requireAdmin);

  const userStore = useUserStore();

  const token = localStorage.getItem("AUTH_TOKEN");

  if (token && !userStore.user) {
    await userStore.init();
  }

  if (!requireAuth && !requireAdmin) {
    return true;
  }

  if (!userStore.user) {
    return {
      name: "Login",
    };
  }

  if (requireAdmin && !userStore.isAdmin) {
    return {
      name: "Login",
    };
  }

  return true;
});

export default router;
