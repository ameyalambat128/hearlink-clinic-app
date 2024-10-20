import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView, TouchableOpacity } from "react-native";
import Pdf from "react-native-pdf";
import * as Sharing from "expo-sharing";

export default function Modal() {
  const router = useRouter();
  const { pdfPath } = useLocalSearchParams<{ pdfPath: string }>();

  const handleShare = async () => {
    try {
      await Sharing.shareAsync(pdfPath, {
        dialogTitle: "Share PDF",
      });
    } catch (error) {
      console.error(error);
    }
  };

  console.log("report-modal: ", pdfPath);
  return (
    <SafeAreaView className="flex-1 justify-center items-center gap-3 bg-white">
      <Stack.Screen
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons
                name="chevron-back-outline"
                size={30}
                color={Colors["light"].text}
              />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => handleShare()}>
              <Ionicons name="share-outline" size={30} />
            </TouchableOpacity>
          ),
        }}
      />

      <Pdf
        source={{ uri: pdfPath, cache: true }}
        style={{ flex: 1, alignSelf: "stretch" }}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`current page: ${page}`);
        }}
        onError={(error) => {
          console.error(error);
        }}
        onPressLink={(uri) => {
          console.log(`Link pressed: ${uri}`);
        }}
      />
    </SafeAreaView>
  );
}
