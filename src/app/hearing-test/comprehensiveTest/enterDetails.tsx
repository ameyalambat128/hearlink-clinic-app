import { Link, useRouter } from "expo-router";
import {
  Button,
  Image,
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Switch,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import { SetUpButton } from "@/components/ui/Button";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { useUserStore } from "@/store/store";

export default function Screen() {
  const router = useRouter();
  const {
    setName,
    setDateOfBirth,
    setDateOfTest,
    setTestConducted,
    setQuestionOne,
    setQuestionTwo,
  } = useUserStore();

  const [localName, setLocalName] = useState("");
  const [localBirthDate, setLocalBirthDate] = useState<Date | null>(null);
  const [isDatePickerVisible, setIsDatePickerVisible] =
    useState<boolean>(false);
  const [localQuestionOne, setLocalQuestionOne] = useState(false);
  const [localQuestionTwo, setLocalQuestionTwo] = useState(false);

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || localBirthDate;
    // TODO: Change format of date if required
    setLocalBirthDate(currentDate);
  };

  const checkNext = localName === "" || localBirthDate === null;

  const handleNext = () => {
    setName(localName);
    setDateOfBirth(
      localBirthDate ? localBirthDate.toISOString().split("T")[0] : ""
    );
    setDateOfTest(new Date().toISOString().split("T")[0]);
    setTestConducted("comprehensiveTest");
    setQuestionOne(localQuestionOne);
    setQuestionTwo(localQuestionTwo);
    router.push("/hearing-test/comprehensiveTest/noiseCheck");
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <View className="flex h-full w-3/4 justify-between">
        <View className="flex items-center pt-8 md:pt-10">
          <Text className="pb-6 text-3xl md:text-4xl font-bold">
            Enter your details
          </Text>
          <Text className="text-xl md:text-2xl text-center font-medium">
            This information will be used to create reports for your results.
          </Text>
        </View>
        <View className="gap-10 md:gap-20 h-96 w-full items-center">
          {/* Name Input */}
          <View className="flex-row items-center mt-2 bg-gray-100 h-16 md:h-24 border border-gray-300 rounded-full px-4 md:px-8 w-full max-w-md">
            <Feather name="user" size={20} className="mr-2" />
            <TextInput
              placeholder="Enter your name"
              value={localName}
              onChangeText={setLocalName}
              autoComplete="name"
              className="flex-1"
            />
          </View>
          {/* Birth Date Picker */}
          <TouchableOpacity
            className="flex-row items-center mt-2 bg-gray-100 h-16 md:h-24 border border-gray-300 rounded-full px-4 md:px-8 w-full max-w-md"
            onPress={() => {
              setIsDatePickerVisible(true);
            }}
          >
            <Feather name="calendar" size={19} className="mr-2" />
            {localBirthDate ? (
              <Text>
                {(localBirthDate.getMonth() + 1).toString().padStart(2, "0") +
                  "/" +
                  localBirthDate.getDate().toString().padStart(2, "0") +
                  "/" +
                  localBirthDate.getFullYear()}
              </Text>
            ) : (
              <Text className="text-gray-400/70">Select Birth Date</Text>
            )}
          </TouchableOpacity>

          {/* Question One Toggle */}
          <View className="flex-row items-center justify-between mt-2 bg-gray-100 h-16 md:h-24 border border-gray-300 rounded-full px-4 md:px-8 w-full max-w-md">
            <Text className="text-lg">Question One</Text>
            <Switch
              value={localQuestionOne}
              onValueChange={setLocalQuestionOne}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={localQuestionOne ? "#2196F3" : "#f4f3f4"}
            />
          </View>

          {/* Question Two Toggle */}
          <View className="flex-row items-center justify-between mt-2 bg-gray-100 h-16 md:h-24 border border-gray-300 rounded-full px-4 md:px-8 w-full max-w-md">
            <Text className="text-lg">Question Two</Text>
            <Switch
              value={localQuestionTwo}
              onValueChange={setLocalQuestionTwo}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={localQuestionTwo ? "#2196F3" : "#f4f3f4"}
            />
          </View>

          {isDatePickerVisible && (
            <Modal
              transparent={true}
              animationType="slide"
              visible={isDatePickerVisible}
              onRequestClose={() => {
                setIsDatePickerVisible(false);
              }}
            >
              <View className="flex-1 justify-center items-center bg-black/30 ">
                <View className="bg-white rounded-2xl p-5 w-11/12 items-center">
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={localBirthDate ? localBirthDate : new Date()}
                    mode="date"
                    display="inline"
                    onChange={onDateChange}
                    className="w-full bg-white"
                  />
                  <View className="flex-row justify-between pb-2.5">
                    <TouchableOpacity
                      onPress={() => {
                        setIsDatePickerVisible(false);
                      }}
                      style={{ padding: 10 }}
                    >
                      <Text className="text-lg font-normal text-blue-600">
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setIsDatePickerVisible(false);
                      }}
                      style={{ padding: 10 }}
                    >
                      <Text className="text-lg font-normal text-blue-600">
                        Ok
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          )}
        </View>
        <View className="mb-4 flex items-center">
          <SetUpButton
            title="Next"
            disabled={checkNext}
            handlePress={handleNext}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
