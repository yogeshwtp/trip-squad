import { Destination } from '../types/models';

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org/search';

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'TripPlannerApp/1.0 (contact: example@example.com)'
    },
  });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function searchDestinations(query: string, limit: number = 8): Promise<Destination[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const url = `${NOMINATIM_BASE}?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=${limit}&accept-language=en&featuretype=city&extratags=1`; 
  type NominatimItem = {
    place_id: number;
    osm_id: number;
    display_name: string;
    lat: string;
    lon: string;
    type: string;
    class: string;
    address?: {
      city?: string;
      town?: string;
      village?: string;
      state?: string;
      county?: string;
      country?: string;
      country_code?: string;
    };
  };

  const results = await fetchJson<NominatimItem[]>(url);

  const mapped: Destination[] = results
    .filter((r) => ['city', 'town', 'village', 'administrative'].includes(r.type))
    .map((r) => {
      const name = r.address?.city || r.address?.town || r.address?.village || r.display_name.split(',')[0];
      const country = r.address?.country;
      const type: 'city' | 'region' = r.type === 'administrative' ? 'region' : 'city';
      return {
        id: String(r.place_id),
        name,
        country,
        countryCode: r.address?.country_code?.toUpperCase(),
        latitude: parseFloat(r.lat),
        longitude: parseFloat(r.lon),
        type,
      } as Destination;
    });

  // Attach images sequentially to avoid hammering APIs
  const withImages: Destination[] = [];
  for (const d of mapped) {
    try {
      const imageUrl = await getDestinationImage(d.name);
      withImages.push({ ...d, imageUrl });
    } catch {
      withImages.push(d);
    }
  }
  return withImages;
}

export async function getDestinationImage(name: string): Promise<string | undefined> {
  // Use Wikimedia Action API with CORS enabled via origin=*
  // 1) Find the best page title via opensearch
  const searchUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(
    name
  )}&limit=1&namespace=0&format=json&origin=*`;
  try {
    const search = await fetchJson<any>(searchUrl);
    const bestTitle: string | undefined = search?.[1]?.[0];
    const title = bestTitle || name;
    // 2) Fetch page image thumbnail
    const pageImageUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
      title
    )}&prop=pageimages&pithumbsize=600&format=json&origin=*`;
    const pageData = await fetchJson<{ query?: { pages?: Record<string, any> } }>(pageImageUrl);
    const pages = pageData.query?.pages || {};
    const firstPage = Object.values(pages)[0] as any;
    const thumb: string | undefined = firstPage?.thumbnail?.source;
    if (thumb) return thumb;
    // 3) Fallback: generator search (some titles don't expose pageimages directly)
    const genUrl = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
      name + ' city'
    )}&gsrlimit=5&prop=pageimages&piprop=thumbnail&pithumbsize=600&format=json&origin=*`;
    const genData = await fetchJson<{ query?: { pages?: Record<string, any> } }>(genUrl);
    const genPages = genData.query?.pages || {};
    const found = Object.values(genPages).find((p: any) => p?.thumbnail?.source) as any;
    return found?.thumbnail?.source;
  } catch {
    return undefined;
  }
}

export async function getPlaceSummary(name: string): Promise<{ title: string; summary?: string; imageUrl?: string } | undefined> {
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(name)}&limit=1&namespace=0&format=json&origin=*`;
    const search = await fetchJson<any>(searchUrl);
    const bestTitle: string | undefined = search?.[1]?.[0] || name;
    const pageUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(bestTitle)}&prop=pageimages|extracts&pithumbsize=800&exintro=1&explaintext=1&format=json&origin=*`;
    const pageData = await fetchJson<{ query?: { pages?: Record<string, any> } }>(pageUrl);
    const pages = pageData.query?.pages || {};
    const firstPage = Object.values(pages)[0] as any;
    return { title: bestTitle, summary: firstPage?.extract, imageUrl: firstPage?.thumbnail?.source };
  } catch {
    return undefined;
  }
}

export type Sight = { id: number; title: string; distance: number; lat: number; lon: number; imageUrl?: string };

export async function getNearbySights(lat: number, lon: number, radiusMeters: number = 8000, limit: number = 8): Promise<Sight[]> {
  try {
    const geoUrl = `https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${lat}%7C${lon}&gsradius=${radiusMeters}&gslimit=${limit}&format=json&origin=*`;
    const geo = await fetchJson<{ query?: { geosearch?: any[] } }>(geoUrl);
    const items = geo.query?.geosearch || [];
    if (items.length === 0) return [];
    const pageIds = items.map((i) => i.pageid).join('|');
    const pagesUrl = `https://en.wikipedia.org/w/api.php?action=query&pageids=${pageIds}&prop=pageimages|extracts&pithumbsize=300&exintro=1&explaintext=1&format=json&origin=*`;
    const pagesData = await fetchJson<{ query?: { pages?: Record<string, any> } }>(pagesUrl);
    const pages = pagesData.query?.pages || {};
    const results: Sight[] = items.map((i) => {
      const page = pages[String(i.pageid)] as any;
      return {
        id: i.pageid,
        title: i.title,
        distance: i.dist,
        lat: i.lat,
        lon: i.lon,
        imageUrl: page?.thumbnail?.source,
      };
    });
    return results;
  } catch {
    return [];
  }
}

export type BudgetInput = {
  days: number;
  people: number;
};

export type BudgetEstimate = {
  perPerson: number;
  total: number;
  breakdown: {
    accommodation: number;
    food: number;
    localTransport: number;
    activities: number;
  };
};

export function estimateStudentBudget({ days, people }: BudgetInput): BudgetEstimate {
  const perDayAccommodation = 600; // INR
  const perDayFood = 400; // INR
  const perDayLocalTransport = 200; // INR
  const perDayActivities = 300; // INR (light activities)

  const basePerDay = perDayAccommodation + perDayFood + perDayLocalTransport + perDayActivities; // 1500

  let perPerson = basePerDay * days;

  if (people >= 4) {
    const accommodationShare = perDayAccommodation * days;
    const discount = accommodationShare * 0.1; // 10% group savings on accommodation
    perPerson -= discount;
  }

  const total = perPerson * people;

  return {
    perPerson,
    total,
    breakdown: {
      accommodation: perDayAccommodation * days * (people >= 4 ? 0.9 : 1),
      food: perDayFood * days,
      localTransport: perDayLocalTransport * days,
      activities: perDayActivities * days,
    },
  };
}


