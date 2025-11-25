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
  google_maps_link: string;
  link: string;
  images: string;
  created_at: string;
  type: string;
}

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Add these temporary logs to debug
console.log("Supabase URL:", SUPABASE_URL);
console.log("Supabase Key exists:", !!SUPABASE_ANON_KEY);
console.log("Key length:", SUPABASE_ANON_KEY?.length);

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fetch all activities
export async function getActivities() {
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching activities:", error);
    return [];
  }

  return data as Activity[];
}
// Add this test function to your supabase.ts
export async function testConnection() {
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from("activities")
      .select("count", { count: "exact", head: true });

    if (error) {
      console.error("Connection test error:", error);

      // Try to get more info
      const { data: authData, error: authError } =
        await supabase.auth.getSession();
      console.log("Auth session:", authData);
      console.log("Auth error:", authError);
    } else {
      console.log("Connection successful! Row count:", data);
    }
  } catch (e) {
    console.error("Test failed:", e);
  }
}

// Fetch activities by category
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

  return data as Activity[];
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

  return data as Activity;
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

  return data as Activity[];
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

  return data as Activity[];
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

  return data as Activity[];
}
