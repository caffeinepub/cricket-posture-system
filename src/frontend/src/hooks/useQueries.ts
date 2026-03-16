import { useActor } from "@/hooks/useActor";
import { useQuery } from "@tanstack/react-query";
import type { AnalysisReport, UserProfile } from "../backend.d";

export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMyReports() {
  const { actor, isFetching } = useActor();
  return useQuery<AnalysisReport[]>({
    queryKey: ["myReports"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyReports();
    },
    enabled: !!actor && !isFetching,
  });
}
