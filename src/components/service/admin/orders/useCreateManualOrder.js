import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../../../Hooks/useAxios";
import ordersKeys from ".";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const axiosClient = useAxios();

  return useMutation({
    mutationFn: ({ id, data }) => {
      console.log("Creating order...", data);
      return axiosClient._post(`/admin/order/${id}`, data);
    },

    onSuccess: (response) => {
      console.log("Order create successfully", "success", response);
      // Refresh data related to the stock after a successful update
      queryClient.invalidateQueries({ queryKey: ordersKeys.lists });
    },

    onError: () => {
      toast.update("Failed to create order, please try again", "error");
    },
  });
};
