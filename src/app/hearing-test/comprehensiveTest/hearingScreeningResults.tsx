import { Foundation, Ionicons } from "@expo/vector-icons";
import {
  FlatList,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Modal,
} from "react-native";
import * as FileSystem from "expo-file-system";
import uuid from "react-native-uuid";
import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

import {
  useHearingScreeningResultsStore,
  useReportsStore,
  useUserStore,
} from "@/store/store";

export default function Screen() {
  const router = useRouter();

  const { leftEarResults, rightEarResults } = useHearingScreeningResultsStore(
    (state) => ({
      leftEarResults: state.leftEarResults,
      rightEarResults: state.rightEarResults,
    })
  );
  const { name, dateOfBirth, dateOfTest, snrLoss } = useUserStore();
  const { addReport } = useReportsStore();

  const [loading, setLoading] = useState(false);

  const [pdfPath, setPdfPath] = useState<string | null>(null);
  const [showPdf, setShowPdf] = useState(false);

  const generateReport = async () => {
    setLoading(true);

    const _PROD = true;
    const baseUrl = _PROD
      ? "https://3hqdiebt0j.execute-api.us-east-1.amazonaws.com/dev"
      : "http://127.0.0.1:8080";

    const endpoint =
      "/generate_report?api_key=140d9c95c96f67d56db446ac22ce10cf";
    const url = `${baseUrl}${endpoint}`;

    const data = {
      date_of_test: dateOfTest,
      name: name,
      snr_loss: snrLoss,
      date_of_birth: dateOfBirth,
      hs_right_thresholds: rightEarResults,
      hs_left_thresholds: leftEarResults,
    };

    try {
      console.log("data:", data, url);
      const response = await axios.post(url, data);

      if (response.status === 200) {
        const result = response.data;
        const pdfBase64 = result.pdf_base64;
        const filename = result.filename;

        const pdfUri = FileSystem.documentDirectory + filename;

        // Save PDF to file
        await FileSystem.writeAsStringAsync(pdfUri, pdfBase64, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Add the report to the ReportsStore
        setPdfPath(pdfUri);
        const reportId = uuid.v4().toString();
        const reportName = `${name} Report - ${new Date().toLocaleDateString()}`;
        const report = {
          id: reportId,
          name: reportName,
          date: new Date().toISOString(),
          filePath: pdfUri,
        };
        addReport(report);
      } else {
        console.log(`Error: ${response.status}`);
      }
    } catch (err) {
      console.log(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const calculate = (score: number) => {
    if (score == 25) {
      return "Pass";
    } else {
      return "Fail";
    }
  };

  useEffect(() => {
    generateReport();
  }, []);

  return (
    <SafeAreaView className="flex-1 items-center gap-y-4 justify-start">
      <View className="mt-20 md:mt-40 w-4/5 rounded-3xl bg-blue-200 p-6 shadow-xl dark:bg-black">
        <View className="mb-6 self-center p-2">
          <Foundation
            name="results"
            size={30}
            style={{ color: "rgb(30 64 175)" }}
          />
        </View>
        <View className="flex items-center">
          <Text className="mb-6 text-center text-2xl md:text-4xl font-bold">
            Results
          </Text>
          <Text className="mb-4 text-center text-2xl md:text-4xl font-bold">
            Right Ear
          </Text>
          <FlatList
            data={Object.keys(rightEarResults)}
            className=""
            keyExtractor={(item) => item}
            renderItem={({ item }: { item: any }) => (
              <View className="flex-row items-center">
                <Text className="text-2xl font-bold">{item} Hz</Text>
                <Text className="mx-4 text-2xl font-bold">-</Text>
                <Text
                  className={`text-2xl font-bold ${
                    calculate(rightEarResults[item]) === "Pass"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {calculate(rightEarResults[item]) === "Pass" ? (
                    <Ionicons
                      name="checkmark-outline"
                      size={24}
                      color="green"
                    />
                  ) : (
                    <Ionicons name="close-outline" size={24} color="red" />
                  )}
                  {calculate(rightEarResults[item])}
                </Text>
              </View>
            )}
          />
          <Text className="my-4 text-center text-2xl md:text-4xl font-bold">
            Left Ear
          </Text>
          <FlatList
            data={Object.keys(leftEarResults)}
            className=""
            keyExtractor={(item) => item}
            renderItem={({ item }: { item: any }) => (
              <View className="flex-row items-center">
                <Text className="text-2xl font-bold">{item} Hz</Text>
                <Text className="mx-4 text-2xl font-bold">-</Text>
                <Text
                  className={`text-2xl font-bold ${
                    calculate(leftEarResults[item]) === "Pass"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {calculate(leftEarResults[item]) === "Pass" ? (
                    <Ionicons
                      name="checkmark-outline"
                      size={24}
                      color="green"
                    />
                  ) : (
                    <Ionicons name="close-outline" size={24} color="red" />
                  )}
                  {calculate(leftEarResults[item])}
                </Text>
              </View>
            )}
          />
        </View>
      </View>
      <TouchableOpacity
        onPress={() =>
          //@ts-ignore
          router.push(`/(modals)/report-modal?pdfPath=${pdfPath}`)
        }
        disabled={loading || !pdfPath}
        className={`py-3 px-6 rounded-xl ${
          loading || !pdfPath ? "bg-gray-400" : "bg-blue-500"
        }`}
      >
        <Text className="text-white text-center font-semibold">
          {loading ? "Generating Report..." : "Open Report"}
        </Text>
      </TouchableOpacity>

      {/* <Modal
        visible={showPdf}
        presentationStyle="fullScreen"
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
        </View>
      </Modal> */}
    </SafeAreaView>
  );
}
