import { useState } from "react";
import {
  SafeAreaView,
  Image,
  TouchableOpacity,
  View,
  Text,
} from "react-native";

import Page from "@/components/Page";

type ProfileItemProps = {
  name: string;
  onPress: () => void;
  group: "start" | "middle" | "end" | "none";
};

const ProfileItem: React.FC<ProfileItemProps> = ({ name, onPress, group }) => {
  // Determine the className based on the 'group' prop
  const groupClassName = `${
    group === "start" &&
    "rounded-t-xl border-b-[1px] border-gray-200 dark:border-gray-700 mt-4"
  } ${
    group === "middle" && "border-b-[1px] border-gray-200 dark:border-gray-700"
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
  const currentUser = {
    name: "John Doe",
    email: "johndoe@example.com",
    profilePicture: require("../../../assets/images/adaptive-icon.png"),
  };

  return (
    <Page className="flex-1 items-center">
      <View className="my-5 items-center">
        <Image
          source={currentUser.profilePicture}
          className="h-24 w-24 rounded-full"
        />
        <Text className="mt-3 text-lg font-bold">{currentUser.name}</Text>
        <Text className="text-gray-600">{currentUser.email}</Text>
      </View>

      <ProfileItem name="Edit Profile" onPress={() => {}} group="none" />
      {/* <ProfileItem name="" onPress={() => {}} group="start" />
      <ProfileItem name="" onPress={() => {}} group="middle" />
      <ProfileItem name="" onPress={() => {}} group="end" /> */}
      <ProfileItem name="Log Out" onPress={() => {}} group="none" />
    </Page>
  );
}
