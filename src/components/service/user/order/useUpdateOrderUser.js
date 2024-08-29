import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../../../Hooks/useAxios";
import orderKeys from ".";

export const useUpdateOrderUser = () => {
  const queryClient = useQueryClient();
  const axiosClient = useAxios();

  return useMutation({
    mutationFn: ({ id, data }) => {
      console.log("Updating order...", data, id);
      return axiosClient._patch(`/order/${id}`, data);
    },

    onSuccess: (response) => {
      console.log("Order updated successfully", "success", response);
      // Refresh data related to the stock after a successful update
      queryClient.invalidateQueries({ queryKey: orderKeys.lists });
    },

    onError: (error) => {
      console.log(error.response.data.message, "error");
    },
  });
};

export const useConfirmOrderUser = () => {
  const queryClient = useQueryClient();
  const axiosClient = useAxios();

  return useMutation({
    mutationFn: ({ id, data }) => {
      console.log("Confirm order...", data, id);
      return axiosClient._patch(`/order/payment/${id}`, data);
    },

    onSuccess: (response) => {
      console.log("Order updated successfully", "success", response);
      // Refresh data related to the stock after a successful update
      queryClient.invalidateQueries({ queryKey: orderKeys.lists });
    },

    onError: (error) => {
      console.log(error.response.data.message, "error");
    },
  });
};

export const useCancelOrderUser = () => {
  const queryClient = useQueryClient();
  const axiosClient = useAxios();

  return useMutation({
    mutationFn: ({ id }) => {
      console.log("Cancel order...", id);
      return axiosClient._patch(`/order/cancel/${id}`);
    },

    onSuccess: (response) => {
      console.log("Order cancel successfully", "success", response);
      // Refresh data related to the stock after a successful update
      queryClient.invalidateQueries({ queryKey: orderKeys.lists });
    },

    onError: (error) => {
      console.log(error.response.data.message, "error");
    },
  });
};
