import { Fragment } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { breadcrumbsFor } from "@/data/seo";

/** True when this visit has an earlier page of the site to go back to (React Router sets state.idx). */
const canGoBack = () => typeof window !== "undefined" && typeof window.history.state?.idx === "number" && window.history.state.idx > 0;

/** Visible breadcrumb trail (paired with BreadcrumbList JSON-LD from usePageMeta), with a Back button. */
const Breadcrumbs = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const crumbs = breadcrumbsFor(pathname);
  if (crumbs.length < 2) return null;
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 px-2 text-sm text-muted-foreground">
      {canGoBack() && (
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 rounded-full py-1 pr-2 font-medium text-foreground hover:underline underline-offset-4"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </button>
      )}
      <ol className="flex flex-wrap items-center gap-2">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <Fragment key={c.path}>
              <li>
                {last ? (
                  <span aria-current="page" className="font-medium text-foreground">{c.name}</span>
                ) : (
                  <Link to={c.path} className="hover:text-foreground hover:underline underline-offset-4">{c.name}</Link>
                )}
              </li>
              {!last && <li aria-hidden="true">/</li>}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
