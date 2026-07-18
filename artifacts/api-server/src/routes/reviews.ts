import { Router, type IRouter } from "express";

const router: IRouter = Router();

interface GoogleReview {
  author_name: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
}

interface PlacesApiResponse {
  status: string;
  result?: { reviews?: GoogleReview[]; rating?: number; user_ratings_total?: number };
}

interface ReviewCacheEntry {
  reviews: GoogleReview[];
  rating?: number;
  userRatingsTotal?: number;
  at: number;
}

let reviewCache: ReviewCacheEntry | null = null;
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

async function fetchFromGoogle(): Promise<Omit<ReviewCacheEntry, "at">> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!key || !placeId) return { reviews: [] };

  const url =
    `https://maps.googleapis.com/maps/api/place/details/json` +
    `?place_id=${encodeURIComponent(placeId)}` +
    `&fields=reviews,rating,user_ratings_total` +
    `&reviews_sort=newest` +
    `&key=${key}`;

  const res = await fetch(url);
  const data = (await res.json()) as PlacesApiResponse;

  if (data.status !== "OK") return { reviews: [] };
  return {
    reviews: data.result?.reviews ?? [],
    rating: data.result?.rating,
    userRatingsTotal: data.result?.user_ratings_total,
  };
}

router.get("/reviews", async (req, res) => {
  if (reviewCache && Date.now() - reviewCache.at < CACHE_TTL) {
    const { reviews, rating, userRatingsTotal } = reviewCache;
    res.json({ reviews, rating, userRatingsTotal, cached: true });
    return;
  }

  try {
    const fetched = await fetchFromGoogle();
    reviewCache = { ...fetched, at: Date.now() };
    res.json({ ...fetched, cached: false });
  } catch {
    req.log.error("Failed to fetch Google reviews");
    res.json({ reviews: reviewCache?.reviews ?? [], rating: reviewCache?.rating, userRatingsTotal: reviewCache?.userRatingsTotal, cached: false });
  }
});

export default router;
