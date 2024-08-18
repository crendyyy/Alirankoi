import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../../Hooks/useAxios";
import stockKeys from "../stock";

export const useUpdatePrice = () => {
  const queryClient = useQueryClient();
  const axiosClient = useAxios();

  return useMutation({
    mutationFn: (data) => {
      console.log("Updating price...", data);
      return axiosClient._patch(`/price`, data);
    },

    onSuccess: (response) => {
      console.log("Price updated successfully", "success", response);
      // Refresh data related to the stock after a successful update
      queryClient.invalidateQueries({ queryKey: stockKeys.lists });
    },

    onError: () => {
      toast.update("Failed to update price, please try again", "error");
    },
  });
};