import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../../../Hooks/useAxios";
import ordersKeys from ".";
import useLoadingToast from "../../../../Hooks/useToast";

export const useUpdateOrderUser = () => {
  const queryClient = useQueryClient();
  const axiosClient = useAxios();
  const toast = useLoadingToast();

  return useMutation({
    mutationFn: ({ id, data }) => {
      toast.loading("Updating order...");
      return axiosClient._patch(`/order/${id}`, data);
    },

    onSuccess: (response) => {
      toast.update("Order updated successfully.", "success");
      // Refresh data related to the stock after a successful update
      queryClient.invalidateQueries({ queryKey: ordersKeys.lists });
    },

    onError: (error) => {
      toast.update("Unable to update order. Please try again.", "error");
    },
  });
};

export const useConfirmOrderUser = () => {
  const queryClient = useQueryClient();
  const axiosClient = useAxios();
  const toast = useLoadingToast();

  return useMutation({
    mutationFn: ({ id, data }) => {
      toast.loading("Confirm order...");
      return axiosClient._patch(`/order/payment/${id}`, data);
    },

    onSuccess: (response) => {
      toast.update("Order confirmed successfully.", "success");
      // Refresh data related to the stock after a successful update
      queryClient.invalidateQueries({ queryKey: ordersKeys.lists });
    },

    onError: (error) => {
      toast.update("Error confirming the order. Please try again.", "error");
    },
  });
};

export const useCancelOrderUser = () => {
  const queryClient = useQueryClient();
  const axiosClient = useAxios();
  const toast = useLoadingToast();

  return useMutation({
    mutationFn: ({ id }) => {
      toast.loading("Cancel order...");
      return axiosClient._patch(`/order/cancel/${id}`);
    },

    onSuccess: (response) => {
      toast.update("Order canceled successfully.", "success");
      // Refresh data related to the stock after a successful update
      queryClient.invalidateQueries({ queryKey: ordersKeys.lists });
    },

    onError: (error) => {
      toast.update("Error cancel ordered. Please try again.", "error");
    },
  });
};
