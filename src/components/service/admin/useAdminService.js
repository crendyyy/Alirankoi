import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../../Hooks/useAxios";
import stockKeys from "../stock";
import useLoadingToast from "../../../Hooks/useToast";

export const useOpenStatus = () => {
  const queryClient = useQueryClient();
  const axiosClient = useAxios();

  const toast = useLoadingToast();

  return useMutation({
    mutationFn: () => {
      toast.loading("Updating open status...");
      axiosClient._patch("/open");
    },
    onSuccess: (data) => {
      toast.update("Open status updated successfully.", "success");
      queryClient.invalidateQueries({ queryKey: stockKeys.lists });
      console.log("Success:", data);
    },
    onError: (error) => {
      toast.update("Error updating status to open. Please try again.", "error");
      console.error("Error:", error);
    },
  });
};

export const useSeperateStatus = () => {
  const queryClient = useQueryClient();
  const axiosClient = useAxios();

  return useMutation({
    mutationFn: () => {
      toast.loading("Updating status seperate mode...");
      axiosClient._patch("/separate");
    },
    onSuccess: (data) => {
      toast.update("Status updated successfully in separate mode.", "success");
      queryClient.invalidateQueries({ queryKey: stockKeys.lists });
      console.log("Success:", data);
    },
    onError: (error) => {
      toast.update("Error updating status in separate mode. Please try again.", "error");
      console.error("Error:", error);
    },
  });
};
