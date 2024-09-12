import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../../../Hooks/useAxios";
import ordersKeys from ".";
import useLoadingToast from "../../../../Hooks/useToast";

export const useCreateOrderGroup = () => {
  const axiosClient = useAxios();

  return useMutation({
    mutationFn: () => {
      return axiosClient._post(`/order-group`);
    },

    onSuccess: (response) => {},

    onError: () => {},
  });
};
