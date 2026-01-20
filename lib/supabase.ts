import "react-native-url-polyfill/auto";

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

let supabaseInstance: ReturnType<typeof createClient> | null = null;

function getSupabase() {
  if (!supabaseInstance) {
    const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
    const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      console.error(
        "Missing Supabase environment variables!\n" +
          `URL: ${url ?? "missing"}\n` +
          `Key: ${key ? "present (hidden)" : "missing"}`
      );
      // Instead of throwing → return a dummy client or null
      // This prevents app crash on launch. You can handle this in your UI instead.
      supabaseInstance = createClient(
        "https://dummy.supabase.co",
        "dummy-key",
        {
          // realtime: { transport: null }, // Uncomment if you don't use realtime → smaller bundle
        }
      );
    } else {
      supabaseInstance = createClient(url, key, {
        // realtime: { transport: null }, // Uncomment to disable realtime if unused
      });
    }
  }
  return supabaseInstance;
}

const IMAGES_BUCKET = "images";

export function getPublicImageUrl(path?: string | null) {
  if (!path) return null;

  // Remove leading slashes
  let cleaned = path.replace(/^\/+/, "");
  // Remove "photos/" prefix if files are stored in bucket root
  cleaned = cleaned.replace(/^photos\//, "");

  const supabase = getSupabase();
  const { data } = supabase.storage.from(IMAGES_BUCKET).getPublicUrl(cleaned);

  return data.publicUrl;
}

function withImageUrl(activity: Activity): Activity {
  const imageUrl = getPublicImageUrl(activity.images);

  return {
    ...activity,
    image_url: imageUrl ?? undefined,
  };
}

export async function getActivities() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching activities:", error);
    return [];
  }

  console.log("✅ Fetched", data?.length, "activities from Supabase");

  const activitiesWithImages = (data as Activity[]).map(withImageUrl);

  if (activitiesWithImages.length > 0) {
    console.log("📋 First activity sample:");
    console.log("  Name:", activitiesWithImages[0].name);
    console.log("  DB images field:", activitiesWithImages[0].images);
    console.log("  Generated image_url:", activitiesWithImages[0].image_url);
  }

  return activitiesWithImages;
}

export async function getActivitiesByCategory(category: string) {
  const supabase = getSupabase();
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

export async function getActivityById(id: number) {
  const supabase = getSupabase();
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

export async function searchActivities(searchTerm: string) {
  const supabase = getSupabase();
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

export async function getActivitiesByPriceRange(
  minPrice: number,
  maxPrice: number
) {
  const supabase = getSupabase();
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

export async function getActivitiesByType(type: string) {
  const supabase = getSupabase();
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

export async function debugBucketStructure() {
  console.log("\n🔍 === BUCKET STRUCTURE DEBUG ===");

  const supabase = getSupabase();

  try {
    // List root level
    console.log("\n📁 Root level:");
    const { data: rootFiles, error: rootError } = await supabase.storage
      .from(IMAGES_BUCKET)
      .list("", { limit: 100 });

    if (rootError) {
      console.error("❌ Error listing root:", rootError);
    } else if (rootFiles) {
      rootFiles.forEach((file) => {
        console.log(`  ${file.name}${file.id ? "" : " (folder)"}`);
      });
    }

    // List photos folder
    console.log("\n📁 photos/ folder:");
    const { data: photosFiles, error: photosError } = await supabase.storage
      .from(IMAGES_BUCKET)
      .list("photos", { limit: 1000 });

    if (photosError) {
      console.error("❌ Error listing photos/:", photosError);
    } else if (photosFiles) {
      photosFiles.forEach((file) => {
        const fullPath = `photos/${file.name}`;
        const { data: urlData } = supabase.storage
          .from(IMAGES_BUCKET)
          .getPublicUrl(fullPath);
        console.log(`  ${file.name}`);
        console.log(`    → ${urlData.publicUrl}`);
      });
    }

    console.log("\n=== END DEBUG ===\n");
  } catch (e) {
    console.error("❌ Bucket debug failed:", e);
  }
}
