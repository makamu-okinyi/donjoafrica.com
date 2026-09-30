import { Navigate, useLocation } from "react-router-dom";
import { legacyHashRedirects } from "@/data/nav";

/** Redirects old hash URLs such as /solutions#hackathons to their dedicated routes. */
const LegacyHashRedirect = () => {
  const { hash } = useLocation();
  const target = legacyHashRedirects[decodeURIComponent(hash.slice(1))];
  return target ? <Navigate to={target} replace /> : null;
};

export default LegacyHashRedirect;
