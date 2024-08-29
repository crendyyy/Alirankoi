import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../../Hooks/useAxios";
import orderKeys from ".";

export const useGetUserList = () => {
  const axiosClient = useAxios();

  const cacheKey = ['userList'];

  const query = useQuery({
    queryKey: cacheKey,
    staleTime: Infinity,
    queryFn: () => axiosClient._get(`/admin/userlist`),
  });

  // console.log(query.data?.data.payload);

  return { ...query, data: query.data?.data };
};
