import { Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Section from "@/components/Section";
import Seo from "@/components/Seo";
import ArticlePreview from "@/components/ArticlePreview";
import BlogHighlight from "@/components/BlogHighlight";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";
import {
  CATEGORIES,
  getAllArticlesNewestFirst,
  getFeaturedArticle,
  getOpinionRow,
  getRecentArticles,
  type ArticleCategory,
} from "@/data/articles";

type CategoryFilter = "All" | ArticleCategory;

const Blog = () => {
  const articlesRef = useRef<(HTMLElement | null)[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("All");

  // Featured article (most recent) drives the hero. Carousel and grid then
  // exclude it so we don't show the same story twice on a single screen.
  const featuredArticle = useMemo(() => getFeaturedArticle(), []);
  const carouselArticles = useMemo(
    () => getRecentArticles(5, [featuredArticle.slug]),
    [featuredArticle.slug],
  );
  const allArticles = useMemo(
    () =>
      getAllArticlesNewestFirst().filter(
        (a) => a.slug !== featuredArticle.slug,
      ),
    [featuredArticle.slug],
  );
  const opinions = useMemo(() => getOpinionRow(), []);

  const filteredArticles = useMemo(
    () =>
      selectedCategory === "All"
        ? allArticles
        : allArticles.filter((a) => a.category === selectedCategory),
    [allArticles, selectedCategory],
  );

  useEffect(() => {
    // Reset the ref array each filter pass so stale nodes don't accumulate.
    articlesRef.current = [];
  }, [selectedCategory]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fadeInUp");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    articlesRef.current.forEach((article) => {
      if (article) observer.observe(article);
    });

    return () => observer.disconnect();
  }, [selectedCategory, filteredArticles]);

  const filterOptions: CategoryFilter[] = ["All", ...CATEGORIES];

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}/#blog`,
    name: SITE_NAME,
    url: absoluteUrl("/"),
    description:
      "Architecture editorial on Nordic design, modern interiors, and sustainable urbanism.",
    inLanguage: "en-US",
    publisher: { "@id": `${SITE_URL}/#organization` },
    // The 5 most recent posts is plenty — search engines pick up the rest
    // via /article/<slug> pages and the sitemap.
    blogPost: getAllArticlesNewestFirst()
      .slice(0, 5)
      .map((a) => ({
        "@type": "BlogPosting",
        headline: a.title,
        url: absoluteUrl(`/article/${a.slug}`),
        description: a.description,
        datePublished: a.datePublished,
        author: {
          "@type": "Person",
          name: a.author.name,
        },
      })),
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Architecture Blog — Nordic Design and Sustainable Urbanism"
        description="Architecture editorial on Nordic design, modern interiors, and sustainable urbanism — photography, essays, and analysis from across Scandinavia and beyond."
        type="website"
        bareTitle
        jsonLd={blogJsonLd}
      />
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Section>
          <BlogHighlight
            title={featuredArticle.title}
            description={featuredArticle.description}
            href={`/article/${featuredArticle.slug}`}
            imageSrc={featuredArticle.cardImage ?? featuredArticle.hero}
            imageAlt={featuredArticle.heroAlt}
          />
        </Section>

        {/* Recent Stories Carousel */}
        {carouselArticles.length > 0 ? (
          <Section
            className="relative overflow-x-scroll scroll-smooth snap-x snap-mandatory pb-28 [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [scrollbar-width:none]
[&::-webkit-scrollbar]:hidden"
          >
            <h2 className="sr-only">Recent stories</h2>
            <div className="m-0 flex w-full list-none items-start overflow-x-visible after:ml-[-6.25%] after:block after:flex-[0_0_calc(50vw-50%)] after:content-[''] lg:after:ml-[-4.347826087%]">
              {carouselArticles.map((article, index) => (
                <div
                  key={article.slug}
                  ref={(el) => (articlesRef.current[index] = el)}
                  className="m-0 mr-[6.25%] inline-flex max-w-[42rem] flex-[0_0_80%] scroll-snap-align-center sm:flex-[0_0_43.75%] lg:mr-[4.347826087%] lg:flex-[0_0_30.434783%]"
                >
                  <ArticlePreview
                    title={article.title}
                    slug={article.slug}
                    image={article.cardImage ?? article.hero}
                    imageAlt={article.heroAlt}
                    category={article.category}
                    categorySlug={article.category.toLowerCase()}
                    teaser={article.description}
                  />
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {/* Opinions Section */}
        {opinions.length > 0 ? (
          <Section>
            <h2
              className="text-[hsl(var(--editorial-text))]"
              style={{
                width: "100%",
                marginBottom: "3rem",
                padding: "1rem 0",
                textAlign: "left",
                letterSpacing: "0.2rem",
                textTransform: "uppercase",
                borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
                fontSize: "1.6rem",
                fontWeight: 600,
                lineHeight: 1.5,
              }}
            >
              Opinions
            </h2>
            <div className="m-0 grid w-full list-none gap-12 p-0 text-left sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] 2xl:gap-24">
              {opinions.map((opinion, index) => (
                <Link
                  key={opinion.slug}
                  to={`/article/${opinion.slug}`}
                  ref={(el) =>
                    (articlesRef.current[carouselArticles.length + index] = el)
                  }
                  className="group blog-feed__item"
                  style={{
                    flex: "0 0 calc(25% - 2.25rem)",
                    animationDelay: `${index * 150}ms`,
                  }}
                >
                  <article className="h-full">
                    <div className="relative w-[60px] h-[60px] rounded-full overflow-hidden bg-muted mb-4">
                      <img
                        src={opinion.author.avatar}
                        alt={opinion.author.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <p className="text-[1.3rem] uppercase tracking-[0.18rem] text-muted-foreground mb-2">
                      {opinion.author.name}
                    </p>
                    <h2 className="font-sans font-semibold text-[2.2rem] md:text-[2.7rem] leading-[1.4] text-[hsl(var(--editorial-text))] text-left">
                      <span className="inline-block mb-[-0.3em] pb-[0.3em] [transition:background-position_600ms_cubic-bezier(0.45,0,0.55,1)] bg-current [background-image:linear-gradient(90deg,rgba(203,48,223,0.5)_0%,rgba(254,44,85,0.5)_46%,hsl(var(--foreground))_54%,hsl(var(--foreground))_100%)] bg-[length:220%_100%] bg-[position:100%_0] bg-clip-text text-transparent group-hover:bg-[position:0%_0]">
                        {opinion.title}
                      </span>
                    </h2>
                  </article>
                </Link>
              ))}
            </div>
          </Section>
        ) : null}

        {/* More Articles Section */}
        <Section>
          <h2
            className="text-[hsl(var(--editorial-text))]"
            style={{
              width: "100%",
              marginBottom: "3rem",
              padding: "1rem 0",
              textAlign: "left",
              letterSpacing: "0.2rem",
              textTransform: "uppercase",
              borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
              fontSize: "1.6rem",
              fontWeight: 600,
              lineHeight: 1.5,
            }}
          >
            More Articles
          </h2>

          {/* Category Filter Bar */}
          <div
            role="tablist"
            aria-label="Filter articles by category"
            className="flex gap-4 mb-8 flex-wrap bg-background py-4 justify-center w-screen relative left-1/2 right-1/2 ml-0 mr-0"
            style={{
              position: "sticky",
              top: "72px",
              zIndex: 10,
              marginLeft: "calc(-50vw + 50%)",
              marginRight: "calc(-50vw + 50%)",
            }}
          >
            {filterOptions.map((category) => {
              const selected = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setSelectedCategory(category)}
                  className={`uppercase tracking-wide text-[1.6rem] leading-[2rem] font-normal px-4 py-2 rounded-[0.6rem] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 ${
                    selected
                      ? "bg-[rgba(254,44,85,0.15)] text-[#FE2C55]"
                      : "text-[hsl(var(--foreground))] hover:text-[#FE2C55]"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {filteredArticles.length === 0 ? (
            <p className="text-[1.6rem] text-muted-foreground py-12 text-center">
              No articles in this category yet. Check back soon.
            </p>
          ) : (
            <div className="grid list-none gap-x-16 gap-y-24 py-8 text-left sm:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map((article, index) => (
                <div
                  key={article.slug}
                  ref={(el) =>
                    (articlesRef.current[
                      carouselArticles.length + opinions.length + index
                    ] = el)
                  }
                  className="blog-feed__item"
                  style={{
                    animationDelay: `${(index % 3) * 150}ms`,
                  }}
                >
                  <ArticlePreview
                    title={article.title}
                    slug={article.slug}
                    image={article.cardImage ?? article.hero}
                    imageAlt={article.heroAlt}
                    category={article.category}
                    categorySlug={article.category.toLowerCase()}
                    teaser={article.description}
                  />
                </div>
              ))}
            </div>
          )}
        </Section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
