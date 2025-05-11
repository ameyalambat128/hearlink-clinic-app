import { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
  Text,
  Modal,
} from "react-native";
import Pdf from "react-native-pdf";
import * as FileSystem from "expo-file-system";

import Page from "@/components/Page";
import { useReportsStore } from "@/store/store";
import { useRouter } from "expo-router";

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
  const router = useRouter();
  const { reports } = useReportsStore();

  const [isAppleHealthEnabled, setIsAppleHealthEnabled] = useState(false);
  const [showPdf, setShowPdf] = useState(false);
  const [pdfPath, setPdfPath] = useState<string | null>(null);

  const handleOpenReport = (filePath: string) => {
    setPdfPath(filePath);
    setShowPdf(true);
  };

  return (
    <Page className="flex-1 items-center">
      <Text className="mt-4 text-xl font-bold">Hearing Reports</Text>
      {reports.map((report) => (
        <SettingsItem
          key={report.id}
          name={report.name}
          onPress={() =>
            //@ts-ignore
            router.push(`/(modals)/report-modal?pdfPath=${report.filePath}`)
          }
          group="none"
        />
      ))}
      <Modal
        visible={showPdf}
        presentationStyle="pageSheet"
        animationType="slide"
        onRequestClose={() => setShowPdf(false)}
      >
        <View className="flex-1 justify-center items-center gap-3 bg-white dark:bg-gray-900">
          <TouchableOpacity
            onPress={() => setShowPdf(false)}
            className="bg-red-500 py-2 px-4 rounded mt-4"
          >
            <Text className="text-white text-center font-semibold">Close</Text>
          </TouchableOpacity>
          {pdfPath && (
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
          )}
        </View>
      </Modal>
    </Page>
  );
}
