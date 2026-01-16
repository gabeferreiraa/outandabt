import { createClient } from "@supabase/supabase-js";

export interface Activity {
  id: number;
  name: string;
  category: string;
  description: string;
  rating: number;
  price_min: string;
  price_max: number;
  address: string;
  postal_code: string;
  latitude?: number;
  longitude?: number;
  google_maps_link: string;
  link: string;
  images: string;
  image_url?: string;
  created_at: string;
  type: string;
}

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const IMAGES_BUCKET = "images";
export function getPublicImageUrl(path?: string | null) {
  if (!path) return null;

  const cleaned = path.replace(/^\/+/, "");

  const { data } = supabase.storage.from(IMAGES_BUCKET).getPublicUrl(cleaned);
  return data.publicUrl;
}

function withImageUrl(activity: Activity): Activity {
  return {
    ...activity,
    image_url: getPublicImageUrl(activity.images) ?? undefined,
  };
}

export async function getActivities() {
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching activities:", error);
    return [];
  }

  return (data as Activity[]).map(withImageUrl);
}

// export async function testConnection() {
//   try {
//     // Test basic connection
//     const { data, error } = await supabase
//       .from("activities")
//       .select("count", { count: "exact", head: true });

//     if (error) {
//       console.error("Connection test error:", error);

//       // Try to get more info
//       await supabase.auth.getSession();
//     } else {
//       console.log("Connection successful! Row count:", data);
//     }
//   } catch (e) {
//     console.error("Test failed:", e);
//   }
// }

export async function getActivitiesByCategory(category: string) {
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .eq("category", category)
    .order("rating", { ascending: false });

  if (error) {
    console.error("Error fetching activities by category:", error);
    return [];
  }

  return (data as Activity[]).map(withImageUrl);
}

// Fetch single activity by ID
export async function getActivityById(id: number) {
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching activity:", error);
    return null;
  }

  return withImageUrl(data as Activity);
}

// Search activities by name or description
export async function searchActivities(searchTerm: string) {
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);

  if (error) {
    console.error("Error searching activities:", error);
    return [];
  }

  return (data as Activity[]).map(withImageUrl);
}

// Get activities within a price range
export async function getActivitiesByPriceRange(
  minPrice: number,
  maxPrice: number
) {
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .gte("price_max", minPrice)
    .lte("price_min", maxPrice)
    .order("price_min", { ascending: true });

  if (error) {
    console.error("Error fetching activities by price:", error);
    return [];
  }

  return (data as Activity[]).map(withImageUrl);
}

// Get activities by type
export async function getActivitiesByType(type: string) {
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .eq("type", type)
    .order("rating", { ascending: false });

  if (error) {
    console.error("Error fetching activities by type:", error);
    return [];
  }

  return (data as Activity[]).map(withImageUrl);
}
