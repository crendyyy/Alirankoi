import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../../../Hooks/useAxios";
import orderKeys from ".";

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  const axiosClient = useAxios();

  return useMutation({
    mutationFn: (id) => {
      console.log("Deleting order...");
      return axiosClient._delete(`/order/${id}`);
    },

    onSuccess: (response) => {
      console.log("Order deleted successfully", "success", response);
      // Refresh data related to the stock after a successful update
      queryClient.invalidateQueries({ queryKey: orderKeys.lists });
    },

    onError: () => {
      toast.update("Failed to update price, please try again", "error");
    },
  });
};
