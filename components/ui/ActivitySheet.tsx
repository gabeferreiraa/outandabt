import { Activity } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React, { forwardRef, useCallback, useMemo, useRef } from "react";
import {
  Dimensions,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

const { width } = Dimensions.get("window");

interface ActivitySheetProps {
  activity: Activity | null;
  onClose: () => void;
}

const ActivitySheet = forwardRef<BottomSheet, ActivitySheetProps>(
  ({ activity, onClose }, ref) => {
    const sheetRef = useRef<BottomSheet>(null);

    const snapPoints = useMemo(() => ["90%"], []);

    const handleSheetChange = useCallback(
      (index: number) => {
        if (index === -1) {
          onClose();
        }
      },
      [onClose]
    );

    if (!activity) return null;

    // Your original static image — back to how you had it!
    const images = ["../../assets/images/mango-mango-dessert.jpeg"];

    // This fixes your main issue: use the actual activity coordinates
    const coordinates = {
      latitude: activity.latitude ?? 39.9526,
      longitude: activity.longitude ?? -75.1652,
    };

    const formatPrice = () => {
      if (activity.price_min && activity.price_max)
        return `$${activity.price_min}–$${activity.price_max}`;
      if (activity.price_min) return `From $${activity.price_min}`;
      return "Price varies";
    };
    return (
      <BottomSheet
        ref={sheetRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose
        onChange={handleSheetChange}
        onClose={onClose}
        backgroundStyle={styles.background}
        handleIndicatorStyle={styles.handle}
      >
        <BottomSheetScrollView>
          <>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
            >
              {images.map((img, i) => (
                <Image
                  key={i}
                  source={{ uri: activity.image_url }}
                  style={styles.headerImage}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>

            <View style={styles.content}>
              <Text style={styles.title}>{activity.name}</Text>
              <Text style={styles.price}>{formatPrice()}</Text>
              <Text style={styles.category}>
                {activity.category?.charAt(0).toUpperCase() +
                  activity.category?.slice(1)}
              </Text>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>About</Text>
                <Text style={styles.description}>{activity.description}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Location</Text>
                <Text style={styles.address}>{activity.address}</Text>

                {/* Only show map if we have coordinates */}
                {activity.latitude && activity.longitude && (
                  <MapView
                    style={styles.map}
                    initialRegion={{
                      ...coordinates,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }}
                  >
                    <Marker coordinate={coordinates} />
                  </MapView>
                )}
              </View>

              <View style={styles.actions}>
                {activity.link && (
                  <TouchableOpacity
                    style={styles.btn}
                    onPress={() => Linking.openURL(activity.link)}
                  >
                    <Ionicons name="globe-outline" size={18} color="#333" />
                    <Text style={styles.btnText}>Website</Text>
                  </TouchableOpacity>
                )}
                {activity.google_maps_link && (
                  <TouchableOpacity
                    style={styles.btn}
                    onPress={() => Linking.openURL(activity.google_maps_link)}
                  >
                    <Ionicons name="navigate" size={18} color="#333" />
                    <Text style={styles.btnText}>Directions</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.btn}>
                  <Ionicons name="bookmark-outline" size={20} color="#333" />
                  <Text style={styles.btnText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        </BottomSheetScrollView>
      </BottomSheet>
    );
  }
);

ActivitySheet.displayName = "ActivitySheet";

export default ActivitySheet;

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#FEFDF8",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handle: { backgroundColor: "#ccc", width: 40 },
  headerImage: { width, height: 240 },
  content: { padding: 20 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 8 },
  price: { fontSize: 18, fontWeight: "600", color: "#2e8b57" },
  category: {
    fontSize: 16,
    color: "#666",
    marginVertical: 8,
    textTransform: "capitalize",
  },
  section: { marginTop: 24 },
  sectionTitle: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  description: { fontSize: 15, lineHeight: 22, color: "#333" },
  address: { fontSize: 16, color: "#333", marginBottom: 12 },
  map: { width: "100%", height: 160, borderRadius: 12, overflow: "hidden" },
  actions: { flexDirection: "row", gap: 12, marginTop: 20 },
  btn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    paddingVertical: 14,
    borderRadius: 25,
    gap: 8,
  },
  btnText: { fontSize: 15, fontWeight: "600" },
});
