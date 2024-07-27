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
} from "react-native";

import { SetUpButton } from "@/components/ui/Button";

export default function VolumeAdjust() {
  const router = useRouter();
  const [volume, setVolume] = useState(0);
  const [status, setStatus] = useState<AVPlaybackStatus>();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handleNext = () => {
    router.push("/hearing-test/quickSin/doNotDisturb");
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
        <View className="flex items-center pt-8">
          <Text className="pb-6 text-2xl font-bold">Adjust your Volume</Text>
          {/* TODO: Description update here */}
          <Text className="text-md text-center font-medium">
            Play the audio below and adjust the volume to a level that it's
            "Loud, but Ok"
          </Text>
        </View>
        <View className="flex items-center">
          {isPlaying ? (
            <View className="items-center">
              <Text className="font-bold italic">
                Adjust the volume using the side buttons
              </Text>
              <TouchableOpacity onPress={() => sound?.pauseAsync()}>
                <Ionicons name="pause" size={50} color="black" />
              </TouchableOpacity>
            </View>
          ) : (
            <View className="items-center">
              <Text className="font-bold italic">
                Click the button below to play
              </Text>
              <TouchableOpacity onPress={loadAndPlaySound}>
                <Ionicons name="play" size={50} color="black" />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View className="shadow-2xl">
          <Image
            source={require("../../../../assets/media/volumeAdjustQ.gif")} // Replace with your volume icon
            resizeMode="contain"
            style={{
              width: 300,
              height: 300,
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
