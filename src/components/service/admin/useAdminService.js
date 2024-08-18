import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../../Hooks/useAxios";
import stockKeys from "../stock";

export const useOpenStatus = () => {
  const queryClient = useQueryClient();
  const axiosClient = useAxios();

  return useMutation({
    mutationFn: () => axiosClient._patch("/open"),
    onSuccess: (data) => {
     queryClient.invalidateQueries({queryKey: stockKeys.lists});
      console.log("Success:", data);
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });
};

export const useSeperateStatus = () => {
  const queryClient = useQueryClient();
  const axiosClient = useAxios();

  return useMutation({
    mutationFn: () => axiosClient._patch("/separate"),
    onSuccess: (data) => {
     queryClient.invalidateQueries({queryKey: stockKeys.lists});
      console.log("Success:", data);
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });
};
