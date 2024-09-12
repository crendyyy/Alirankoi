import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../../Hooks/useAxios";
import stockKeys from "../stock";
import useLoadingToast from "../../../Hooks/useToast";

export const useUpdateStock = () => {
  const queryClient = useQueryClient();
  const axiosClient = useAxios();
  const toast = useLoadingToast();

  return useMutation({
    mutationFn: (data) => {
      toast.loading("Updating stock...");
      return axiosClient._patch(`/stock`, data);
    },

    onSuccess: (response) => {
      toast.update("Stock updated successfully.", "success");
      // Refresh data related to the stock after a successful update
      queryClient.invalidateQueries({ queryKey: stockKeys.lists });
    },

    onError: () => {
      toast.update("Failed to update stock, Please try again", "error");
    },
  });
};

export const useUpdateStockPlus = () => {
  const queryClient = useQueryClient();
  const axiosClient = useAxios();
  const toast = useLoadingToast();

  return useMutation({
    mutationFn: (data) => {
      toast.loading("Added stock...");
      return axiosClient._patch(`/stock/plus`, data);
    },

    onSuccess: (response) => {
      toast.update("Stock added successfully.", "success");
      // Refresh data related to the stock after a successful update
      queryClient.invalidateQueries({ queryKey: stockKeys.lists });
    },

    onError: () => {
      toast.update("Failed to update stock, please try again.", "error");
    },
  });
};
