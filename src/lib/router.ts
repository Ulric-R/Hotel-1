import { useEffect, useState } from "react";

/**
 * Tiny path-based router. We only have 2 areas: the public site and /admin.
 * For the admin section we further dispatch on subpaths.
 */
export function useRoute() {
  const [path, setPath] = useState(() =>
    typeof window !== "undefined" ? window.location.pathname : "/"
  );

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = (to: string) => {
    window.history.pushState({}, "", to);
    setPath(to);
  };

  return { path, navigate, isAdmin: path.startsWith("/admin") };
}
