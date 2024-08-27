import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../Hooks/useAxios";
import tesKeys from ".";

export const useGetTes = () => {
  const axiosClient = useAxios();

  const cacheKey = tesKeys.lists;

  const query = useQuery({
    queryKey: cacheKey,
    staleTime: Infinity,
    queryFn: () => axiosClient._patch(`/stock/plus`),
  });

  return { ...query, data: query.data?.data };
};
