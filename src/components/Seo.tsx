import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  DEFAULT_OG_IMAGE,
  SITE_LOCALE,
  SITE_NAME,
  SITE_TWITTER,
  SITE_URL,
  absoluteUrl,
} from "@/lib/site";

type SchemaObject = Record<string, unknown>;

interface SeoProps {
  /** Page title; rendered as `${title} | ${SITE_NAME}` unless titleTemplate=false. */
  title: string;
  description: string;
  /** Optional override for OG image (absolute or root-relative). */
  image?: string;
  /** Override canonical path; defaults to the current location.pathname. */
  pathname?: string;
  /** "website" (default) or "article". */
  type?: "website" | "article";
  /** If true, emits robots="noindex,nofollow" (e.g. 404 page). */
  noindex?: boolean;
  /** JSON-LD object (or array of objects) injected as a single <script>. */
  jsonLd?: SchemaObject | SchemaObject[];
  /** Skip "| Site Name" suffix when true. */
  bareTitle?: boolean;
}

/**
 * Minimal, dependency-free per-page head manager. Sets <title>, meta description,
 * canonical, robots, Open Graph, Twitter, and a single JSON-LD block scoped to the
 * page. Cleans up the JSON-LD block on unmount so route changes don't accumulate
 * stale structured data.
 */
const Seo = ({
  title,
  description,
  image,
  pathname,
  type = "website",
  noindex = false,
  jsonLd,
  bareTitle = false,
}: SeoProps) => {
  const location = useLocation();

  useEffect(() => {
    const path = pathname ?? location.pathname;
    const canonical = absoluteUrl(path);
    const ogImage = image
      ? image.startsWith("http")
        ? image
        : absoluteUrl(image)
      : absoluteUrl(DEFAULT_OG_IMAGE);

    document.title = bareTitle ? title : `${title} | ${SITE_NAME}`;

    setMeta("name", "description", description);
    setMeta("name", "robots", noindex ? "noindex,nofollow" : "index,follow");

    setLink("canonical", canonical);

    setMeta("property", "og:title", document.title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", type);
    setMeta("property", "og:url", canonical);
    setMeta("property", "og:image", ogImage);
    setMeta("property", "og:site_name", SITE_NAME);
    setMeta("property", "og:locale", SITE_LOCALE);

    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", document.title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", ogImage);
    if (SITE_TWITTER) {
      setMeta("name", "twitter:site", SITE_TWITTER);
    } else {
      removeMeta("name", "twitter:site");
    }

    if (jsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.seo = "page";
      script.text = JSON.stringify(jsonLd);
      // Remove any prior page-scoped JSON-LD before injecting new one.
      document
        .querySelectorAll<HTMLScriptElement>(
          'script[type="application/ld+json"][data-seo="page"]',
        )
        .forEach((el) => el.remove());
      document.head.appendChild(script);
      return () => {
        script.remove();
      };
    }
    return undefined;
  }, [
    title,
    description,
    image,
    pathname,
    location.pathname,
    type,
    noindex,
    jsonLd,
    bareTitle,
  ]);

  return null;
};

function setMeta(
  attr: "name" | "property",
  key: string,
  value: string,
): void {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${CSS.escape(key)}"]`,
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

function setLink(rel: string, href: string): void {
  let el = document.head.querySelector<HTMLLinkElement>(
    `link[rel="${CSS.escape(rel)}"]`,
  );
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function removeMeta(attr: "name" | "property", key: string): void {
  const el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${CSS.escape(key)}"]`,
  );
  if (el) el.remove();
}

export { SITE_NAME, SITE_URL };
export default Seo;
