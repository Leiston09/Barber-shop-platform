import AppointmentsAPI from "@/api/AppointmentsAPI";
import AuthAPI from "@/api/AuthAPI";
import { defineStore } from "pinia";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

interface user {
  admin: boolean;
  email: string;
  name: string;
  _id: string;
}

export const useUserStore = defineStore("user", () => {
  const router = useRouter();
  const user = ref<user>();
  const userAppointments = ref([]);
  const loading = ref(true);
  onMounted(async () => {
    try {
      const { data } = await AuthAPI.auth();
      user.value = data;
      await getUserAppointments();
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  });

  async function getUserAppointments() {
    const { data } = await AppointmentsAPI.getUserAppointments(user.value?._id);
    userAppointments.value = data;
    console.log(data)
  }

  const getUserName = computed(() =>
    user.value?.name ? user.value?.name : "",
  );

  function logout() {
    localStorage.removeItem("AUTH_TOKEN");
    user.value = { admin: false, email: "", name: "", _id: "" };
    router.push({ name: "Login" });
  }

  const noAppointments = computed(() => userAppointments.value.length === 0);

  return {
    user,
    getUserName,
    logout,
    userAppointments,
    noAppointments,
    getUserAppointments,
    loading
  };
});
