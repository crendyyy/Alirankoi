import { useMutation, useQuery } from "@tanstack/react-query";
import useAxios from "../../../Hooks/useAxios";
import { useNavigate } from "react-router-dom";
import useLoadingToast from "../../../Hooks/useToast";

export const useLogin = () => {
  const axiosClient = useAxios();
  const toast = useLoadingToast();

  return useMutation({
    mutationFn: (credentials) => {
      toast.loading("Login...");
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      return axiosClient._post("/login", credentials, config, {
        withCredentials: true,
      });
    },
    onSuccess: ({ data }) => {
      toast.update("Login successful.", "success");
    },
    onError: (error) => {
      toast.update(
        "Login failed. Please check your credentials and try again.",
        "error"
      );
    },
  });
};

export const useRegister = () => {
  const axiosClient = useAxios();
  const navigate = useNavigate();
  const toast = useLoadingToast();

  return useMutation({
    mutationFn: (data) => {
      toast.loading("Creating account...");
      return axiosClient._post(`/register`, data);
    },

    onSuccess: (response) => {
      toast.update("Account create successfully.", "success");
      navigate("/login");
    },

    onError: () => {
      toast.update(
        "Creating account failed. Please check your details and try again.",
        "error"
      );
    },
  });
};
