import { Ionicons } from "@expo/vector-icons";
import { Link, Stack, useNavigation, useRouter } from "expo-router";
import { TouchableOpacity, View, useColorScheme } from "react-native";

import Colors from "@/constants/Colors";
import { usePauseStore } from "@/store/store";

export default function Layout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const navigation = useNavigation();

  const { togglePause } = usePauseStore();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Get Set Up",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons
                name="chevron-back-outline"
                size={30}
                color={Colors[colorScheme ?? "light"].text}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="noiseCheck" />
      <Stack.Screen
        name="connectHeadphones"
        options={{
          title: "Get Set Up",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons
                name="chevron-back-outline"
                size={30}
                color={Colors[colorScheme ?? "light"].text}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="volumeAdjust"
        options={{
          title: "Get Set Up",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons
                name="chevron-back-outline"
                size={30}
                color={Colors[colorScheme ?? "light"].text}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="doNotDisturb"
        options={{
          title: "Get Set Up",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons
                name="chevron-back-outline"
                size={30}
                color={Colors[colorScheme ?? "light"].text}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="practiceHearingScreening"
        options={{
          title: "Practice",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons
                name="chevron-back-outline"
                size={30}
                color={Colors[colorScheme ?? "light"].text}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="hearingScreeningTest"
        options={{
          title: "Hearing Test",
          gestureEnabled: false,
          headerLeft: () => <View />,
          headerRight: () => (
            <TouchableOpacity onPress={togglePause}>
              <Link href="/hearingTest/hearingScreening/pauseModal">
                <Ionicons
                  name="pause-outline"
                  size={30}
                  color={Colors[colorScheme ?? "light"].text}
                />
              </Link>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="pauseModal"
        options={{
          title: "Pause",
          presentation: "modal",
          headerRight: () => (
            <TouchableOpacity onPress={() => router.dismiss()}>
              <Ionicons
                name="close-outline"
                size={30}
                color={Colors[colorScheme ?? "light"].text}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="hearingScreeningResults"
        options={{
          title: "Results",
          headerLeft: () => <View />,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.dispatch({ type: "POP_TO_TOP" });
                navigation.dispatch({ type: "POP_TO_TOP" });
              }}
            >
              <Ionicons
                name="close-outline"
                size={30}
                color={Colors[colorScheme ?? "light"].text}
              />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
