import { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
  Text,
} from "react-native";

import Page from "@/components/Page";

type SettingsItemProps = {
  name: string;
  onPress: () => void;
  group: "start" | "middle" | "end" | "none";
};

const SettingsItem: React.FC<SettingsItemProps> = ({
  name,
  onPress,
  group,
}) => {
  // Determine the className based on the 'group' prop
  const groupClassName = `${
    group === "start" &&
    "rounded-t-xl border-b-[1px] border-gray-200 dark:border-gray-600 mt-4"
  } ${
    group === "middle" && "border-b-[1px] border-gray-200 dark:border-gray-600"
  } ${group === "end" && "rounded-b-xl mb-4"} ${
    group === "none" && "rounded-xl my-4"
  }`;

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`w-11/12 bg-gray-200 px-4 py-2 dark:bg-slate-600/50 ${groupClassName}`}
    >
      <Text className="text-lg">{name}</Text>
    </TouchableOpacity>
  );
};

export default function ProfileScreen() {
  const [isAppleHealthEnabled, setIsAppleHealthEnabled] = useState(false);

  return (
    <Page className="flex-1 items-center">
      <Text className="mt-4 text-xl font-bold">Hearing Reports</Text>
      <SettingsItem
        name="Jan 26: Test 3 QuickSIN"
        onPress={() => {}}
        group="start"
      />
      <SettingsItem
        name="Jan 26: Test 2 Pure Tone"
        onPress={() => {}}
        group="middle"
      />
      <SettingsItem
        name="Jan 26: Test Hearing Screen"
        onPress={() => {}}
        group="end"
      />
      <SettingsItem
        name="Jan 25: Test 1 Hearing Screen"
        onPress={() => {}}
        group="none"
      />
      <SettingsItem
        name="Jan 24: Test 1 Hearing Screen"
        onPress={() => {}}
        group="none"
      />
    </Page>
  );
}
