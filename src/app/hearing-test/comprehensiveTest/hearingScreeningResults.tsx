import { Foundation, Ionicons } from "@expo/vector-icons";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as FileSystem from "expo-file-system";
import uuid from "react-native-uuid";
import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useState, useMemo } from "react";

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

  // Determine overall result - Pass only if ALL frequencies pass in BOTH ears
  const screeningResult = useMemo(() => {
    const allFrequenciesPass = Object.values({
      ...rightEarResults,
      ...leftEarResults,
    }).every((value) => value === 25);
    return allFrequenciesPass ? "Pass" : "Refer";
  }, [rightEarResults, leftEarResults]);

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

  useEffect(() => {
    generateReport();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="items-center px-4 pt-10">
          <Text className="mt-4 text-3xl font-bold text-center">
            Hearing Screening Results
          </Text>

          {/* Result Card */}
          <View
            className={`mt-8 w-full rounded-2xl p-6 ${
              screeningResult === "Pass" ? "bg-blue-50" : "bg-orange-50"
            }`}
          >
            <View className="flex-row items-center justify-center mb-4">
              <Ionicons
                name={
                  screeningResult === "Pass"
                    ? "checkmark-circle"
                    : "alert-circle"
                }
                size={30}
                color={screeningResult === "Pass" ? "#16a34a" : "#ea580c"}
              />
              <Text
                className={`ml-2 text-2xl font-bold ${
                  screeningResult === "Pass"
                    ? "text-green-600"
                    : "text-orange-600"
                }`}
              >
                {screeningResult === "Pass" ? "Pass" : "Refer"}
              </Text>
            </View>

            <Text className="text-gray-700 text-lg text-center">
              {screeningResult === "Pass"
                ? "Your hearing screening results indicate that your hearing is within normal limits at all tested frequencies. No further action is needed at this time."
                : "Your hearing screening results indicate potential hearing difficulties. We recommend scheduling a comprehensive hearing evaluation with a hearing specialist."}
            </Text>
          </View>

          {/* Detailed Results Section */}
          <Text className="mt-10 mb-4 text-2xl font-bold text-center">
            Detailed Results
          </Text>

          {/* Right Ear Results */}
          <View className="w-full bg-gray-50 rounded-xl p-4 mb-4">
            <Text className="text-xl font-bold mb-3 text-center">
              Right Ear
            </Text>
            {Object.keys(rightEarResults).map((frequency) => (
              <View
                key={`right-${frequency}`}
                className="flex-row justify-between items-center py-2 border-b border-gray-200"
              >
                <Text className="text-lg">{frequency} Hz</Text>
                <View className="flex-row items-center">
                  <Ionicons
                    name={
                      rightEarResults[frequency] === 25
                        ? "checkmark-circle"
                        : "close-circle"
                    }
                    size={20}
                    color={
                      rightEarResults[frequency] === 25 ? "#16a34a" : "#dc2626"
                    }
                  />
                  <Text
                    className={`ml-2 font-medium ${
                      rightEarResults[frequency] === 25
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {rightEarResults[frequency] === 25 ? "Pass" : "Refer"}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Left Ear Results */}
          <View className="w-full bg-gray-50 rounded-xl p-4">
            <Text className="text-xl font-bold mb-3 text-center">Left Ear</Text>
            {Object.keys(leftEarResults).map((frequency) => (
              <View
                key={`left-${frequency}`}
                className="flex-row justify-between items-center py-2 border-b border-gray-200"
              >
                <Text className="text-lg">{frequency} Hz</Text>
                <View className="flex-row items-center">
                  <Ionicons
                    name={
                      leftEarResults[frequency] === 25
                        ? "checkmark-circle"
                        : "close-circle"
                    }
                    size={20}
                    color={
                      leftEarResults[frequency] === 25 ? "#16a34a" : "#dc2626"
                    }
                  />
                  <Text
                    className={`ml-2 font-medium ${
                      leftEarResults[frequency] === 25
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {leftEarResults[frequency] === 25 ? "Pass" : "Refer"}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Action Buttons */}
          <View className="w-full mt-10 flex-row justify-between">
            <TouchableOpacity
              onPress={() =>
                pdfPath &&
                //@ts-expect-error - router.push is not typed
                router.push(`/(modals)/report-modal?pdfPath=${pdfPath}`)
              }
              disabled={loading || !pdfPath}
              className={`w-full items-center justify-center rounded-2xl px-6 py-4 md:py-6 ${
                loading || !pdfPath ? "bg-gray-200" : "bg-blue-200"
              }`}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text
                  className={`text-base font-medium md:text-2xl ${
                    loading ? "text-gray-800" : "text-blue-800"
                  }`}
                >
                  View Report
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
