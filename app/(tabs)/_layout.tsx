import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import MapIcon from "../../assets/icons/map-fold.svg";
import NewspaperIcon from "../../assets/icons/newspaper.svg";
import ProfileIcon from "../../assets/icons/profile.svg";
import SavedIcon from "../../assets/icons/saved.svg";
export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarLabelStyle: styles.tabBarLabelStyle, // setting label size to 14 (for now)
        tabBarStyle: styles.tabBarStyle,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Feed",
          tabBarIcon: ({ color }) => (
            <NewspaperIcon
              width={24}
              height={24}
              color={color ?? "#CC432e"}
              fill="#231711"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <MapIcon width={24} height={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          tabBarIcon: ({ color }) => (
            <SavedIcon width={24} height={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <ProfileIcon width={24} height={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarLabelStyle: {
    fontSize: 12, // Set your desired font size here
    fontFamily: "Poppins-Regular",
    marginTop: 5,
    color: "#231711",
  },
  tabBarStyle: {
    backgroundColor: "#FEFDF8",
  },
});
