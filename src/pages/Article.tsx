import { useMemo } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import ArticleBody from "@/components/ArticleBody";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";
import {
  Article as ArticleWrapper,
  ArticleHeader,
  ArticleHero,
  ArticleContainer,
  ArticleContent,
  TopShares,
} from "@/components/ArticleComponents";
import { ArticleRelatedItems } from "@/components/ArticleRelatedItems";
import {
  getArticleBySlug,
  getRelatedArticles,
  type Article as ArticleType,
} from "@/data/articles";

const Article = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticleBySlug(slug) : undefined;

  if (!article) {
    // The slug doesn't resolve to a real article. Render an inline 404
    // (noindex) inside the article shell rather than redirecting — this
    // gives readers a friendly "story not found" with quick paths back to
    // the homepage and blog, while still telling crawlers not to index
    // ghost URLs.
    return <ArticleNotFound slug={slug} />;
  }

  return <ArticleView article={article} />;
};

export default Article;

/* ----------------------------------------------------------------------- */
/* Renderers                                                                */
/* ----------------------------------------------------------------------- */

function ArticleView({ article }: { article: ArticleType }) {
  const location = useLocation();
  const pageUrl = useMemo(
    () => absoluteUrl(location.pathname),
    [location.pathname],
  );

  const shareUrl = useMemo(() => {
    if (typeof window !== "undefined" && window.location?.href) {
      return window.location.href;
    }
    return pageUrl;
  }, [pageUrl]);

  const encodedShare = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(article.title);

  const related = useMemo(
    () =>
      getRelatedArticles(article.slug, 3).map((r) => ({
        title: r.title,
        description: r.description,
        image: r.cardImage ?? r.hero,
        tag: r.category,
        slug: r.slug,
      })),
    [article.slug],
  );

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: [
      typeof article.hero === "string" && article.hero.startsWith("http")
        ? article.hero
        : absoluteUrl(article.hero),
    ],
    datePublished: article.datePublished,
    dateModified: article.dateModified ?? article.datePublished,
    inLanguage: "en-US",
    articleSection: article.category,
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
    author: {
      "@type": "Person",
      name: article.author.name,
      jobTitle: article.author.title,
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: SITE_NAME,
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: absoluteUrl("/blog"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: pageUrl,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={article.title}
        description={article.description}
        type="article"
        image={article.hero}
        jsonLd={[articleJsonLd, breadcrumbJsonLd]}
      />
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <ArticleWrapper>
          <ArticleHeader
            title={article.title}
            date={article.readableDate}
            author={{
              name: article.author.name,
              title: article.author.title,
              avatar: article.author.avatar,
            }}
          />

          <ArticleHero image={article.hero} alt={article.heroAlt} />

          <ArticleContainer>
            <TopShares
              facebookUrl={`https://www.facebook.com/sharer/sharer.php?u=${encodedShare}`}
              twitterUrl={`https://twitter.com/intent/tweet?url=${encodedShare}&text=${encodedTitle}`}
              linkedinUrl={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedShare}&title=${encodedTitle}`}
            />
            <ArticleContent>
              <ArticleBody blocks={article.body} />
            </ArticleContent>
          </ArticleContainer>
        </ArticleWrapper>

        {related.length > 0 ? (
          <section aria-label="Related articles">
            <ArticleRelatedItems items={related} />
          </section>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}

function ArticleNotFound({ slug }: { slug: string | undefined }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Seo
        title="Article Not Found"
        description="We couldn't find the story you were looking for. Browse the latest articles instead."
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
            Article Not Found
          </p>
          <h1 className="text-[3.4rem] md:text-[4.2rem] lg:text-[6rem] font-semibold tracking-[-0.01em] leading-[1.1] mb-[2rem]">
            That story isn't in our archive.
          </h1>
          <p className="text-[1.8rem] leading-[1.8] text-muted-foreground mb-[3rem]">
            We couldn't find an article matching{" "}
            {slug ? (
              <code className="px-2 py-1 rounded bg-muted text-foreground/80">
                {slug}
              </code>
            ) : (
              "that address"
            )}
            . It may have been retitled, retired, or never published.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/blog"
              className="inline-block px-8 py-3 text-[1.6rem] font-medium bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity"
            >
              Browse the latest articles
            </Link>
            <Link
              to="/"
              className="inline-block px-8 py-3 text-[1.6rem] font-medium border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Back to the home page
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
