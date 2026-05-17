import { Link } from "react-router-dom";
import { useTheme } from "./ThemeProvider";
import { getActiveSocialLinks } from "@/lib/site";

const LINK_CLASSES =
  "text-[1.4rem] inline-block [transition:background-position_600ms_cubic-bezier(0.45,0,0.55,1)] bg-current [background-image:linear-gradient(90deg,rgba(203,48,223,0.5)_0%,rgba(254,44,85,0.5)_46%,hsl(var(--foreground))_54%,hsl(var(--foreground))_100%)] bg-[length:220%_100%] bg-[position:100%_0] bg-clip-text text-transparent hover:bg-[position:0%_0]";

const THEME_OPTIONS = [
  { value: "light" as const, label: "Light", srLabel: "Use light theme" },
  { value: "dark" as const, label: "Dark", srLabel: "Use dark theme" },
  { value: "system" as const, label: "Auto", srLabel: "Match system theme" },
];

const Footer = () => {
  const { theme, setTheme } = useTheme();
  const socialLinks = getActiveSocialLinks();

  return (
    <footer className="border-t border-border mt-24">
      <div className="py-12 px-6 md:px-[calc(18vw-10rem)]">
        <div className="max-w-[138rem] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
            {/* Column 1: Theme Toggle */}
            <div className="flex flex-col gap-3">
              <h3 id="footer-theme-label" className="text-[1.4rem] tracking-wider mb-1">
                Select a color scheme preference
              </h3>
              <div
                role="radiogroup"
                aria-labelledby="footer-theme-label"
                className="flex gap-6"
              >
                {THEME_OPTIONS.map((option) => {
                  const selected = theme === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      aria-label={option.srLabel}
                      onClick={() => setTheme(option.value)}
                      className={`text-[1.4rem] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:rounded-sm ${
                        selected
                          ? "text-foreground underline decoration-2 underline-offset-4"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Column 2: Pages */}
            <nav className="flex flex-col gap-3" aria-label="Site pages">
              <Link to="/about" className={LINK_CLASSES}>
                About
              </Link>
              <Link to="/faq" className={LINK_CLASSES}>
                FAQ
              </Link>
              <Link to="/contact" className={LINK_CLASSES}>
                Contact
              </Link>
            </nav>

            {/* Column 3: Legal */}
            <nav className="flex flex-col gap-3" aria-label="Legal">
              <Link to="/privacy" className={LINK_CLASSES}>
                Privacy Policy
              </Link>
              <Link to="/terms" className={LINK_CLASSES}>
                Terms & Conditions
              </Link>
              <p className="text-[1.4rem] text-muted-foreground">
                © Editorial {new Date().getFullYear()}
              </p>
            </nav>

            {/* Column 4: Social — only rendered when at least one social URL is set
                in src/lib/site.ts so we don't ship placeholder links. */}
            {socialLinks.length > 0 && (
              <nav className="flex flex-col gap-3" aria-label="Social media">
                {socialLinks.map((social) => (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={LINK_CLASSES}
                  >
                    {social.label}
                  </a>
                ))}
              </nav>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
