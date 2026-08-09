import api from "@/lib/axios";
import OlvidePasswordView from "@/views/auth/OlvidePasswordView.vue";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

interface LoginFormData {
  email: string;
  password: string;
}

export default {
  register(data: RegisterFormData) {
    return api.post("/auth/register", data);
  },

  verifyAccount(token: string) {
    return api.get(`/auth/verify/${token}`);
  },

  login(data: LoginFormData) {
    return api.post(`/auth/login`, data);
  },

  auth() {
    const token = localStorage.getItem("AUTH_TOKEN");
    return api.get("auth/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  olvidePasswor(data) {
    return api.post("auth/olvide-password", data);
  },
  verifyPasswordResetToken(token) {
    return api.get(`auth/olvide-password/${token}`);
  },
  updatePassword(token, data) {
    return api.post(`auth/olvide-password/${token}`, data);
  },
  admin(){
    api.get('auth/admin')
  }

};
