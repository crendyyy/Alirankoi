import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../../Hooks/useAxios";
import ordersKeys from ".";

export const useGetUserOrders = () => {
  const axiosClient = useAxios();

  const cacheKey = ordersKeys.lists;

  const query = useQuery({
    queryKey: cacheKey,
    staleTime: Infinity,
    queryFn: () => axiosClient._get(`/user/order`),
  });
  // console.log(query.data);

  return {
    ...query,
    data: query.data?.data,
    isPending: query.isPending,
    isError: query.isError,
  };
};
