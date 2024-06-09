import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { SafeAreaView, TouchableOpacity, Text } from "react-native";

type ModalItemProps = {
  name: string;
  iconName: any;
  onPress: () => void;
  group: "start" | "middle" | "end" | "none";
};

const ModalItem: React.FC<ModalItemProps> = ({
  name,
  iconName,
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
      className={`w-11/12 bg-gray-200 px-4 py-3 dark:bg-slate-600/50 ${groupClassName} flex-row items-center gap-3`}
    >
      <MaterialIcons name={iconName} size={24} color="black" />
      <Text className="text-lg">{name}</Text>
    </TouchableOpacity>
  );
};

export default function Modal() {
  const router = useRouter();
  const [isAppleHealthEnabled, setIsAppleHealthEnabled] = useState(false);

  return (
    <SafeAreaView className="flex-1 items-center mt-6">
      <ModalItem
        name="Restart"
        iconName="replay"
        onPress={() => {
          router.push({
            pathname: "/hearing-test/hearingScreening/practiceHearingScreening",
          });
        }}
        group="none"
      />
      <ModalItem
        name="Go back home"
        iconName="home"
        onPress={() => {
          router.dismissAll();
        }}
        group="none"
      />
    </SafeAreaView>
  );
}
