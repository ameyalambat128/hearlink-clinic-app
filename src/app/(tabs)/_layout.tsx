import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Link, Tabs } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{}}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Hearing",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="hearing" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: "Reports",
          tabBarIcon: ({ color }) => (
            <Ionicons name="document-text" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerRight: () => (
            <TouchableOpacity className="pr-4">
              <Link href="/settings">
                <MaterialIcons name="settings" size={24} />
              </Link>
            </TouchableOpacity>
          ),
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
