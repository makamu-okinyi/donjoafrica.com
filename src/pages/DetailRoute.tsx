import { useParams } from "react-router-dom";
import DetailPage from "@/components/DetailPage";
import NotFound from "@/pages/NotFound";
import { solutions } from "@/data/solutions";
import { platform } from "@/data/platform";

/** Resolves /solutions/:slug and /platform/:slug to the shared detail template. */
const DetailRoute = ({ family }: { family: "solutions" | "platform" }) => {
  const { slug } = useParams();
  const page = (family === "solutions" ? solutions : platform).find((p) => p.slug === slug);
  return page ? <DetailPage page={page} /> : <NotFound />;
};

export default DetailRoute;
