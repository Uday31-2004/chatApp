import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../axios";
import { successToast } from "../../components/toast";
import { useNavigate } from "react-router-dom";
// 🔐 Login
export const useLoginMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post("/auth/login", payload);
      localStorage.setItem("access_token", data.accessToken);
      return data;
    },
    onSuccess: () => {
      successToast("You have logged in successfully!");
      navigate("/dashboard");
    },
  });
};
// 📝 Register
// 📝 Register
export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post("/auth/register", payload);
      return data;
    },

    onSuccess: () => {
      successToast("You have registered successfully! Please login.");
    },
  });
};

// 🚪 Logout
export const useLogoutMutation = () =>
  useMutation({
    mutationFn: async () => {
      await api.post("/auth/logout");
      localStorage.removeItem("access_token");
    },
  });
