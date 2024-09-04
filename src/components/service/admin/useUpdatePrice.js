import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../../Hooks/useAxios";
import stockKeys from "../stock";
import useLoadingToast from "../../../Hooks/useToast";

export const useUpdatePrice = () => {
  const queryClient = useQueryClient();
  const axiosClient = useAxios();

  const toast = useLoadingToast();

  return useMutation({
    mutationFn: (data) => {
      toast.loading("Updating price...");
      console.log("Updating price...", data);
      return axiosClient._patch(`/price`, data);
    },

    onSuccess: (response) => {
      toast.update("Price updated successfully.", "success");
      console.log("Price updated successfully", "success", response);
      // Refresh data related to the stock after a successful update
      queryClient.invalidateQueries({ queryKey: stockKeys.lists });
    },

    onError: () => {
      toast.update("Failed to update price, please try again", "error");
    },
  });
};

export const useUpdateBuyPrice = () => {
  const queryClient = useQueryClient();
  const axiosClient = useAxios();
  const toast = useLoadingToast();

  return useMutation({
    mutationFn: (data) => {
      toast.loading("Updating capital price...");
      console.log("Updating capital price...", data);
      return axiosClient._patch(`/buyPrice`, data);
    },

    onSuccess: (response) => {
      toast.update("Capital price updated successfully.", "success");
      console.log("Capital price updated successfully.", "success", response);
      // Refresh data related to the stock after a successful update
      queryClient.invalidateQueries({ queryKey: stockKeys.lists });
    },

    onError: () => {
      toast.update("Failed to update buy price, please try again", "error");
    },
  });
};
