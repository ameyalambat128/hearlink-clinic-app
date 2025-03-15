import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { SafeAreaView, TouchableOpacity, Text } from "react-native";
import { usePauseStore } from "@/store/store";

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
  const { togglePause } = usePauseStore();

  const handleModalAction = (action: () => void) => {
    // First toggle pause back to false
    togglePause();
    // Then perform the navigation action
    action();
  };

  return (
    <SafeAreaView className="flex-1 items-center mt-6">
      <Stack.Screen
        options={{
          title: "Pause",
          headerRight: () => (
            <TouchableOpacity
              onPress={() =>
                handleModalAction(() => {
                  router.dismiss();
                })
              }
            >
              <Ionicons name="close-outline" size={30} />
            </TouchableOpacity>
          ),
        }}
      />
      <ModalItem
        name="Restart"
        iconName="replay"
        onPress={() => {
          handleModalAction(() => {
            router.push({
              pathname: "/hearing-test/comprehensiveTest/connectAirpodsPro",
            });
          });
        }}
        group="none"
      />
      <ModalItem
        name="Go back home"
        iconName="home"
        onPress={() => {
          handleModalAction(() => {
            router.dismissAll();
          });
        }}
        group="none"
      />
    </SafeAreaView>
  );
}
