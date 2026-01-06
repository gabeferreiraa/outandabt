import { HapticTab } from "@/components/haptic-tab";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import MapIcon from "../../assets/icons/map-fold.svg";
import NewspaperIcon from "../../assets/icons/newspaper.svg";
import ProfileIcon from "../../assets/icons/profile.svg";
import SavedIcon from "../../assets/icons/saved.svg";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const renderTabIcon = (Icon: any, color: string, focused: boolean) => (
    <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
      <Icon
        width={24}
        height={24}
        color={focused ? "#231711" : "#666"}
        fill={focused ? "#231711" : "none"}
      />
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#231711",
        tabBarInactiveTintColor: "#666",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarLabelStyle: styles.tabBarLabelStyle,
        tabBarStyle: styles.tabBarStyle,
        tabBarItemStyle: styles.tabBarItemStyle,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Feed",
          tabBarIcon: ({ color, focused }) =>
            renderTabIcon(NewspaperIcon, color, focused),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, focused }) =>
            renderTabIcon(MapIcon, color, focused),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          tabBarIcon: ({ color, focused }) =>
            renderTabIcon(SavedIcon, color, focused),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) =>
            renderTabIcon(ProfileIcon, color, focused),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarLabelStyle: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    paddingTop: -4,
  },
  tabBarStyle: {
    backgroundColor: "#FEFDF8",
    paddingTop: 8,
    paddingBottom: 8,
  },
  tabBarItemStyle: {
    borderRadius: 12,
    marginHorizontal: 4,
    paddingVertical: 4,
  },
  iconContainer: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  iconContainerActive: {
    backgroundColor: "#B8E7DA",
    width: 50,
    height: 50,
  },
});
