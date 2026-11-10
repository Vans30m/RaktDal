import { Router } from "express";

const router = Router();

// In-memory cache to prevent repeated external network hits
const cache = new Map();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Fetch and extract unique location records from India Post API
 */
async function fetchPostOfficeData(url) {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const response = await fetch(url, {
    headers: { "User-Agent": "RaktDal-App" }
  });

  if (!response.ok) {
    throw new Error(`Postal API returned HTTP ${response.status}`);
  }

  const data = await response.json();
  const list = data?.[0]?.PostOffice || [];

  cache.set(url, { timestamp: Date.now(), data: list });
  return list;
}

/**
 * Calculate match score for ranking
 */
function calculateMatchScore(po, queryLower) {
  const name = (po.Name || "").toLowerCase().trim();
  const district = (po.District || "").toLowerCase().trim();
  const state = (po.State || "").toLowerCase().trim();

  // Exact matches get highest priority
  if (name === queryLower || district === queryLower) return 100;
  // Prefix matches (starts with what user typed)
  if (name.startsWith(queryLower)) return 85;
  if (district.startsWith(queryLower)) return 80;
  // Word boundary matches (e.g. "Sector 55, Chandigarh" when user types "Chandigarh")
  if (name.includes(` ${queryLower}`) || name.includes(`(${queryLower}`)) return 70;
  // Substring inside name or district
  if (name.includes(queryLower)) return 50;
  if (district.includes(queryLower)) return 45;
  if (state.includes(queryLower)) return 30;

  return 10;
}

/**
 * GET /api/v1/location/city/:city
 * Looks up postal records by city/post-office name and ranks matches
 */
router.get("/city/:city", async (req, res) => {
  try {
    const rawCity = req.params.city?.trim();
    if (!rawCity || rawCity.length < 2) {
      return res.status(400).json({ success: false, message: "City query must be at least 2 characters." });
    }

    const queryLower = rawCity.toLowerCase();
    const encoded = encodeURIComponent(rawCity);
    const list = await fetchPostOfficeData(`https://api.postalpincode.in/postoffice/${encoded}`);

    if (!list || list.length === 0) {
      return res.json({ success: true, data: [] });
    }

    // Sort by relevance to what the user typed
    const rankedList = [...list].sort((a, b) => {
      return calculateMatchScore(b, queryLower) - calculateMatchScore(a, queryLower);
    });

    // Map unique city, district, state, pincode combinations
    const seen = new Set();
    const results = [];

    for (const po of rankedList) {
      const state = po.State || "";
      const district = po.District || "";
      const pinCode = po.Pincode || "";
      const cleanName = (po.Name || "").trim();

      const key = `${cleanName}|${district}|${state}|${pinCode}`;
      if (!seen.has(key)) {
        seen.add(key);
        results.push({
          name: cleanName,
          city: cleanName,
          district,
          state,
          pinCode
        });
      }
    }

    return res.json({
      success: true,
      data: results.slice(0, 25)
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch location details: " + error.message
    });
  }
});

/**
 * GET /api/v1/location/pincode/:pincode
 * Looks up postal records by 6-digit PIN code
 */
router.get("/pincode/:pincode", async (req, res) => {
  try {
    const pin = req.params.pincode?.trim();
    if (!pin || !/^\d{6}$/.test(pin)) {
      return res.status(400).json({ success: false, message: "Valid 6-digit PIN code required." });
    }

    const list = await fetchPostOfficeData(`https://api.postalpincode.in/pincode/${pin}`);

    if (!list || list.length === 0) {
      return res.json({ success: true, data: null });
    }

    const primary = list[0];
    const postOffices = list.map(po => (po.Name || "").trim()).filter(Boolean);

    return res.json({
      success: true,
      data: {
        pinCode: primary.Pincode || pin,
        district: primary.District || "",
        state: primary.State || "",
        city: primary.District || primary.Name || "",
        postOffices
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch PIN code details: " + error.message
    });
  }
});

export default router;
