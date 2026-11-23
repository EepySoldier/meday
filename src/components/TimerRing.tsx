import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { fonts } from "../constants/fonts";
import { useColors } from "../hooks/useColors";

const SIZE = 210;
const STROKE = 10;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type Props = {
  secondsLeft: number;
  totalSeconds: number;
};

export function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return minutes + ":" + (rest < 10 ? "0" + rest : rest);
}

export default function TimerRing({ secondsLeft, totalSeconds }: Props) {
  const { colors } = useColors();

  let progress = 0;
  if (totalSeconds > 0) {
    progress = secondsLeft / totalSeconds;
  }

  return (
    <View style={styles.container}>
      {/* rotated -90deg so the blue part starts at the top */}
      <Svg width={SIZE} height={SIZE} style={{ transform: [{ rotate: "-90deg" }] }}>
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={colors.textTertiary}
          strokeOpacity={0.3}
          strokeWidth={STROKE}
          fill="none"
        />
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={colors.primary}
          strokeWidth={STROKE}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE + " " + CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
        />
      </Svg>

      <View style={styles.textBox}>
        <Text style={[styles.time, { color: colors.text }]}>{formatTime(secondsLeft)}</Text>
        <Text style={[styles.of, { color: colors.textSecondary }]}>
          {secondsLeft === 0 ? "Time's up" : "of " + Math.round(totalSeconds / 60) + " min"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SIZE,
    height: SIZE,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  textBox: {
    position: "absolute",
    alignItems: "center",
  },
  time: {
    fontFamily: fonts.bold,
    fontSize: 52,
  },
  of: {
    fontFamily: fonts.regular,
    fontSize: 15,
  },
});
