import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../../../Hooks/useAxios";
import orderKeys from ".";
import useLoadingToast from "../../../../Hooks/useToast";

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  const axiosClient = useAxios();

  const toast = useLoadingToast();

  return useMutation({
    mutationFn: (id) => {
      toast.loading("Deleting order...");
      return axiosClient._delete(`/order/${id}`);
    },

    onSuccess: (response) => {
      toast.update("Order deleted successfully.", "success");
      // Refresh data related to the stock after a successful update
      queryClient.invalidateQueries({ queryKey: orderKeys.lists });
    },

    onError: () => {
      toast.update("Failed to update price, please try again", "error");
    },
  });
};
