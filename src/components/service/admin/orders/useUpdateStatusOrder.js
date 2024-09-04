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
      toast.loading("Updating status order...");
      console.log("Updating status order...");
      return axiosClient._patch(`/order/status/${id}`, data);
    },

    onSuccess: (response) => {
      toast.update("Status order updated successfully.", "success");
      console.log("Status Order updated successfully.", "success", response);
      // Refresh data related to the stock after a successful update
      queryClient.invalidateQueries({ queryKey: orderKeys.lists });
    },

    onError: () => {
      toast.update("Failed to update status, please try again", "error");
    },
  });
};

export const useUpdateDataOrder = () => {
  const queryClient = useQueryClient();
  const axiosClient = useAxios();

  return useMutation({
    mutationFn: ({ id, data }) => {
      toast.loading("Updating order...");
      console.log("Updating order...");
      return axiosClient._patch(`/admin/order/${id}`, data);
    },

    onSuccess: (response) => {
      toast.update("Order updated successfully.", "success");
      console.log("Order updated successfully.", "success", response);
      // Refresh data related to the stock after a successful update
      queryClient.invalidateQueries({ queryKey: orderKeys.lists });
    },

    onError: () => {
      toast.update("Failed to update order, please try again", "error");
    },
  });
};
