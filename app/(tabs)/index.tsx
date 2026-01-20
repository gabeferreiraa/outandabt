import CategoryFilterBar from "@/components/filters/CategoryFilterBar";
import FeedActivityCard from "@/components/ui/FeedActivityCard";
import SearchBar from "@/components/ui/SearchBar";
import { useActivitySheet } from "@/hooks/useActivitySheet";
import { Activity, getActivities } from "@/lib/supabase";
import BottomSheet from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  InteractionManager,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Feed() {
  const [searchQuery, setSearchQuery] = useState("");
  const updateTimeoutRef = useRef<NodeJS.Timeout>();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const sheetRef = useRef<BottomSheet>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );

  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);

  const { open } = useActivitySheet();

  const handleActivityPress = useCallback(
    (activity: Activity) => {
      if (!activity) return;
      open(activity);
    },
    [open]
  );

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);

      try {
        const data = await getActivities();

        if (!mounted) return;

        console.log("✅ Feed loaded", data.length, "activities");
        setActivities(data);
      } catch (error) {
        console.error("❌ Feed load error:", error);
        if (!mounted) return;
        setActivities([]);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return activities.filter((a) => {
      const matchesQuery =
        !q ||
        (a.name ?? "").toLowerCase().includes(q) ||
        (a.description ?? "").toLowerCase().includes(q);

      const matchesCategory =
        !selectedCategory ||
        (a.category ?? "").toLowerCase() === selectedCategory.toLowerCase();

      return matchesQuery && matchesCategory;
    });
  }, [activities, searchQuery, selectedCategory]);

  const popular = useMemo(() => filtered.slice(15, 35), [filtered]);
  const hotSpots = useMemo(() => filtered.slice(15, 35), [filtered]);

  const handleSearch = (query: string) => setSearchQuery(query);

  const handleCategoryPress = useCallback((category: string) => {
    if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);
    InteractionManager.runAfterInteractions(() => {
      setSelectedCategory((prev) => (prev === category ? null : category));
    });
  }, []);

  const openActivity = (activity: Activity) => {
    setSelectedActivity(activity);

    requestAnimationFrame(() => {
      sheetRef.current?.snapToIndex(0);
    });
  };

  const closeSheet = () => {
    sheetRef.current?.close();
    setSelectedActivity(null);
  };

  return (
    <>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.container}>
          <Text style={styles.brand}>out&abt</Text>

          <View style={styles.searchWrap}>
            <SearchBar onSearch={handleSearch} value={searchQuery} />
          </View>

          <View style={styles.filterRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <CategoryFilterBar
                selectedCategory={selectedCategory}
                onCategoryPress={handleCategoryPress}
              />
            </ScrollView>
          </View>

          <Text style={styles.kicker}>New activities await</Text>
          <Text style={styles.sectionTitle}>Popular right now</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 10 }}
          >
            {popular.map((a) => (
              <FeedActivityCard
                key={a.id}
                activity={a}
                variant="horizontal"
                onPress={() => handleActivityPress(a)}
                onBookmarkPress={() => {}}
              />
            ))}
          </ScrollView>

          <Text style={[styles.sectionTitle, { marginTop: 18 }]}>
            New hot spots
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 10 }}
          >
            {hotSpots.map((a) => (
              <FeedActivityCard
                key={a.id}
                activity={a}
                variant="horizontal"
                onPress={() => handleActivityPress(a)}
                onBookmarkPress={() => {}}
              />
            ))}
          </ScrollView>

          {loading ? <Text style={styles.loading}>Loading…</Text> : null}
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FEFDF8" },
  container: {
    flex: 1,
    backgroundColor: "#FEFDF8",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  content: {},

  brand: { marginTop: 6, fontSize: 24, fontWeight: "800", color: "#1F1F1F" },

  searchWrap: { marginTop: 14 },

  filterRow: { flexDirection: "row", alignItems: "center" },

  kicker: { marginTop: 16, fontSize: 16, fontWeight: "700", color: "#4A4A4A" },
  sectionTitle: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "800",
    color: "#1F1F1F",
  },

  grid: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  loading: { marginTop: 12, color: "#6B6B6B" },
});
