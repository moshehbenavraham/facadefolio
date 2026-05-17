import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import AppearOnScroll from "@/components/AppearOnScroll";
import { useToast } from "@/hooks/use-toast";
import {
  SITE_CONTACT_EMAIL,
  SITE_URL,
  absoluteUrl,
  getActiveSocialLinks,
} from "@/lib/site";

type ContactFormData = {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
};

type ContactFormErrors = Partial<Record<keyof ContactFormData, string>>;

const CONTACT_EMAIL = SITE_CONTACT_EMAIL;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const SOCIAL_ICONS: Record<string, JSX.Element> = {
  facebook: (
    <svg
      className="w-6 h-6"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  instagram: (
    <svg
      className="w-6 h-6"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  ),
  twitter: (
    <svg
      className="w-6 h-6"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
    </svg>
  ),
  linkedin: (
    <svg
      className="w-6 h-6"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  youtube: (
    <svg
      className="w-6 h-6"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
};

function validate(data: ContactFormData): ContactFormErrors {
  const errors: ContactFormErrors = {};
  if (!data.firstName.trim()) {
    errors.firstName = "Please enter your first name.";
  } else if (data.firstName.trim().length > 80) {
    errors.firstName = "First name is too long.";
  }
  if (data.lastName.trim().length > 80) {
    errors.lastName = "Last name is too long.";
  }
  const email = data.email.trim();
  if (!email) {
    errors.email = "Please enter your email address.";
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = "That doesn't look like a valid email address.";
  }
  const message = data.message.trim();
  if (!message) {
    errors.message = "Please include a message.";
  } else if (message.length < 10) {
    errors.message = "A few more words, please — at least 10 characters.";
  } else if (message.length > 4000) {
    errors.message = "Message is too long (max 4000 characters).";
  }
  return errors;
}

const Contact = () => {
  const { toast } = useToast();
  const socialLinks = getActiveSocialLinks();
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validate(formData);
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      toast({
        title: "Please check the form",
        description: "A couple of fields need your attention.",
        variant: "destructive",
      });
      const firstErrorKey = Object.keys(validation)[0] as keyof ContactFormData;
      const el = document.getElementById(firstErrorKey);
      if (el && "focus" in el) {
        (el as HTMLElement).focus();
      }
      return;
    }

    setIsSubmitting(true);

    // Compose a mailto fallback so the form actually delivers a message
    // (no backend yet). Most desktop and mobile mail clients honor this.
    const subject = `Editorial inquiry from ${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();
    const bodyLines = [
      `Name: ${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
      `Email: ${formData.email.trim()}`,
      "",
      formData.message.trim(),
    ];
    const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(bodyLines.join("\n"))}`;

    // Tiny artificial delay so the disabled state is perceivable, then open the
    // user's mail client. This is intentionally synchronous-ish to preserve the
    // gesture browsers require for popup-like navigations.
    await new Promise((resolve) => setTimeout(resolve, 250));
    window.location.href = mailtoUrl;

    toast({
      title: "Opening your email client",
      description:
        "We've drafted a message for you. Send it from your email app to complete the inquiry.",
    });

    setFormData({ firstName: "", lastName: "", email: "", message: "" });
    setErrors({});
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name as keyof ContactFormData];
        return next;
      });
    }
  };

  const fieldClasses = (hasError: boolean) =>
    `w-full text-[1.8rem] leading-[2.4rem] h-[60px] px-4 bg-white dark:bg-background border ${
      hasError
        ? "border-destructive focus:border-destructive focus:ring-2 focus:ring-destructive/30"
        : "border-[#d7d7db] dark:border-border focus:border-[#CB30DF] focus:ring-2 focus:ring-[rgba(203,48,223,0.2)]"
    } rounded-lg focus:outline-none transition-all placeholder:text-muted-foreground`;

  const textareaClasses = (hasError: boolean) =>
    `w-full text-[1.8rem] leading-[2.4rem] p-4 bg-white dark:bg-background border ${
      hasError
        ? "border-destructive focus:border-destructive focus:ring-2 focus:ring-destructive/30"
        : "border-[#d7d7db] dark:border-border focus:border-[#CB30DF] focus:ring-2 focus:ring-[rgba(203,48,223,0.2)]"
    } rounded-lg focus:outline-none transition-all placeholder:text-muted-foreground resize-y`;

  const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    url: absoluteUrl("/contact"),
    name: "Contact Architecture Blog",
    description:
      "Reach the editors of Architecture Blog with questions, submissions, or collaboration ideas.",
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntity: {
      "@type": "Organization",
      name: "Architecture Blog",
      email: CONTACT_EMAIL,
      url: absoluteUrl("/"),
      contactPoint: [
        {
          "@type": "ContactPoint",
          email: CONTACT_EMAIL,
          contactType: "editorial",
          availableLanguage: ["English"],
        },
      ],
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Contact"
        description="Have a story, suggestion, or collaboration idea? Reach the editors of Architecture Blog — we read every message."
        jsonLd={contactJsonLd}
      />
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">

      {/* Two Column Layout */}
      <div className="relative w-full pb-12 md:pb-20 lg:pb-32 px-6 md:px-[calc(18vw-10rem)]">
        <div className="max-w-[138rem] mx-auto flex flex-col items-center">
          <div className="relative flex items-start justify-between flex-col lg:flex-row lg:w-full gap-12 lg:gap-16">
            {/* Left Column - Info */}
            <div className="w-full lg:w-1/2 py-[3rem] md:py-[5rem] lg:py-[8rem]">
              <AppearOnScroll delay={0}>
                <div className="text-[56px] mb-6" aria-hidden="true">
                  ✉️
                </div>
              </AppearOnScroll>
              <AppearOnScroll delay={100}>
                <h1 className="text-[3.4rem] md:text-[4.2rem] lg:text-[5rem] font-semibold tracking-[-0.01em] leading-[1.2] mb-[3rem]">
                  We'd love to hear from you.
                </h1>
              </AppearOnScroll>
              <AppearOnScroll delay={200}>
                <p className="text-[1.8rem] leading-[1.8] text-muted-foreground mb-[4rem]">
                  Have a question, suggestion, or collaboration idea? We're here to listen. Drop us a message and we'll get back to you as soon as possible.
                </p>
              </AppearOnScroll>

              <AppearOnScroll delay={300}>
                <div className="space-y-3 mb-8">
                  <p className="text-[1.8rem]">
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="hover:opacity-60 transition-opacity"
                    >
                      {CONTACT_EMAIL}
                    </a>
                  </p>
                  <p className="text-[1.8rem]">
                    <a
                      href="tel:+15555555555"
                      className="hover:opacity-60 transition-opacity"
                    >
                      (555) 555-5555
                    </a>
                  </p>
                  <p className="text-[1.4rem] text-muted-foreground">
                    Prefer a different channel? See our{" "}
                    <Link
                      to="/faq"
                      className="underline underline-offset-2 hover:opacity-70 transition-opacity"
                    >
                      FAQ
                    </Link>
                    .
                  </p>
                </div>
              </AppearOnScroll>

              {socialLinks.length > 0 && (
                <AppearOnScroll delay={400}>
                  <div className="flex gap-4">
                    {socialLinks.map((social) => (
                      <a
                        key={social.platform}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 flex items-center justify-center hover:opacity-60 transition-opacity"
                        aria-label={social.label}
                      >
                        {SOCIAL_ICONS[social.platform] ?? (
                          <span className="text-[1.4rem] underline underline-offset-2">
                            {social.label}
                          </span>
                        )}
                      </a>
                    ))}
                  </div>
                </AppearOnScroll>
              )}
            </div>

            {/* Right Column - Form */}
            <div className="w-full lg:w-[44%] max-w-[80rem] py-[3rem] md:py-[5rem] lg:py-[8rem]">
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                <AppearOnScroll delay={0}>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-[1.6rem] mb-2">
                        First Name{" "}
                        <span className="text-muted-foreground">(required)</span>
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        autoComplete="given-name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        maxLength={80}
                        aria-invalid={Boolean(errors.firstName)}
                        aria-describedby={errors.firstName ? "firstName-error" : undefined}
                        className={fieldClasses(Boolean(errors.firstName))}
                        placeholder="First Name"
                      />
                      {errors.firstName && (
                        <p
                          id="firstName-error"
                          role="alert"
                          className="mt-2 text-[1.3rem] text-destructive"
                        >
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-[1.6rem] mb-2">
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        autoComplete="family-name"
                        value={formData.lastName}
                        onChange={handleChange}
                        maxLength={80}
                        aria-invalid={Boolean(errors.lastName)}
                        aria-describedby={errors.lastName ? "lastName-error" : undefined}
                        className={fieldClasses(Boolean(errors.lastName))}
                        placeholder="Last Name"
                      />
                      {errors.lastName && (
                        <p
                          id="lastName-error"
                          role="alert"
                          className="mt-2 text-[1.3rem] text-destructive"
                        >
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>
                </AppearOnScroll>

                <AppearOnScroll delay={150}>
                  <div>
                    <label htmlFor="email" className="block text-[1.6rem] mb-2">
                      Email{" "}
                      <span className="text-muted-foreground">(required)</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      maxLength={254}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      className={fieldClasses(Boolean(errors.email))}
                      placeholder="you@example.com"
                    />
                    {errors.email && (
                      <p
                        id="email-error"
                        role="alert"
                        className="mt-2 text-[1.3rem] text-destructive"
                      >
                        {errors.email}
                      </p>
                    )}
                  </div>
                </AppearOnScroll>

                <AppearOnScroll delay={300}>
                  <div>
                    <label htmlFor="message" className="block text-[1.6rem] mb-2">
                      Message{" "}
                      <span className="text-muted-foreground">(required)</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={8}
                      maxLength={4000}
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={
                        errors.message ? "message-error message-hint" : "message-hint"
                      }
                      className={textareaClasses(Boolean(errors.message))}
                      placeholder="Tell us what's on your mind…"
                    />
                    <p id="message-hint" className="mt-2 text-[1.3rem] text-muted-foreground">
                      {formData.message.length}/4000 characters
                    </p>
                    {errors.message && (
                      <p
                        id="message-error"
                        role="alert"
                        className="mt-2 text-[1.3rem] text-destructive"
                      >
                        {errors.message}
                      </p>
                    )}
                  </div>
                </AppearOnScroll>

                <AppearOnScroll delay={450}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="text-[1.8rem] font-medium h-[60px] px-12 bg-[rgba(203,48,223,0.9)] text-white rounded-lg hover:bg-[rgba(203,48,223,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Opening email…" : "Send"}
                  </button>
                </AppearOnScroll>
              </form>
            </div>
          </div>
        </div>
      </div>

      </main>
      <Footer />
    </div>
  );
};

export default Contact;
