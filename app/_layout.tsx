import ActivitySheet from "@/components/ui/ActivitySheet";
import { useAppFonts } from "@/fonts/useFonts";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useActivitySheet } from "@/hooks/useActivitySheet";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

export const unstable_settings = {
  anchor: "(tabs)",
};
export default function RootLayout() {
  const { activity, close } = useActivitySheet();

  const colorScheme = useColorScheme();
  const [fontsLoaded] = useAppFonts();

  if (!fontsLoaded) {
    return null; // or your splash screen
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <ActivitySheet activity={activity} onClose={close} />
        <StatusBar backgroundColor="#FEFDF8" style="light" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
