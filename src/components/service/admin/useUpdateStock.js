import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../../Hooks/useAxios";
import stockKeys from "../stock";

export const useUpdateStock = () => {
  const queryClient = useQueryClient();
  const axiosClient = useAxios();

  return useMutation({
    mutationFn: (data) => {
      console.log("Updating stock...", data);
      return axiosClient._patch(`/stock`, data);
    },

    onSuccess: (response) => {
      console.log("Stock updated successfully", "success", response);
      // Refresh data related to the stock after a successful update
      queryClient.invalidateQueries({ queryKey: stockKeys.lists });
    },

    onError: () => {
      toast.update("Failed to update stock, please try again", "error");
    },
  });
};

export const useUpdateStockPlus = () => {
  const queryClient = useQueryClient();
  const axiosClient = useAxios();

  return useMutation({
    mutationFn: (data) => {
      console.log("Updating add stock...", data);
      return axiosClient._patch(`/stock/plus`, data);
    },

    onSuccess: (response) => {
      console.log("Stock add successfully", "success", response);
      // Refresh data related to the stock after a successful update
      queryClient.invalidateQueries({ queryKey: stockKeys.lists });
    },

    onError: () => {
      toast.update("Failed to update stock, please try again", "error");
    },
  });
};