import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../../../Hooks/useAxios";
import ordersKeys from ".";
import useLoadingToast from "../../../../Hooks/useToast";

export const useCreateOrderGroup = () => {
  const axiosClient = useAxios();

  return useMutation({
    mutationFn: () => {
      console.log("Creating order...");
      return axiosClient._post(`/order-group`);
    },

    onSuccess: (response) => {
      console.log("Order create successfully.", "success", response);
    },

    onError: () => {
      console.log("Failed to create order, please try again.", "error");
    },
  });
};
