import { useParams } from "next/navigation";

export const useWorkspaceId = () => {
  const parms = useParams();

  return parms.workspaceId as string;
};
