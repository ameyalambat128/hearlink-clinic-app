import { Ionicons } from "@expo/vector-icons";
import { Stack, useNavigation, useRouter } from "expo-router";
import { TouchableOpacity, View, useColorScheme } from "react-native";

import Colors from "@/constants/Colors";

export default function Layout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const navigation = useNavigation();

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
    </Stack>
  );
}
