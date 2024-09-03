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
      console.log("Updating order...", data, id);
      return axiosClient._patch(`/order/${id}`, data);
    },

    onSuccess: (response) => {
      toast.update("Order updated successfully.", "success");
      console.log("Order updated successfully.", "success", response);
      // Refresh data related to the stock after a successful update
      queryClient.invalidateQueries({ queryKey: ordersKeys.lists });
    },

    onError: (error) => {
      toast.update("Unable to update order. Please try again.", "error");
      console.log(error.response.data.message, "error");
    },
  });
};

export const useConfirmOrderUser = () => {
  const queryClient = useQueryClient();
  const axiosClient = useAxios();

  return useMutation({
    mutationFn: ({ id, data }) => {
      toast.loading("Confirm order...");
      console.log("Confirm order...", data, id);
      return axiosClient._patch(`/order/payment/${id}`, data);
    },

    onSuccess: (response) => {
      toast.update("Order confirmed successfully.", "success");
      console.log("Order confirmed successfully.", "success", response);
      // Refresh data related to the stock after a successful update
      queryClient.invalidateQueries({ queryKey: ordersKeys.lists });
    },

    onError: (error) => {
      toast.loading("Error confirming the order. Please try again.");
      console.log(error.response.data.message, "error");
    },
  });
};

export const useCancelOrderUser = () => {
  const queryClient = useQueryClient();
  const axiosClient = useAxios();

  return useMutation({
    mutationFn: ({ id }) => {
      toast.loading("Cancel order...");
      console.log("Cancel order...", id);
      return axiosClient._patch(`/order/cancel/${id}`);
    },

    onSuccess: (response) => {
      toast.loading("Order canceled successfully.");
      console.log("Order canceled successfully.", "success", response);
      // Refresh data related to the stock after a successful update
      queryClient.invalidateQueries({ queryKey: orderKeys.lists });
    },

    onError: (error) => {
      toast.loading("Error ordered. Please try again.");
      console.log(error.response.data.message, "error");
    },
  });
};
