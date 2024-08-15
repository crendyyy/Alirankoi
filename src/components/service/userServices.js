import { useMutation, useQuery } from "@tanstack/react-query";
import useAxios from "../../Hooks/useAxios";

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
