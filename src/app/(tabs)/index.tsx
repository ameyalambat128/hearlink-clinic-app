import { useRouter } from "expo-router";
import { useRef } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
} from "react-native";

import Page from "@/components/Page";
import { useUserStore } from "@/store/store";

const { width, height } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.8;
const ITEM_HEIGHT = ITEM_WIDTH * 1.5;
const SPACING = 10;
const SPACER_ITEM_SIZE = (width - ITEM_WIDTH) / 2;

const tests: {
  id: string;
  name?: string;
  description?: string;
  link?: string;
  image?: number;
}[] = [
  { id: "empty-left" },
  // {
  //   id: "1",
  //   name: "CEDRA Questionnaire",
  //   description:
  //     "The CEDRA (Client Experience of Deafness Rating Assessment) questionnaire is a comprehensive tool designed to evaluate the unique experiences and challenges faced by individuals with hearing loss.",
  //   link: "/hearing-test/questionnaire",
  //   image: require("../../../assets/images/cedra-logo.png"),
  // },
  {
    id: "1",
    name: "Comprehensive Test",
    description:
      "A comprehensive hearing test combines a range of assessments to evaluate the full extent of an individual's hearing abilities, including pure-tone audiometry, speech audiometry.",
    link: "/hearing-test/comprehensiveTest/hearingScreeningTest",
    image: require("../../../assets/images/hearingscreen-logo.png"),
  },
  // {
  //   id: "3",
  //   name: "Hearing Screening Test",
  //   description:
  //     "A hearing screening test is a quick and basic procedure used to identify individuals who may have hearing loss and require a more comprehensive auditory assessment.",
  //   link: "/hearing-test/hearingScreening",
  //   image: require("../../../assets/images/hearingscreen-logo.png"),
  // },
  // {
  //   id: "4",
  //   name: "Quick SIN Test",
  //   description:
  //     "The QuickSIN test is a rapid and effective assessment tool used in audiology to measure a person's ability to understand speech in noisy environments, helping to identify issues with speech discrimination.",
  //   link: "/hearing-test/quickSin",
  //   image: require("../../../assets/images/quicksin-logo.png"),
  // },
  { id: "empty-right" },
];

export default function Hearing() {
  const router = useRouter();
  const { name, dateOfBirth, dateOfTest, testConducted } = useUserStore();
  console.log(name);
  console.log(dateOfBirth);
  console.log(dateOfTest);
  console.log(testConducted);

  const nextPage = (href: any) => {
    router.push(href);
  };
  const scrollX = useRef(new Animated.Value(0)).current;

  return (
    <Page
      headerShown={false}
      className="flex-1 items-center justify-center bg-white"
    >
      <View className="">
        <Image
          source={require("../../../assets/images/hearlinkhome-logo.png")}
          resizeMode="contain"
          style={{
            width: 180,
            height: 100,
          }}
        />
      </View>
      <Animated.FlatList
        showsHorizontalScrollIndicator={false}
        data={tests}
        keyExtractor={(item) => item.id}
        horizontal
        decelerationRate={0}
        snapToInterval={ITEM_WIDTH}
        bounces={false}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  x: scrollX,
                },
              },
            },
          ],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={{
          alignItems: "center",
        }}
        renderItem={({
          item,
          index,
        }: {
          item: {
            id: string;
            name?: string;
            description?: string;
            link?: string;
            image?: any;
          };
          index: number;
        }) => {
          if (!item.name) {
            return <View style={{ width: SPACER_ITEM_SIZE }} />;
          }

          const inputRange = [
            (index - 2) * ITEM_WIDTH,
            (index - 1) * ITEM_WIDTH,
            index * ITEM_WIDTH,
          ];

          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [0, -30, 0],
            extrapolate: "clamp",
          });

          return (
            <View
              style={{
                width: ITEM_WIDTH,
              }}
            >
              <Animated.View
                className="items-center rounded-2xl bg-blue-200"
                style={{
                  marginHorizontal: SPACING,
                  padding: SPACING * 2,
                  height: ITEM_HEIGHT,
                  transform: [{ translateY }],
                }}
              >
                <Pressable
                  className="items-center"
                  onPress={() => nextPage(item.link)}
                >
                  <Image
                    source={item.image}
                    style={{
                      width: ITEM_WIDTH * 0.8,
                      height: ITEM_WIDTH * 0.8,
                      borderRadius: 24,
                    }}
                    resizeMode="contain"
                  />
                  <Text className="text-xl font-bold my-6">{item.name}</Text>
                  <Text className="text-center font-medium text-gray-700">
                    {item.description}
                  </Text>
                </Pressable>
              </Animated.View>
            </View>
          );
        }}
      />
    </Page>
  );
}
