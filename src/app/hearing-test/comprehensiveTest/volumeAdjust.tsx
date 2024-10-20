import { Ionicons } from "@expo/vector-icons";
import { AVPlaybackStatus, Audio } from "expo-av";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
  Platform,
} from "react-native";

import { SetUpButton } from "@/components/ui/Button";

const isPad: boolean = Platform.OS === "ios" && Platform.isPad;

export default function Screen() {
  const router = useRouter();
  const [volume, setVolume] = useState(0);
  const [status, setStatus] = useState<AVPlaybackStatus>();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handleNext = () => {
    router.push("/hearing-test/comprehensiveTest/doNotDisturb");
    sound?.pauseAsync();
    sound?.unloadAsync();
  };

  const playSound = useCallback(async (soundToPlay: Audio.Sound) => {
    try {
      if (!soundToPlay) {
        return;
      }
      await soundToPlay.replayAsync();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  }, []);

  const loadAndPlaySound = useCallback(async () => {
    try {
      if (sound) await sound.unloadAsync();

      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: false,
        shouldDuckAndroid: false,
      });

      const audioFile = require("../../../../assets/audio/rainbow-passage.mp3");

      const { sound: newSound } = await Audio.Sound.createAsync(
        audioFile,
        undefined,
        onPlaybackStatusUpdate
      );
      setSound(newSound);
      playSound(newSound);
    } catch (error) {
      console.error("Error loading sound:", error);
    }
  }, [sound, playSound]);

  const onPlaybackStatusUpdate = useCallback(
    async (newStatus: AVPlaybackStatus) => {
      setStatus(newStatus);
      if (newStatus.isLoaded) {
        setIsPlaying(newStatus.isPlaying);
        if (newStatus.didJustFinish && !newStatus.isLooping) {
          // Sound has finished playing, stop recording
          console.log("Sound finished playing");
        }
      }
    },
    []
  );

  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <View className="flex h-full w-3/4 justify-between">
        <View className="flex items-center pt-8 md:pt-10">
          <Text className="pb-6 text-3xl md:text-4xl font-bold">
            Adjust your Volume
          </Text>
          {/* TODO: Description update here */}
          <Text className="text-xl md:text-2xl text-center font-medium">
            Play the audio below and adjust the volume to a level that it's
            "Loud, but Ok"
          </Text>
        </View>
        <View className="flex items-center">
          {isPlaying ? (
            <View className="items-center">
              <Text className="font-bold italic md:text-2xl">
                Adjust the volume using the side buttons
              </Text>
              <TouchableOpacity onPress={() => sound?.pauseAsync()}>
                <Ionicons
                  name="pause"
                  size={50 * (isPad ? 1.5 : 1)}
                  color="black"
                />
              </TouchableOpacity>
            </View>
          ) : (
            <View className="items-center">
              <Text className="font-bold italic md:text-2xl">
                Click the button below to play
              </Text>
              <TouchableOpacity onPress={loadAndPlaySound}>
                <Ionicons
                  name="play"
                  size={50 * (isPad ? 1.5 : 1)}
                  color="black"
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View className="flex items-center shadow-2xl">
          <Image
            source={require("../../../../assets/media/volumeAdjustQ.gif")} // Replace with your volume icon
            resizeMode="contain"
            style={{
              width: 300 * (isPad ? 1.8 : 1),
              height: 300 * (isPad ? 1.8 : 1),
            }}
          />
        </View>
        <View className="mb-4 flex items-center">
          <SetUpButton title="Next" handlePress={handleNext} />
        </View>
      </View>
    </SafeAreaView>
  );
}
