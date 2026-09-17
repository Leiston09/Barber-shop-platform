// src/api/AuthAPI.ts

import api from "@/lib/axios";

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface UpdatePasswordData {
  password: string;
}

export interface UserResponse {
  _id: string;
  name: string;
  email: string;
  admin: boolean;
  role: "client" | "barber" | "admin";
}

export interface AuthResponse {
  token: string;
}

export interface MessageResponse {
  msg: string;
}

export default {
  register(data: RegisterFormData) {
    return api.post<MessageResponse>(
      "/auth/register",
      data
    );
  },

  verifyAccount(token: string) {
    return api.get<MessageResponse>(
      `/auth/verify/${token}`
    );
  },

  login(data: LoginFormData) {
    return api.post<AuthResponse>(
      "/auth/login",
      data
    );
  },

  auth() {
    return api.get(
      "/auth/user"
    );
  },

  olvidePassword(data: { email: string }) {
    return api.post<MessageResponse>(
      "/auth/olvide-password",
      data
    );
  },

  verifyPasswordResetToken(token: string) {
    return api.get<MessageResponse>(
      `/auth/olvide-password/${token}`
    );
  },

  updatePassword(
    token: string,
    data: UpdatePasswordData
  ) {
    return api.post<MessageResponse>(
      `/auth/olvide-password/${token}`,
      data
    );
  },
};