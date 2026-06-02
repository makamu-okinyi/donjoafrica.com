import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404: route not found:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[50vh] space-y-6 animate-fade-in-up">
      <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
        Error 404
      </p>
      <h1 className="text-5xl sm:text-7xl font-bold text-foreground tracking-tight">
        Page not found
      </h1>
      <p className="text-lg text-muted-foreground max-w-md">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Link to="/" className="neo-pill inline-block">
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
