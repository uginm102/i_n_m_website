// import "server-only";
import qs from "qs";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;
const DEFAULT_REVALIDATE_SECONDS = 300;

interface FetchOptions {
  populate?: string | string[] | object;
  filters?: object;
  fields?: string[];
  locale?: string;
  cache?: "force-cache" | "no-store";
  revalidate?: number;
  tags?: string[];
}

export type Header = {
  logo?: {
    url?: string;
  };
};

export type Link = {
  label: string;
  slug: string;
  iconClass?: string;
  url?: string;
};

export type Guide = {
  url: string;
  iconClass?: string;
  tag?: string;
  title: string;
  description?: string;
};

export type SupportPage = {
  header?: Header;
  hero: {
    title: string;
    searchPlaceholder: string;
    searchButtonText: string;
  };
  links: Link[];
  guidesTitle?: string;
  guides: Guide[];
  popularArticles: Link[],
  footer?: {
    content?: string;
  };
};

export type SupportPageShell = Pick<SupportPage, "header" | "footer">;


export type ServiceCategory = {
  title: string;
  slug: string;
  service?: Array<{
    id?: number;
    title?: string;
    description?: string;
    iconClass?: string;
    services?: Link[];
  }>;
};

export type GuideStep = {
  order?: number;
  title: string;
  description: string;
  screenshot?: {
    url: string;
    alternativeText?: string;
  };
};

export type ServiceGuide = {
  title: string;
  description?: string;
  slug: string;
  info?: string;
  steps?: GuideStep[];
};

export type SearchResult = {
  title: string;
  description?: string;
  categorySlug: string;
  categoryTitle: string;
  slug: string;
};

export type Locale = {
  code: string;
  name: string;
  isDefault?: boolean;
};

/** Makes a cached, authenticated request to the Strapi REST API. */
async function fetchStrapi<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T | null> {
  if (!STRAPI_URL) {
    console.error("NEXT_PUBLIC_STRAPI_API_URL is not configured.");
    return null;
  }

  try {
    const baseUrl = STRAPI_URL.endsWith("/") ? STRAPI_URL : `${STRAPI_URL}/`;
    const url = new URL(`api/${endpoint}`, baseUrl);
    const queryParams: Record<string, string | string[] | object> = {};

    if (options.populate) queryParams.populate = options.populate;
    if (options.filters) queryParams.filters = options.filters;
    if (options.fields) queryParams.fields = options.fields;
    if (options.locale) queryParams.locale = options.locale;

    const queryString = qs.stringify(queryParams, { encodeValuesOnly: true });
    if (queryString) url.search = queryString;
    console.log(`Fetching Strapi endpoint: ${url.toString()}`); // Debugging line to check the URL

    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (STRAPI_TOKEN) headers.Authorization = `Bearer ${STRAPI_TOKEN}`;

    const response = await fetch(url.toString(), {
      method: "GET",
      headers,
      cache: options.cache ?? "force-cache",
      next:
        options.cache === "no-store"
          ? undefined
          : {
            revalidate: options.revalidate ?? DEFAULT_REVALIDATE_SECONDS,
            tags: options.tags ?? [`strapi:${endpoint}`],
          },
    });

    if (!response.ok) {
      throw new Error(`Strapi returned HTTP ${response.status}`);
    }

    const json = (await response.json()) as { data?: T };
    return json.data ?? null;
  } catch (error) {
    console.error(`Failed to fetch Strapi endpoint "${endpoint}".`, error);
    return null;
  }
}

export async function fetchSingleType<T>(
  uid: string,
  options: FetchOptions = {}
): Promise<T | null> {
  return fetchStrapi<T>(uid, options);
}

export function getSupportPageShell(locale: string) {
  return fetchSingleType<SupportPageShell>("support-page", {
    populate: {
      header: { populate: { logo: true } },
      footer: "*",
    },
    locale,
  });
}

export async function getServiceBySlug(
  slug: string,
  locale = "en"
): Promise<ServiceCategory | null> {
  const data = await fetchStrapi<ServiceCategory[]>("services", {
    filters: { slug: { $eq: slug } },
    fields: ["title", "slug"],
    populate: {
      service: {
        fields: ["title", "description", "iconClass"],
        populate: { services: { fields: ["label", "slug", "url"] } },
      },
    },
    locale,
  });

  return data?.[0] ?? null;
}

export async function getServiceGuideBySlug(
  slug: string,
  locale = "en"
): Promise<ServiceGuide | null> {
  const data = await fetchStrapi<ServiceGuide[]>("service-guides", {
    filters: { slug: { $eq: slug } },
    fields: ["title", "description", "info", "slug"],
    populate: { steps: { populate: { screenshot: true } } },
    locale,
  });

  return data?.[0] ?? null;
}

type SearchCategory = Pick<ServiceCategory, "title" | "slug"> & {
  service?: Array<{
    title?: string;
    description?: string;
    services?: Link[];
  }>;
};

type SearchGuide = Pick<ServiceGuide, "title" | "description" | "slug">;

/**
 * Builds a small, cached index from the CMS and filters it in memory. The same
 * index serves every query for a locale until it is revalidated.
 */
export async function searchHelpArticles(
  query: string,
  locale = "en"
): Promise<SearchResult[]> {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) return [];

  const [categories, guides] = await Promise.all([
    fetchStrapi<SearchCategory[]>("services", {
      fields: ["title", "slug"],
      populate: {
        service: {
          fields: ["title", "description"],
          populate: { services: { fields: ["label", "slug"] } },
        },
      },
      locale,
    }),
    fetchStrapi<SearchGuide[]>("service-guides", {
      fields: ["title", "description", "slug"],
      locale,
    }),
  ]);

  console.log("Fetched categories:", categories);
  console.log("Fetched guides:", guides);

  const guidesBySlug = new Map(guides?.map((guide) => [guide.slug, guide]));
  const results = new Map<string, SearchResult>();

  for (const category of categories ?? []) {
    for (const topic of category.service ?? []) {
      for (const link of topic.services ?? []) {
        if (!link.slug || results.has(link.slug)) continue;

        const guide = guidesBySlug.get(link.slug);
        const title = guide?.title || link.label;
        const description = guide?.description || topic.description;
        const searchableText = [title, description, link.label, topic.title, category.title]
          .filter(Boolean)
          .join(" ")
          .toLocaleLowerCase();

        if (searchableText.includes(normalizedQuery)) {
          results.set(link.slug, {
            title,
            description,
            categorySlug: category.slug,
            categoryTitle: category.title,
            slug: link.slug,
          });
        }
      }
    }
  }

  return [...results.values()]
    .sort((first, second) => first.title.localeCompare(second.title, locale))
    .slice(0, 50);
}

export async function getLocales(): Promise<Locale[]> {
  if (!STRAPI_URL) return [];

  try {
    const response = await fetch(`${STRAPI_URL}/api/i18n/locales`, {
      next: { revalidate: 3600, tags: ["strapi:locales"] },
    });

    if (!response.ok) return [];
    return (await response.json()) as Locale[];
  } catch {
    return [];
  }
}
