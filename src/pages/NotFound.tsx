import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof console !== "undefined" && location.pathname !== "/") {
      // Surface the bad path once for client-side debugging without spamming.
      console.warn("404: route not found:", location.pathname);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Seo
        title="Page Not Found"
        description="The page you were looking for has moved, been retired, or never existed. Return to the home page to keep reading."
        noindex
      />
      <Header />
      <main
        id="main"
        tabIndex={-1}
        className="flex-1 flex items-center justify-center px-6 py-24 md:py-32 outline-none"
      >
        <div className="max-w-[64rem] text-center">
          <p className="text-[1.4rem] tracking-[0.2rem] uppercase text-muted-foreground mb-[1.5rem]">
            Error 404
          </p>
          <h1 className="text-[3.4rem] md:text-[4.2rem] lg:text-[6rem] font-semibold tracking-[-0.01em] leading-[1.1] mb-[2rem]">
            This page is between buildings.
          </h1>
          <p className="text-[1.8rem] leading-[1.8] text-muted-foreground mb-[3rem]">
            The address you followed isn't on our map. It may have been
            renamed, retired, or never published. The path you tried was{" "}
            <code className="px-2 py-1 rounded bg-muted text-foreground/80">
              {location.pathname}
            </code>
            .
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/"
              className="inline-block px-8 py-3 text-[1.6rem] font-medium bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity"
            >
              Back to the home page
            </Link>
            <Link
              to="/blog"
              className="inline-block px-8 py-3 text-[1.6rem] font-medium border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Browse the latest articles
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
