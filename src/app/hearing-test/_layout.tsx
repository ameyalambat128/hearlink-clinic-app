import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity, useColorScheme } from "react-native";

import Colors from "../../constants/Colors";

export default function HearingTestLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Get Set Up",
          headerRight: () => (
            <TouchableOpacity onPress={() => router.back()}>
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
        name="questionnaire"
        options={{
          headerShown: false,
          animation: "fade",
        }}
      />
      <Stack.Screen
        name="comprehensiveTest"
        options={{
          headerShown: false,
          animation: "fade",
        }}
      />
      <Stack.Screen
        name="hearingScreening"
        options={{
          headerShown: false,
          animation: "fade",
        }}
      />
      <Stack.Screen
        name="quickSin"
        options={{
          headerShown: false,
          animation: "fade",
        }}
      />
    </Stack>
  );
}
