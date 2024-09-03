import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../../Hooks/useAxios";
import stockKeys from "../stock";

export const useUpdatePrice = () => {
  const queryClient = useQueryClient();
  const axiosClient = useAxios();

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

  return useMutation({
    mutationFn: (data) => {
      toast.update("Updating buy price...");
      console.log("Updating buy price...", data);
      return axiosClient._patch(`/buyPrice`, data);
    },

    onSuccess: (response) => {
      toast.update("Buy Price updated successfully.", "success");
      console.log("Buy Price updated successfully.", "success", response);
      // Refresh data related to the stock after a successful update
      queryClient.invalidateQueries({ queryKey: stockKeys.lists });
    },

    onError: () => {
      toast.update("Failed to update buy price, please try again", "error");
    },
  });
};
