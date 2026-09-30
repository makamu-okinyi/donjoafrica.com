import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import { breadcrumbsFor } from "@/data/seo";

/** Visible breadcrumb trail (paired with BreadcrumbList JSON-LD from usePageMeta). */
const Breadcrumbs = () => {
  const { pathname } = useLocation();
  const crumbs = breadcrumbsFor(pathname);
  if (crumbs.length < 2) return null;
  return (
    <nav aria-label="Breadcrumb" className="mb-6 px-2 text-sm text-muted-foreground">
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
