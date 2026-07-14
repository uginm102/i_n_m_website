// @/lib/strapi.ts

// 1. Get your Strapi URL from environment variables
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://127.0.0.1:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN; // Create this read-only token in Strapi Settings -> API Tokens

interface FetchOptions {
  populate?: string | string[] | object;
  filters?: object;
  fields?: string[];
  locale?: string;
  cache?: 'force-cache' | 'no-store';
  revalidate?: number;
}

/**
 * Core helper function to make requests to the Strapi REST API
 */
async function fetchStrapi(endpoint: string, options: FetchOptions = {}) {
  try {
    // We use Strapi's recommended qs library style or simple search params to build queries.
    // To keep this helper dependency-free, we construct the query URL.
    const url = new URL(`${STRAPI_URL}/api/${endpoint}`);

    // Standard headers for Strapi API authentication
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (STRAPI_TOKEN) {
      headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`;
    }

    // Handle dynamic population parameter (e.g., populate: ['hero', 'guides'])
    if (options.populate) {
      if (Array.isArray(options.populate)) {
        options.populate.forEach((value, index) => {
          url.searchParams.append(`populate[${index}]`, value);
        });
      } else if (typeof options.populate === 'string') {
        url.searchParams.append('populate', options.populate);
      }
    }

    // Handle optional localization parameter
    if (options.locale) {
      url.searchParams.append('locale', options.locale);
    }

    console.log(`Fetching Strapi endpoint: ${url.toString()}`);


    // Configure Next.js-specific fetch parameters (Caching & Revalidation)
    const fetchOptions: RequestInit = {
      method: 'GET',
      headers,
      next: {
        // Default to checking for updates every 60 seconds (Incremental Static Regeneration)
        revalidate: options.revalidate !== undefined ? options.revalidate : 60,
      },
    };

    if (options.cache) {
      fetchOptions.cache = options.cache;
      // If we force-cache or explicitly set no-store, remove next.revalidate to avoid conflicts
      delete fetchOptions.next;
    }

    const response = await fetch(url.toString(), fetchOptions);

    if (!response.ok) {
      throw new Error(`Strapi HTTP error! status: ${response.status}`);
    }

    const json = await response.json();
    
    // Strapi v4/v5 APIs wrap their main data payload inside a "data" property
    return json.data;
  } catch (error) {
    console.error(`Failed to fetch from Strapi endpoint "${endpoint}":`, error);
    return null;
  }
}

/**
 * Specifically fetches a Single Type (like your Support Page)
 * Since we skipped dynamic zones, we fetch the document directly by its content-type slug.
 */
export async function fetchSingleType(uid: string, options: FetchOptions = {}) {
  const data = await fetchStrapi(uid, options);
  
  if (!data) return null;

  // Strapi structures its single types within a "data" object. 
  // We flatten this slightly here so your page can access pageData.hero directly.
  return data;
}