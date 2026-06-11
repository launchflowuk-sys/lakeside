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
  result?: { reviews?: GoogleReview[] };
}

let reviewCache: { reviews: GoogleReview[]; at: number } | null = null;
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

async function fetchFromGoogle(): Promise<GoogleReview[]> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!key || !placeId) return [];

  const url =
    `https://maps.googleapis.com/maps/api/place/details/json` +
    `?place_id=${encodeURIComponent(placeId)}` +
    `&fields=reviews` +
    `&reviews_sort=newest` +
    `&key=${key}`;

  const res = await fetch(url);
  const data = (await res.json()) as PlacesApiResponse;

  if (data.status !== "OK") return [];
  return data.result?.reviews ?? [];
}

router.get("/reviews", async (req, res) => {
  if (reviewCache && Date.now() - reviewCache.at < CACHE_TTL) {
    return res.json({ reviews: reviewCache.reviews, cached: true });
  }

  try {
    const reviews = await fetchFromGoogle();
    reviewCache = { reviews, at: Date.now() };
    res.json({ reviews, cached: false });
  } catch {
    req.log.error("Failed to fetch Google reviews");
    res.json({ reviews: reviewCache?.reviews ?? [], cached: false });
  }
});

export default router;
