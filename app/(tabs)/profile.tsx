// app/(tabs)/profile.tsx  (or wherever your tab screen lives)
import React from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ✅ Swap these to your existing palette exports (keep the names if you already have them)
const COLORS = {
  bg: "#F3F1EC", // app background (warm off-white)
  card: "#FBFAF6", // card surface
  text: "#1B1B1B",
  muted: "#8E8A80",
  primary: "#4E8F7B", // green button
  primaryText: "#FFFFFF",
  outline: "#E7E3DA",
  tabMint: "#BFE3D5",
  stampActive: "#2F8CFF", // blue highlight outline
};

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Top */}
        <View style={styles.topRow}>
          <Text style={styles.brand}>out&amp;abt</Text>
        </View>

        {/* Header block */}
        <View style={styles.header}>
          <Image
            source={{ uri: "https://picsum.photos/200" }} // replace with your user avatar url
            style={styles.avatar}
          />

          <View style={styles.headerRight}>
            <View style={styles.nameBlock}>
              <Text style={styles.name}>Doyeon</Text>
              <Text style={styles.handle}>@yoo.doyeon</Text>
            </View>

            <TouchableOpacity activeOpacity={0.9} style={styles.editBtn}>
              <Text style={styles.editBtnText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Passport card */}
        <View style={styles.passportCard}>
          <Text style={styles.passportTitle}>Passport</Text>
          <Text style={styles.passportDesc}>
            Gain exclusive stamps whenever{"\n"}you visit and rate an activity.
          </Text>
        </View>

        {/* Stamps row */}
        <View style={styles.stampsRow}>
          <View style={styles.stampEmpty} />
          <View style={styles.stampActive} />
        </View>

        {/* Rate button */}
        <TouchableOpacity activeOpacity={0.9} style={styles.rateBtn}>
          <Text style={styles.rateBtnText}>Rate an activity</Text>
        </TouchableOpacity>

        {/* bottom breathing room so it sits above the tab bar */}
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  container: {
    paddingHorizontal: 18,
    paddingTop: 8,
  },

  topRow: {
    paddingTop: 6,
    paddingBottom: 6,
  },
  brand: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
    letterSpacing: 0.2,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingTop: 8,
    paddingBottom: 14,
  },
  avatar: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: COLORS.outline,
  },
  headerRight: {
    flex: 1,
    gap: 10,
  },
  nameBlock: {
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Poppins",
    color: COLORS.text,
  },
  handle: {
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: "500",
  },

  editBtn: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 8,
  },
  editBtnText: {
    color: COLORS.primaryText,
    fontWeight: "400",
    fontSize: 14,
  },

  passportCard: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  passportTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 8,
  },
  passportDesc: {
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.text,
    textAlign: "center",
    opacity: 0.85,
  },

  stampsRow: {
    flexDirection: "row",
    gap: 18,
    marginTop: 18,
    justifyContent: "space-between",
  },
  stampEmpty: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: COLORS.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "transparent",
  },
  stampActive: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: COLORS.card,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: COLORS.stampActive,
  },

  rateBtn: {
    marginTop: 18,
    alignSelf: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 180,
    alignItems: "center",
  },
  rateBtnText: {
    color: COLORS.primaryText,
    fontWeight: "400",
    fontSize: 14,
  },
});
