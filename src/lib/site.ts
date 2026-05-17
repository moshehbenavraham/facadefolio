/**
 * Central site configuration. Update SITE_URL here (and in public/sitemap.xml)
 * if the deployment host changes.
 */
export const SITE_URL = "https://architecture-blog.vercel.app";
export const SITE_NAME = "Architecture Blog";
export const SITE_TAGLINE =
  "Nordic design, modern interiors, and sustainable urbanism";
export const SITE_DESCRIPTION =
  "Architecture editorial on Nordic design, modern interiors, and sustainable urbanism — photography, essays, and analysis from across Scandinavia and beyond.";
export const SITE_LOCALE = "en_US";
/**
 * Twitter / X handle for the publication. Set to `null` (or undefined) when no
 * account exists yet — components and JSON-LD will omit the `twitter:site`
 * meta and the corresponding `sameAs` entry rather than ship a fictional
 * handle that resolves to nothing.
 */
export const SITE_TWITTER: string | null = null;
export const DEFAULT_OG_IMAGE = "/social-card.svg";

/**
 * The publication's contact email — surfaced in the header overlay, the
 * contact page, and structured data. Update this alongside CONTACT_EMAIL in
 * the page-level form once a real inbox is wired up.
 */
export const SITE_CONTACT_EMAIL = "hello@editorial.com";

export type SocialPlatform =
  | "facebook"
  | "twitter"
  | "instagram"
  | "linkedin"
  | "youtube";

/**
 * Social profile URLs for the publication. Each entry is intentionally `null`
 * by default — we'd rather render nothing than ship placeholder links that
 * route visitors to facebook.com / twitter.com / instagram.com homepages and
 * pollute Organization JSON-LD with fake `sameAs` entries.
 *
 * Fill in real URLs (full https:// URLs, e.g.
 * "https://www.instagram.com/yourbrand") to surface the icons site-wide.
 */
export const SOCIAL_LINKS: Record<SocialPlatform, string | null> = {
  facebook: null,
  twitter: null,
  instagram: null,
  linkedin: null,
  youtube: null,
};

export const SOCIAL_LABELS: Record<SocialPlatform, string> = {
  facebook: "Facebook",
  twitter: "Twitter",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  youtube: "YouTube",
};

export interface SocialEntry {
  platform: SocialPlatform;
  url: string;
  label: string;
}

/**
 * Returns only the social entries with a populated URL. Components should
 * call this and render conditionally so the "no social presence yet" state is
 * visually clean (no dead links, no half-built lists).
 */
export function getActiveSocialLinks(): SocialEntry[] {
  return (Object.keys(SOCIAL_LINKS) as SocialPlatform[])
    .map((platform) => {
      const url = SOCIAL_LINKS[platform];
      return url
        ? { platform, url, label: SOCIAL_LABELS[platform] }
        : null;
    })
    .filter((entry): entry is SocialEntry => entry !== null);
}

/**
 * Build an absolute URL for a given path. Prefers the runtime origin
 * (useful for preview deployments and local dev); falls back to SITE_URL
 * during SSR-ish environments and inside JSON-LD generation at build time.
 */
export function absoluteUrl(path: string = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin}${normalized}`;
  }
  return `${SITE_URL}${normalized}`;
}
