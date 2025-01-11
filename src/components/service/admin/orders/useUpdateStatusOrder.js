import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../../../Hooks/useAxios";
import orderKeys from ".";
import useLoadingToast from "../../../../Hooks/useToast";

export const useUpdateStatusOrder = () => {
  const queryClient = useQueryClient();
  const axiosClient = useAxios();

  const toast = useLoadingToast();

  return useMutation({
    mutationFn: ({ id, data }) => {
      toast.loading("Updating order...");
      return axiosClient._patch(`/order/status/${id}`, data);
    },

    onSuccess: (response) => {
      toast.update("Order updated successfully.", "success");

      // Refresh data related to the stock after a successful update
      queryClient.invalidateQueries({ queryKey: orderKeys.lists });
    },

    onError: (error) => {
      toast.update("Failed to update order, please try again", "error");

      console.error("Error:", error);
    },
  });
};

export const useUpdateDataOrder = () => {
  const queryClient = useQueryClient();
  const axiosClient = useAxios();

  const toast = useLoadingToast();

  return useMutation({
    mutationFn: ({ id, data }) => {
      toast.loading("Updating order...");
      return axiosClient._patch(`/admin/order/${id}`, data);
    },

    onSuccess: (response) => {
      toast.update("Order updated successfully.", "success");
      // Refresh data related to the stock after a successful update
      queryClient.invalidateQueries({ queryKey: orderKeys.lists });
    },

    onError: () => {
      toast.update("Failed to update order, please try again", "error");
    },
  });
};
