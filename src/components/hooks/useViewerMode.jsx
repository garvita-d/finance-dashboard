import { useMemo } from "react";

export const useViewerMode = () => {
  const isViewer = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("viewer") === "true";
  }, []);

  return { isViewer };
};
