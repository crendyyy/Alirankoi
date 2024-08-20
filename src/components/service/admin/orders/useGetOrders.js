import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../../Hooks/useAxios";
import orderKeys from ".";

export const useGetOrders = () => {
  const axiosClient = useAxios();

  const cacheKey = orderKeys.lists;

  const query = useQuery({
    queryKey: cacheKey,
    staleTime: Infinity,
    queryFn: () => axiosClient._get(`/order`),
  });

  // console.log(query.data?.data.payload);

  return { ...query, data: query.data?.data };
};
