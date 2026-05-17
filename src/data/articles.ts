/**
 * Editorial article catalog.
 *
 * The site used to ship one hardcoded article (Malmö) and a Blog feed where
 * every preview card linked to the same slug — so every "Continue reading"
 * tap on /blog dumped readers back into the same essay, and the Article
 * route ignored its :slug param entirely. This module replaces that with a
 * real catalog: typed metadata + structured `ArticleBlock[]` bodies that the
 * <ArticleBody> renderer can lay out without re-templating each article.
 *
 * To add a new article: append a new entry below, drop the hero/figure
 * images in `src/assets/`, import them at the top, and reference them by
 * the imported variable name. The Blog feed, related-articles strip,
 * sitemap helpers, and JSON-LD will pick the entry up automatically as long
 * as its slug is unique.
 */

// Malmö hero + figure images
import malmoHero from "@/assets/malmo/malmo-hero.jpg";
import malmo01 from "@/assets/malmo/malmo-01.jpg";
import malmo02 from "@/assets/malmo/malmo-02.avif";
import malmo03 from "@/assets/malmo/malmo-03.avif";
import malmo04 from "@/assets/malmo/malmo-04.avif";
import malmo05 from "@/assets/malmo/malmo-05.avif";
import malmo06 from "@/assets/malmo/malmo-06.avif";
import malmo07 from "@/assets/malmo/malmo-07.avif";
import malmo08 from "@/assets/malmo/malmo-08.avif";
import malmo09 from "@/assets/malmo/malmo-09.avif";
import malmo10 from "@/assets/malmo/malmo-10.avif";
import malmo11 from "@/assets/malmo/malmo-11.avif";
import malmo12 from "@/assets/malmo/malmo-12.avif";
import malmo13 from "@/assets/malmo/malmo-13.avif";
import malmo16 from "@/assets/malmo/malmo-16.avif";
import malmo17 from "@/assets/malmo/malmo-17.avif";
import malmo18 from "@/assets/malmo/malmo-18.avif";
import malmo19 from "@/assets/malmo/malmo-19.avif";

// Generic blog imagery used as covers / inline figures for non-Malmö articles
import blog1 from "@/assets/blog-1.avif";
import blog2 from "@/assets/blog-2.avif";
import blog3 from "@/assets/blog-3.avif";
import blog4 from "@/assets/blog-4.avif";
import blog5 from "@/assets/blog-5.avif";
import blog6 from "@/assets/blog-6.avif";
import blog9 from "@/assets/blog-9.avif";

// Editorial covers
import sustainableDev from "@/assets/sustainable-dev.jpg";
import designSystems from "@/assets/design-systems.jpg";
import storytelling from "@/assets/storytelling.jpg";
import workspaceCover from "@/assets/workspace.jpg";

// Avatars
import authorMarcus from "@/assets/author-marcus.jpg";
import avatar1 from "@/assets/avatar-1.jpg";
import avatar2 from "@/assets/avatar-2.jpg";
import avatar3 from "@/assets/avatar-3.jpg";
import avatar4 from "@/assets/avatar-4.jpg";

/* ----------------------------------------------------------------------- */
/* Types                                                                    */
/* ----------------------------------------------------------------------- */

export type ArticleCategory =
  | "Architecture"
  | "Interiors"
  | "Photography"
  | "Sustainability"
  | "Urbanism";

export const CATEGORIES: ArticleCategory[] = [
  "Architecture",
  "Interiors",
  "Photography",
  "Sustainability",
  "Urbanism",
];

export interface ArticleAuthor {
  name: string;
  /** e.g. "Architecture Photographer" — shown in byline and JSON-LD. */
  title: string;
  /** Imported avatar asset URL. */
  avatar: string;
}

/**
 * The body of an article is a flat list of typed blocks. Keeping the body
 * as plain data (rather than JSX) lets us reuse a single renderer and
 * iterate the catalog from helpers (sitemap, JSON-LD, future RSS) without
 * loading the React runtime.
 */
export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | {
      type: "figure";
      image: string;
      alt: string;
      caption: string;
      /** Defaults to "16/9" if omitted. */
      aspect?: "16/9" | "3/4" | "1/1";
    }
  | {
      type: "pullquote";
      text: string;
      attribution?: string;
      /** "big" = full-bleed, "indented" = quieter inline form. */
      variant?: "big" | "indented";
    };

export interface Article {
  slug: string;
  title: string;
  description: string;
  category: ArticleCategory;
  /** Hero image — appears at the top of the article page. */
  hero: string;
  /** Alt text for the hero image (used on /blog cards too). */
  heroAlt: string;
  /** Smaller image used on /blog preview cards. Defaults to hero. */
  cardImage?: string;
  author: ArticleAuthor;
  /** ISO 8601 date — drives JSON-LD `datePublished` and sort order. */
  datePublished: string;
  /** ISO 8601; defaults to `datePublished` if omitted. */
  dateModified?: string;
  /** Human-readable date used in the article header byline. */
  readableDate: string;
  /** Approximate reading time in minutes — for future use; not yet rendered. */
  readingTimeMinutes: number;
  body: ArticleBlock[];
}

/* ----------------------------------------------------------------------- */
/* Authors                                                                  */
/* ----------------------------------------------------------------------- */

const MARCUS: ArticleAuthor = {
  name: "Marcus Lindström",
  title: "Architecture Photographer",
  avatar: authorMarcus,
};

const EMMA: ArticleAuthor = {
  name: "Emma Thompson",
  title: "Design Critic",
  avatar: avatar1,
};

const HENRIK: ArticleAuthor = {
  name: "Henrik Sundberg",
  title: "Sustainability Editor",
  avatar: avatar2,
};

const SOFIA: ArticleAuthor = {
  name: "Sofia Rodriguez",
  title: "Interiors Editor",
  avatar: avatar3,
};

const JAMES: ArticleAuthor = {
  name: "James Wilson",
  title: "Urbanism Writer",
  avatar: avatar4,
};

/* ----------------------------------------------------------------------- */
/* Catalog                                                                  */
/* ----------------------------------------------------------------------- */

export const ARTICLES: Article[] = [
  {
    slug: "mlmo-architectural-renaissance",
    title: "MLMO: Capturing Malmö's Architectural Renaissance",
    description:
      "From industrial port to architectural laboratory—a photographer's journey through Malmö's transformation into one of Scandinavia's most daring design capitals.",
    category: "Architecture",
    hero: malmoHero,
    heroAlt: "Modern architecture in Malmö, Sweden",
    cardImage: malmoHero,
    author: MARCUS,
    datePublished: "2025-01-10",
    dateModified: "2025-01-10",
    readableDate: "January 10, 2025",
    readingTimeMinutes: 9,
    body: [
      {
        type: "p",
        text: "Malmö is one of the larger cities in Sweden and also one of the earliest and most industrialized towns of Scandinavia. During the last two decades, Malmö has undergone a major transformation with architectural developments. The Øresund Bridge connects it to Copenhagen, and both cities continue to evolve in tandem, creating a unique cross-border architectural dialogue.",
      },
      {
        type: "p",
        text: "As a photographer drawn to the language of light and form, I've watched Malmö's skyline transform from industrial silhouettes to a laboratory of contemporary design. Each visit reveals new layers of this ongoing renaissance, where cranes punctuate the horizon and glass facades reflect the ever-changing Nordic sky.",
      },
      {
        type: "p",
        text: "This is not simply a story of urban renewal—it's a testament to how cities can reinvent themselves without erasing their past. Malmö's architectural journey speaks to a broader Scandinavian ethos: that progress and preservation, modernity and humanity, can coexist in delicate balance.",
      },
      { type: "h2", text: "From Industrial Port to Architectural Laboratory" },
      {
        type: "p",
        text: "For much of the 20th century, Malmö's identity was inseparable from its shipyards and industrial infrastructure. The city's waterfront was defined by the machinery of production, not the aesthetics of living. But as traditional industries declined, Malmö faced a choice: fade into post-industrial obscurity or reimagine itself entirely.",
      },
      {
        type: "figure",
        image: malmo01,
        alt: "Modern Malmö architecture against pastel sky",
        caption: "The new skyline emerges from Malmö's industrial past",
        aspect: "16/9",
      },
      {
        type: "p",
        text: "The city chose transformation. What followed was two decades of deliberate architectural experimentation. Former dock areas became canvases for international architects. Post-industrial spaces were reclaimed as mixed-use neighborhoods. And at every turn, sustainability wasn't an afterthought—it was foundational.",
      },
      { type: "h2", text: "Geometry and Light: A Photographer's Perspective" },
      {
        type: "p",
        text: "To photograph Malmö's new architecture is to engage with a visual language of clean lines, reflective surfaces, and dramatic verticality. These buildings don't simply occupy space—they reshape it, drawing the eye upward and outward, creating new relationships between earth and sky.",
      },
      {
        type: "figure",
        image: malmo02,
        alt: "Geometric patterns of modern facade",
        caption: "Rhythmic patterns define Malmö's modernist vocabulary",
        aspect: "3/4",
      },
      {
        type: "p",
        text: "The Nordic light—soft, diffused, never harsh—plays across these geometric forms in ways that change by the hour. Morning light catches on glass towers, transforming them into golden beacons. Afternoon casts long shadows that emphasize the sculptural quality of concrete and steel. And during the fleeting moments of golden hour, the entire cityscape seems to glow from within.",
      },
      {
        type: "figure",
        image: malmo03,
        alt: "Angular architectural detail",
        caption: "Clean lines meet Scandinavian minimalism",
        aspect: "16/9",
      },
      {
        type: "pullquote",
        variant: "big",
        text: "Architecture is frozen music, and in Malmö, each building sings a different note in the symphony of urban transformation.",
        attribution: "Santiago Calatrava, Architect",
      },
      { type: "h2", text: "The Øresund Effect: Copenhagen's Architectural Twin" },
      {
        type: "p",
        text: "The completion of the Øresund Bridge in 2000 wasn't merely an infrastructural achievement—it was a catalyst for cultural and architectural exchange. Malmö and Copenhagen, once separate entities, became parts of a larger metropolitan region. Ideas, talent, and design philosophies began to flow freely across the strait.",
      },
      {
        type: "figure",
        image: malmo11,
        alt: "Waterfront architecture",
        caption: "Connected cities, shared architectural vision",
        aspect: "16/9",
      },
      {
        type: "p",
        text: "This cross-pollination is visible in Malmö's commitment to sustainable urban planning, bicycle infrastructure, and mixed-use development—principles long championed in Copenhagen. But Malmö hasn't simply copied its neighbor; it has synthesized Danish urbanism with Swedish design sensibilities, creating something distinctly its own.",
      },
      { type: "h2", text: "Capturing the Ephemeral: Sky, Color, and Mood" },
      {
        type: "p",
        text: "One of the greatest challenges—and joys—of photographing architecture in Malmö is the sky. The Nordic climate creates atmospheric conditions that are constantly in flux. One moment, heavy clouds cast everything in cool grays; the next, breaks in the cloud cover create dramatic spotlighting effects.",
      },
      {
        type: "figure",
        image: malmo13,
        alt: "Building with dramatic sky gradient",
        caption: "Golden hour transforms glass into liquid amber",
        aspect: "3/4",
      },
      {
        type: "p",
        text: "I've learned to chase these moments obsessively. The gradient sunsets that paint glass facades in shades of pink and orange. The blue hour, when artificial lights begin to glow against a deepening indigo sky. These are the times when architecture transcends its function and becomes pure visual poetry.",
      },
      {
        type: "figure",
        image: malmo16,
        alt: "Another striking sky and building composition",
        caption: "The Nordic sky provides an ever-changing backdrop",
        aspect: "16/9",
      },
      {
        type: "pullquote",
        variant: "indented",
        text: "I don't photograph buildings—I photograph the dialogue between human ambition and natural light.",
        attribution: "Marcus Lindström",
      },
      { type: "h2", text: "Human Scale in Monumental Vision" },
      {
        type: "p",
        text: "For all its architectural ambition, Malmö has largely avoided the pitfall of monumentalism at the expense of livability. Many of the new developments incorporate ground-level retail, accessible public spaces, and careful attention to pedestrian flow. The result is architecture that feels approachable despite its scale.",
      },
      {
        type: "figure",
        image: malmo17,
        alt: "Street-level architectural perspective",
        caption: "Monumental architecture, human proportions",
        aspect: "16/9",
      },
      {
        type: "p",
        text: "This commitment to human scale extends to material choices and environmental consciousness. Green roofs, renewable energy integration, and passive heating systems aren't hidden technical features—they're integral to the architectural expression itself. Sustainability here is not compromise; it's an aesthetic principle.",
      },
      {
        type: "p",
        text: "As I continue to document Malmö's transformation, I'm struck by how much remains unwritten. This city is still in the midst of becoming. New towers rise each year, neighborhoods evolve, and the architectural conversation between past and future continues.",
      },
      {
        type: "p",
        text: "Photography allows me to freeze these transitional moments—to capture a city in flux, to preserve the ephemeral interactions of light and form. Each image is a chapter in an ongoing story, a testament to what happens when a city dares to reimagine itself, one building at a time.",
      },
    ],
  },

  {
    slug: "geometric-minimalism-nordic",
    title: "Geometric Minimalism in Nordic Architecture",
    description:
      "How Scandinavian design principles produce buildings that breathe—an exploration of function, form, and the negative space that holds them together.",
    category: "Architecture",
    hero: malmo04,
    heroAlt: "Minimalist Nordic facade",
    cardImage: malmo04,
    author: MARCUS,
    datePublished: "2025-02-04",
    readableDate: "February 4, 2025",
    readingTimeMinutes: 5,
    body: [
      {
        type: "p",
        text: "Nordic architecture has spent the last fifty years quietly arguing that less is, in fact, more—and that the argument is best made in concrete, glass, and weathered timber. The case is not theoretical. You can read it in the way a Helsinki apartment block lets snow drift across its concrete face without flinching, or in how a Stockholm pavilion frames a single birch tree like a museum object.",
      },
      {
        type: "h2",
        text: "Function, Form, and the Space Between",
      },
      {
        type: "p",
        text: "The Scandinavian tradition is sometimes mistaken for plainness. It is not. Buildings here are minimal because they are confident enough not to shout—and because the climate punishes ornamental excess that doesn't shed snow or trap heat. Every reveal, every cantilever, every recess is doing work.",
      },
      {
        type: "figure",
        image: malmo05,
        alt: "Cantilevered concrete volume",
        caption: "Mass and shadow stand in for ornament.",
        aspect: "16/9",
      },
      {
        type: "pullquote",
        variant: "indented",
        text: "Negative space is the most expensive material in Scandinavian architecture, and the one we spend most freely.",
        attribution: "Henrik Sundberg",
      },
      {
        type: "h2",
        text: "Material Honesty",
      },
      {
        type: "p",
        text: "Concrete looks like concrete. Pine looks like pine. Steel is allowed to age into a flat patina the color of January light. The honesty is partly cultural, partly practical: there is no climate here that forgives a finish pretending to be something it isn't. After one winter, the lie shows.",
      },
      {
        type: "p",
        text: "What remains, when ornament is stripped away, is the geometry itself: the precise depth of a window reveal, the way a roofline holds the horizon, the proportion of a single door to the wall it interrupts. Minimalism, properly practiced, is a discipline of attention rather than a denial of it.",
      },
      {
        type: "figure",
        image: malmo07,
        alt: "Sequenced facade with rhythmic openings",
        caption: "Rhythm without repetition: the Scandinavian sleight of hand.",
        aspect: "16/9",
      },
      {
        type: "p",
        text: "The buildings that have aged best in Helsinki, Aarhus, and Reykjavík share a quality that's hard to name and easy to feel. They neither announce themselves nor apologize. They simply hold their ground, weather their winters, and let the light do most of the talking.",
      },
    ],
  },

  {
    slug: "architectural-photography",
    title: "The Art of Architectural Photography",
    description:
      "Light, composition, and timing—the essential elements of capturing buildings as living subjects. Notes from a decade behind the camera.",
    category: "Photography",
    hero: storytelling,
    heroAlt: "Photographer framing a modern facade",
    cardImage: malmo02,
    author: MARCUS,
    datePublished: "2025-02-18",
    readableDate: "February 18, 2025",
    readingTimeMinutes: 6,
    body: [
      {
        type: "p",
        text: "A building is never the same twice. The same facade you photographed at noon will be a different sculpture at four in the afternoon, and a third one again at the blue hour. Architectural photography is less about documenting a structure than about catching it in a particular mood, on a particular day, under a particular sky.",
      },
      {
        type: "h2",
        text: "Waiting Is Half the Work",
      },
      {
        type: "p",
        text: "I once stood in front of the same concrete museum in Aarhus for three afternoons, waiting for the cloud cover to break in exactly the right place. When it finally did, the shot took less than a minute. That ratio—hours of waiting per second of shutter—is the part that doesn't show up in the final image, but it's where the work actually happens.",
      },
      {
        type: "figure",
        image: malmo08,
        alt: "Tripod set up at golden hour",
        caption: "The shot you remember is usually the one you waited for.",
        aspect: "16/9",
      },
      {
        type: "h2",
        text: "Composition: Letting the Building Lead",
      },
      {
        type: "p",
        text: "The discipline is to compose around what the architect intended, not around what your viewfinder finds convenient. If a building was designed with a long entry sequence, your photograph should respect that sequence. If it was built to be seen from below, don't flatten it into a postcard from across the street.",
      },
      {
        type: "pullquote",
        variant: "big",
        text: "You don't photograph a building. You photograph a relationship between a building, an hour, and a sky.",
        attribution: "Marcus Lindström",
      },
      {
        type: "h2",
        text: "Gear, and Why It Matters Less Than You Think",
      },
      {
        type: "p",
        text: "A shift lens is useful. So is a sturdy tripod and a remote release. None of these will save a poorly chosen hour or a lazy frame. The best architectural photograph I made last year was on a borrowed body with a kit zoom, in light that wouldn't last more than four minutes. Equipment is a permission slip, not a substitute for seeing.",
      },
      {
        type: "figure",
        image: malmo10,
        alt: "Detail of a glazed corner at dusk",
        caption: "Detail, at the right hour, becomes architecture.",
        aspect: "3/4",
      },
      {
        type: "p",
        text: "If there is one habit I would press on anyone starting out, it is this: walk the building before you raise the camera. Walk it slowly, the way an architect would walk a model. The frames will find themselves.",
      },
    ],
  },

  {
    slug: "sustainable-urban-design",
    title: "Sustainable Urban Design in Scandinavia",
    description:
      "From Copenhagen to Malmö, how Nordic cities are pioneering climate-conscious development without sacrificing aesthetic ambition.",
    category: "Sustainability",
    hero: sustainableDev,
    heroAlt: "Green roof on a contemporary Scandinavian building",
    cardImage: malmo12,
    author: HENRIK,
    datePublished: "2025-03-02",
    readableDate: "March 2, 2025",
    readingTimeMinutes: 7,
    body: [
      {
        type: "p",
        text: "Sustainability in Scandinavian cities is not a marketing department's idea. It is, increasingly, the only economically literate way to build. When heating, cooling, and stormwater management are taken seriously at the masterplan stage, the resulting neighborhoods cost less to operate and far less to retrofit. The aesthetic dividend is a side effect.",
      },
      {
        type: "h2",
        text: "The District as the Unit of Design",
      },
      {
        type: "p",
        text: "Copenhagen's Nordhavn and Malmö's Västra Hamnen are not collections of green buildings. They are green districts: shared heating loops, shared bicycle infrastructure, shared stormwater strategies, and shared building-form rules that ensure no one tower steals daylight from its neighbors. The lesson is structural—single-building sustainability ratings will never substitute for coordinated planning.",
      },
      {
        type: "figure",
        image: malmo06,
        alt: "Mixed-use waterfront district",
        caption: "When the district is the unit of design, the buildings get easier.",
        aspect: "16/9",
      },
      {
        type: "pullquote",
        variant: "indented",
        text: "A green building inside a car-dependent district is a rounding error.",
        attribution: "Henrik Sundberg",
      },
      {
        type: "h2",
        text: "Cycling Isn't a Lifestyle, It's Infrastructure",
      },
      {
        type: "p",
        text: "Roughly half of Copenhagen's commuting trips happen by bicycle. This is not because Danes are unusually fit, or unusually patient with rain; it is because the infrastructure makes cycling the obvious choice. Bike lanes are continuous, plowed first in winter, and prioritized at intersections. When the easy choice is the climate-friendly one, the climate-friendly one wins.",
      },
      {
        type: "figure",
        image: malmo09,
        alt: "Cycle lane along a residential canal",
        caption: "Infrastructure decides behavior. Behavior decides emissions.",
        aspect: "16/9",
      },
      {
        type: "h2",
        text: "Materials, Embodied Carbon, and the Long View",
      },
      {
        type: "p",
        text: "The next frontier is embodied carbon—the emissions baked into a building's materials before anyone flips a light switch. The most interesting Scandinavian projects of the last few years have been the ones that treated structural timber, low-clinker concrete, and reused steel not as virtue signals but as cost-competitive defaults.",
      },
      {
        type: "p",
        text: "The encouraging news is that the aesthetic does not have to suffer. Mass timber towers in Skellefteå and Brumunddal are not visibly straining to be sustainable; they are simply, quietly, very fine buildings that happen to store carbon instead of emitting it.",
      },
      {
        type: "figure",
        image: malmo14Placeholder(),
        alt: "Mass timber stair core",
        caption: "When carbon storage is the structure, the structure can be the finish.",
        aspect: "3/4",
      },
    ],
  },

  {
    slug: "glass-box-living",
    title: "Glass Box Living: Transparency and Its Limits",
    description:
      "Transparent walls promise dissolution of the boundary between indoors and out. They also, on the wrong day, promise a sauna. A field report.",
    category: "Interiors",
    hero: blog5,
    heroAlt: "Glass-walled living room with garden view",
    cardImage: blog5,
    author: SOFIA,
    datePublished: "2025-03-19",
    readableDate: "March 19, 2025",
    readingTimeMinutes: 4,
    body: [
      {
        type: "p",
        text: "The glass box has been an aspiration of modern domestic architecture since at least Mies van der Rohe's Farnsworth House in 1951. Three-quarters of a century later, the dream has gone mainstream: floor-to-ceiling glazing now appears in suburban renovations the way carpet once did. What hasn't gone mainstream, yet, is the discipline required to make it actually pleasant to live in.",
      },
      {
        type: "h2",
        text: "The Promise",
      },
      {
        type: "p",
        text: "When it works, full-height glazing makes a small house feel large and a large house feel infinite. The interior borrows the colors of the garden, the sound of rain, the slow shift of the day. A glass box at four in the afternoon in October, with the trees turning, can do more for a room than any wallpaper ever did.",
      },
      {
        type: "figure",
        image: blog3,
        alt: "Living room dissolving into a forest backdrop",
        caption: "On the right day, the wall disappears.",
        aspect: "16/9",
      },
      {
        type: "h2",
        text: "The Reality",
      },
      {
        type: "p",
        text: "On the wrong day, the same room is a greenhouse. Solar gain, glare, privacy from the street, and the acoustic deadness of large flat panels are real problems that don't solve themselves. The houses that succeed treat glazing the way a chef treats salt: deliberate, restrained, deployed where it earns its place.",
      },
      {
        type: "pullquote",
        variant: "indented",
        text: "A glass wall is a relationship with a view. If the view isn't worth a relationship, build a wall.",
      },
      {
        type: "p",
        text: "Deep overhangs, exterior shading, low-e coatings, and good ventilation are not concessions to comfort—they are what allow the architecture to keep its nerve. The Farnsworth House, for what it's worth, was famously difficult to live in. The glass boxes that are easier to live in are also, usually, the ones that admit they have edges.",
      },
    ],
  },

  {
    slug: "concrete-wood-harmony",
    title: "Concrete and Wood: A Material Conversation",
    description:
      "Two of architecture's most demanding materials, placed side by side. Why the pairing keeps recurring, and what it asks of the people detailing it.",
    category: "Architecture",
    hero: blog6,
    heroAlt: "Concrete wall meeting timber soffit",
    cardImage: blog6,
    author: EMMA,
    datePublished: "2025-04-08",
    readableDate: "April 8, 2025",
    readingTimeMinutes: 5,
    body: [
      {
        type: "p",
        text: "Few pairings have been more thoroughly photographed in the past decade than fair-faced concrete against warm timber. The reasons are not mysterious: the materials are honest about themselves, age in opposite directions, and demand competence from the people detailing them. When the detailing fails, both materials make the failure visible.",
      },
      {
        type: "h2",
        text: "Why It Works",
      },
      {
        type: "p",
        text: "Concrete is dense, cool, dimensionally stable, slow to age. Timber is light, warm, dimensionally restless, quick to silver. Each amplifies what the other isn't. The eye reads the contrast as a kind of conversation: this wall is permanent, this beam is alive. A room with both reads richer than a room with either alone.",
      },
      {
        type: "figure",
        image: blog4,
        alt: "Board-formed concrete next to oak cladding",
        caption: "Board-formed concrete keeps the timber's grain in the conversation.",
        aspect: "16/9",
      },
      {
        type: "h2",
        text: "Why It Goes Wrong",
      },
      {
        type: "p",
        text: "The pairing is unforgiving. Concrete that wasn't formwork-planned will read as a parking garage. Timber that wasn't moisture-detailed will twist, cup, or rot. The two materials expand and contract on different schedules, so a joint that ignores that fact will open over its first three winters. The successful projects budget for the detailing twice—once at design, once at the mockup.",
      },
      {
        type: "pullquote",
        variant: "big",
        text: "Concrete is set in the first hour. Timber answers back over the next thirty years.",
        attribution: "Emma Thompson",
      },
      {
        type: "p",
        text: "When both materials are given room to do their work, the result feels less like a design choice and more like an inevitability. You don't notice the pairing. You notice the room.",
      },
    ],
  },

  {
    slug: "rooftop-gardens",
    title: "Rooftop Gardens: Architecture That Eats Carbon",
    description:
      "Once a curiosity, now a baseline. How green roofs moved from boutique amenity to standard climate strategy—and what's still missing.",
    category: "Sustainability",
    hero: blog1,
    heroAlt: "Rooftop meadow above a contemporary apartment block",
    cardImage: blog1,
    author: HENRIK,
    datePublished: "2025-04-22",
    readableDate: "April 22, 2025",
    readingTimeMinutes: 5,
    body: [
      {
        type: "p",
        text: "A green roof, twenty years ago, was a feature you bragged about. A green roof today is a feature you explain away if you don't have one. The shift has been gradual enough that it's easy to miss, but the numbers are unambiguous: in cities with serious heat-island problems, the cumulative effect of pervasive rooftop vegetation is no longer a rounding error.",
      },
      {
        type: "h2",
        text: "What a Green Roof Actually Does",
      },
      {
        type: "p",
        text: "It absorbs stormwater that would otherwise overwhelm combined sewers in a heavy rain. It buffers the heat of summer, reducing the cooling load on the floors below. It extends the lifespan of the roof membrane by an order of magnitude by shielding it from UV. It sequesters a small but real amount of carbon. And, when properly planted, it provides habitat for pollinators in a city that has otherwise paved over their food supply.",
      },
      {
        type: "figure",
        image: blog9,
        alt: "Sedum mat installed over a flat membrane",
        caption: "Sedum mats: the entry-level green roof, and still the most common.",
        aspect: "16/9",
      },
      {
        type: "h2",
        text: "What's Still Missing",
      },
      {
        type: "p",
        text: "The unfinished business is access. Most rooftop gardens are still purely technical installations, fenced off and visited only by the maintenance crew. The next generation of rooftop work—visible already in Hamburg, Singapore, and parts of Copenhagen—treats the roof as the building's most underused floor: a public room with a view, a quiet park above the traffic.",
      },
      {
        type: "pullquote",
        variant: "indented",
        text: "The cheapest park a city can build is the one already on top of its buildings.",
        attribution: "Henrik Sundberg",
      },
      {
        type: "p",
        text: "The economics, for once, are friendly. Structural upgrades to support a usable roof are small relative to the floor area unlocked. The hard part is regulatory: building codes that treat the roof as a hazard rather than a room. That, more than the engineering, is where the next decade of progress will be won.",
      },
    ],
  },

  {
    slug: "light-shadow-design",
    title: "Light and Shadow in Design",
    description:
      "How natural light transforms architectural spaces hour by hour—and why the best buildings are detailed for the light they were never going to get.",
    category: "Interiors",
    hero: designSystems,
    heroAlt: "Sunlight crossing a minimalist interior",
    cardImage: blog3,
    author: SOFIA,
    datePublished: "2025-05-06",
    readableDate: "May 6, 2025",
    readingTimeMinutes: 5,
    body: [
      {
        type: "p",
        text: "An interior is detailed twice. Once for the bright noon it was rendered in, and again for the long, low, complicated hours that make up most of the year. Designers who only get the first detailing right produce rooms that photograph well and live badly.",
      },
      {
        type: "h2",
        text: "The Hours You Forget to Design For",
      },
      {
        type: "p",
        text: "Most rooms work at midday in June. The hard cases are November at three in the afternoon, when the sun has barely cleared the neighbor's gable, and February at ten in the morning, when the light is bright but flat and cold. A room that's still good at those hours is doing real work.",
      },
      {
        type: "figure",
        image: malmo18,
        alt: "Raking afternoon light across a wood floor",
        caption: "The light you remember is rarely the brightest light.",
        aspect: "16/9",
      },
      {
        type: "pullquote",
        variant: "big",
        text: "Shadow is a material. The buildings that age best know how to spend it.",
      },
      {
        type: "h2",
        text: "Detailing for Shadow",
      },
      {
        type: "p",
        text: "Deep window reveals, layered ceiling planes, contrasting matte and satin finishes, and the careful placement of single dark elements in a pale room all do the same job: they give shadow a structure. A room without that structure feels flat at any hour. A room with it can be lit by a single low lamp at 5pm and still feel intentional.",
      },
      {
        type: "p",
        text: "The point isn't to over-design. It's to acknowledge that the building is a clock, and that the most generous thing it can do for the people inside is to tell good time.",
      },
    ],
  },

  {
    slug: "urban-residential-architecture",
    title: "Urban Residential Architecture: Density Without Cruelty",
    description:
      "The next decade of housing won't be argued at the scale of the single building. It will be argued at the scale of the block.",
    category: "Urbanism",
    hero: workspaceCover,
    heroAlt: "Mid-rise residential block on a quiet European street",
    cardImage: blog4,
    author: JAMES,
    datePublished: "2025-05-20",
    readableDate: "May 20, 2025",
    readingTimeMinutes: 6,
    body: [
      {
        type: "p",
        text: "The dominant debate in urban housing this decade is not whether to build more, but how. Single-family zoning is on the retreat in dozens of cities that finally read their own demographic projections. What replaces it is the open question—and the answer, increasingly, is not the slim luxury tower. It is the mid-rise block.",
      },
      {
        type: "h2",
        text: "The Geometry of Density",
      },
      {
        type: "p",
        text: "A six- or seven-story perimeter block, courtyards in the middle, ground-floor retail facing the street, is one of the most productive shapes architecture has ever invented. It is dense enough to support real transit, low enough to avoid the social problems of high-rise housing, and old enough to have a track record that runs across three continents.",
      },
      {
        type: "figure",
        image: blog2,
        alt: "Courtyard of a perimeter block at dusk",
        caption: "The mid-rise perimeter block: old technology, new urgency.",
        aspect: "16/9",
      },
      {
        type: "h2",
        text: "What Density Owes the People In It",
      },
      {
        type: "p",
        text: "Density without daylight is cruelty in plan view. Density without quiet is cruelty in section. The successful blocks of the last decade—in Vienna, Hamburg, Amsterdam—respect both. Apartments are cross-ventilated. Courtyards are deep enough to land sunlight. The acoustic separation between neighbors is detailed at the structural stage, not retrofitted as an apology.",
      },
      {
        type: "pullquote",
        variant: "indented",
        text: "Density is not the same thing as crowding. The difference is design.",
        attribution: "James Wilson",
      },
      {
        type: "p",
        text: "Where this is done well, the result is not a project but a neighborhood: streets that feel held without feeling hemmed in, courtyards full of children in summer and snow in winter, and apartments that are small but never mean. None of this is new. Most of it has been in the textbook since the 1880s. What's new is that we appear, finally, to be willing to do it again.",
      },
    ],
  },
];

/* ----------------------------------------------------------------------- */
/* Helpers                                                                  */
/* ----------------------------------------------------------------------- */

/**
 * Helper used inside the Sustainability article body to fall back gracefully
 * if `malmo-14.avif` is renamed or removed. We import lazily here (via a
 * separate function) so the catalog body doesn't blow up at module load if
 * a single asset is missing — the figure simply uses the closest sibling.
 */
function malmo14Placeholder(): string {
  // Re-uses malmo-19 as a stand-in until a dedicated photo lands. The visual
  // language matches and the alt text still tells the reader what they're
  // looking at.
  return malmo19;
}

const SLUG_INDEX: Map<string, Article> = new Map(
  ARTICLES.map((a) => [a.slug, a]),
);

export function getArticleBySlug(slug: string | undefined): Article | undefined {
  if (!slug) return undefined;
  return SLUG_INDEX.get(slug);
}

/** Most-recent article. Drives the homepage "Featured" hero. */
export function getFeaturedArticle(): Article {
  return [...ARTICLES].sort((a, b) =>
    b.datePublished.localeCompare(a.datePublished),
  )[0];
}

/**
 * Returns the next N most recent articles, excluding any slugs in
 * `exclude`. Used for the homepage carousel and "more articles" feed.
 */
export function getRecentArticles(
  count: number,
  exclude: string[] = [],
): Article[] {
  return [...ARTICLES]
    .filter((a) => !exclude.includes(a.slug))
    .sort((a, b) => b.datePublished.localeCompare(a.datePublished))
    .slice(0, count);
}

/** All articles, most-recent first. Used by the "more articles" feed. */
export function getAllArticlesNewestFirst(): Article[] {
  return [...ARTICLES].sort((a, b) =>
    b.datePublished.localeCompare(a.datePublished),
  );
}

/**
 * Up to 3 related articles for the given slug. Prefers same-category, falls
 * back to most-recent. Always excludes the article itself.
 */
export function getRelatedArticles(slug: string, limit = 3): Article[] {
  const current = getArticleBySlug(slug);
  if (!current) {
    return getRecentArticles(limit);
  }
  const sameCategory = ARTICLES.filter(
    (a) => a.slug !== slug && a.category === current.category,
  ).sort((a, b) => b.datePublished.localeCompare(a.datePublished));

  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);

  const filler = ARTICLES.filter(
    (a) => a.slug !== slug && !sameCategory.some((s) => s.slug === a.slug),
  ).sort((a, b) => b.datePublished.localeCompare(a.datePublished));

  return [...sameCategory, ...filler].slice(0, limit);
}

/**
 * Stable opinion-row selection for the homepage. The original Blog page had
 * a hand-curated row of four "Opinions" cards with author + title — we keep
 * that affordance but anchor each entry to a real article (so clicking
 * actually goes somewhere meaningful).
 */
export function getOpinionRow(): Array<{
  slug: string;
  title: string;
  author: ArticleAuthor;
}> {
  const picks = [
    "geometric-minimalism-nordic",
    "light-shadow-design",
    "urban-residential-architecture",
    "concrete-wood-harmony",
  ];
  return picks
    .map((slug) => SLUG_INDEX.get(slug))
    .filter((a): a is Article => Boolean(a))
    .map((a) => ({ slug: a.slug, title: a.title, author: a.author }));
}

/** Used by sitemap helpers / structured data. */
export function getAllSlugs(): string[] {
  return ARTICLES.map((a) => a.slug);
}
