import { useMutation, useQuery } from "@tanstack/react-query";
import useAxios from "../../../Hooks/useAxios";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const axiosClient = useAxios();

  return useMutation({
    mutationFn: (credentials) => {
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
      console.log(data.message, "success");
    },
    onError: (error) => {
      console.log(error.response.data.message, "error");
    },
  });
};

export const useRegister = () => {
  const axiosClient = useAxios();
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data) => {
      console.log("Creating account...", data);
      return axiosClient._post(`/register`, data);
    },

    onSuccess: (response) => {
      console.log("Account create successfully", "success", response);
      navigate('/login')
    },

    onError: () => {
      alert("Failed to create account, please try again", "error");
    },
  });
};
