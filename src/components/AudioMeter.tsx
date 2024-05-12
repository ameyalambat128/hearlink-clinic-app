import { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const AudioMeter = ({ dbValue }: { dbValue: number }) => {
  const meterLevel = useSharedValue(0);
  const color = useSharedValue("green"); // default to green
  const [smoothedDbValue, setSmoothedDbValue] = useState(dbValue);
  const smoothingFactor = 0.2;
  const updateInterval = 30;

  const normalizeMetering = (db: number) => {
    const minDb = -60;
    const maxDb = 0;
    return db < minDb ? 0 : db > maxDb ? 1 : (db - minDb) / (maxDb - minDb);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSmoothedDbValue((prev) => prev + smoothingFactor * (dbValue - prev));
    }, updateInterval);
    return () => clearInterval(intervalId);
  }, [dbValue]);

  useEffect(() => {
    meterLevel.value = withTiming(normalizeMetering(smoothedDbValue), {
      duration: updateInterval,
      easing: Easing.linear,
    });

    const backgroundColor = getBackgroundColor(meterLevel.value);
    if (backgroundColor !== color.value) {
      color.value = backgroundColor;
    }
  }, [smoothedDbValue]);

  const getBackgroundColor = (level: number) => {
    if (level > 0.7) return "#FF4136";
    else if (level > 0.5) return "#FF851B";
    else if (level > 0.3) return "#FFD700";
    else return "#2ECC40";
  };

  const getNoiseLevelDescription = (level: number) => {
    if (level > 0.7) return "Very Loud: Find a quieter environment";
    else if (level > 0.5) return "Loud: Find a quieter environment";
    else if (level > 0.3) return "Moderate: Acceptable but not ideal";
    else return "Quiet: Ideal";
  };

  const animatedStyles = useAnimatedStyle(() => {
    return {
      width: `${meterLevel.value * 100}%`,
      backgroundColor: color.value,
    };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.descriptionText}>
        {getNoiseLevelDescription(meterLevel.value)}
      </Text>
      <View style={styles.meterContainer}>
        <Animated.View style={[styles.meterFill, animatedStyles]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  descriptionText: {
    paddingBottom: 10,
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
  },
  meterContainer: {
    width: "100%",
    height: 20,
    backgroundColor: "lightgray",
    borderRadius: 10,
    overflow: "hidden",
  },
  meterFill: {
    height: "100%",
    borderRadius: 10,
  },
});

export default AudioMeter;
