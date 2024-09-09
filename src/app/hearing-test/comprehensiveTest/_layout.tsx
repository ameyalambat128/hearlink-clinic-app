import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity, View, useColorScheme } from "react-native";

import Colors from "@/constants/Colors";
import { usePauseStore } from "@/store/store";

export default function Layout() {
  const router = useRouter();
  const colorScheme = useColorScheme();

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
      <Stack.Screen
        name="enterDetails"
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
        name="chooseHeadphones"
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
        name="connectAirpodsPro"
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
        name="connectAirpodsMax"
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
        name="practiceQuickSin"
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
        name="quickSinTest"
        options={{
          title: "Test",
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
      <Stack.Screen name="hearingScreeningTest" />
      <Stack.Screen
        name="hearingScreeningResults"
        options={{
          title: "Results",
          headerLeft: () => <View />,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                router.dismissAll();
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
