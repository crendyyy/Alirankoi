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
      toast.update("Login success", "success");
      console.log(data.message, "success");
    },
    onError: (error) => {
      toast.update("Gagal, silahkan coba lagi", "error");
      console.log(error.response.data.message, "error");
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
      console.log("Creating account...", data);
      return axiosClient._post(`/register`, data);
    },

    onSuccess: (response) => {
      toast.update("Account create successfully", "success");
      console.log("Account create successfully", "success", response);
      navigate("/login");
    },

    onError: () => {
      toast.update("Gagal, silahkan coba lagi", "error");
    },
  });
};
