// @/lib/strapi.ts
import qs from 'qs';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

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
    const url = new URL(`${STRAPI_URL}/api/${endpoint}`);
    
    // 1. Gather our query parameters into a single object
    const queryParams: Record<string, any> = {};
    if (options.populate) queryParams.populate = options.populate;
    if (options.filters) queryParams.filters = options.filters;
    if (options.fields) queryParams.fields = options.fields;
    if (options.locale) queryParams.locale = options.locale;

    // 2. Use qs to build a clean, nested query string
    const queryString = qs.stringify(queryParams, { encodeValuesOnly: true });
    if (queryString) {
      url.search = queryString;
    }

    console.log(`queryString: ${queryString}`);

    // Standard headers for Strapi API authentication
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (STRAPI_TOKEN) {
      headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`;
    }

    console.log(`Fetching Strapi endpoint: ${url.toString()}`);

    // Configure Next.js-specific fetch parameters (Caching & Revalidation)
    const fetchOptions: RequestInit = {
      method: 'GET',
      headers,
      next: {
        revalidate: options.revalidate !== undefined ? options.revalidate : 60,
      },
    };

    if (options.cache) {
      fetchOptions.cache = options.cache;
      delete fetchOptions.next;
    }

    const response = await fetch(url.toString(), fetchOptions);

    if (!response.ok) {
      throw new Error(`Strapi HTTP error! status: ${response.status}`);
    }

    const json = await response.json();
    
    return json.data;
  } catch (error) {
    console.error(`Failed to fetch from Strapi endpoint "${endpoint}":`, error);
    return null;
  }
}

/**
 * Specifically fetches a Single Type (like your Support Page)
 */
export async function fetchSingleType(uid: string, options: FetchOptions = {}) {
  const data = await fetchStrapi(uid, options);
  
  if (!data) return null;

  return data;
}