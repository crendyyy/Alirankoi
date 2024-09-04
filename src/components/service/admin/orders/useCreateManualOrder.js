import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../../../Hooks/useAxios";
import ordersKeys from ".";
import useLoadingToast from "../../../../Hooks/useToast";

export const useCreateManualOrder = () => {
  const queryClient = useQueryClient();
  const axiosClient = useAxios();

  const toast = useLoadingToast();

  return useMutation({
    mutationFn: (data) => {
      toast.loading("Creating order...");
      console.log("Creating order...", data);
      return axiosClient._post(`/admin/order`, data);
    },

    onSuccess: (response) => {
      toast.update("Order create successfully.", "success");
      console.log("Order create successfully.", "success", response);
      // Refresh data related to the stock after a successful update
      queryClient.invalidateQueries({ queryKey: ordersKeys.lists });
    },

    onError: () => {
      toast.update("Failed to create order, please try again", "error");
    },
  });
};
