import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../Hooks/useAxios";
import stockKeys from ".";

export const useGetStock = () => {
  const axiosClient = useAxios();

  const cacheKey = stockKeys.lists;

  const query = useQuery({
    queryKey: cacheKey,
    staleTime: Infinity,
    queryFn: () => axiosClient._get(`/stock`),
  });
  // console.log(query.data);

  return {
    ...query,
    data: query.data?.data,
    isPending: query.isPending,
    isError: query.isError,
  };
};
