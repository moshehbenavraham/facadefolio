import { Fragment } from "react";
import type { ArticleBlock } from "@/data/articles";

interface ArticleBodyProps {
  blocks: ArticleBlock[];
}

/**
 * Renders the structured body of an article. Keeping the body as plain data
 * (see {@link ArticleBlock}) lets us add new block types — embeds, asides,
 * code blocks — without touching every article.
 */
export default function ArticleBody({ blocks }: ArticleBodyProps) {
  return (
    <Fragment>
      {blocks.map((block, index) => renderBlock(block, index))}
    </Fragment>
  );
}

function renderBlock(block: ArticleBlock, index: number) {
  switch (block.type) {
    case "p":
      return <p key={index}>{block.text}</p>;
    case "h2":
      return <h2 key={index}>{block.text}</h2>;
    case "figure":
      return (
        <figure key={index} className="my-12">
          <div
            className={`relative w-full ${aspectClass(block.aspect)} rounded-2xl overflow-hidden bg-muted`}
          >
            <img
              src={block.image}
              alt={block.alt}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>
          {block.caption ? (
            <figcaption className="mt-3 text-sm text-center text-muted-foreground">
              {block.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    case "pullquote": {
      const variant = block.variant ?? "indented";
      if (variant === "big") {
        return (
          <figure key={index} className="blockquote-big">
            <blockquote>{block.text}</blockquote>
            {block.attribution ? (
              <figcaption>{block.attribution}</figcaption>
            ) : null}
          </figure>
        );
      }
      return (
        <figure key={index} className="my-8">
          <blockquote className="italic text-lg border-l-4 border-primary pl-6 my-6">
            {block.text}
          </blockquote>
          {block.attribution ? (
            <figcaption className="text-sm text-muted-foreground pl-6">
              — {block.attribution}
            </figcaption>
          ) : null}
        </figure>
      );
    }
    default: {
      /* Exhaustiveness check — any new block type added to ArticleBlock
         without a corresponding case here will fail to type-check. */
      const _exhaustive: never = block;
      return _exhaustive;
    }
  }
}

function aspectClass(aspect: "16/9" | "3/4" | "1/1" | undefined): string {
  switch (aspect) {
    case "3/4":
      return "aspect-[3/4]";
    case "1/1":
      return "aspect-square";
    case "16/9":
    default:
      return "aspect-[16/9]";
  }
}
