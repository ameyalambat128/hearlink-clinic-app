import { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
  Text,
} from "react-native";

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

export default function Modal() {
  const [isAppleHealthEnabled, setIsAppleHealthEnabled] = useState(false);

  return (
    <View className="flex-1 items-center">
      <SettingsItem name="Apple Health" onPress={() => {}} group="none" />
      <SettingsItem name="Send us feedback" onPress={() => {}} group="none" />
      <SettingsItem name="Privacy Policy" onPress={() => {}} group="start" />
      <SettingsItem name="Terms of Use" onPress={() => {}} group="middle" />
      <SettingsItem
        name="Distributor Information"
        onPress={() => {}}
        group="end"
      />
    </View>
  );
}
