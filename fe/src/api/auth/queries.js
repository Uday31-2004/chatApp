import { useQuery } from "@tanstack/react-query";
import api from "../axios";

// 👤 Get current user Profile
export const useProfileQuery = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await api.get("/users/me");
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
};
