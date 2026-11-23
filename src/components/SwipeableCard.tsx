import Ionicons from "@expo/vector-icons/Ionicons";
import { ReactNode, useState } from "react";
import { Animated, Dimensions, PanResponder, StyleSheet, Text } from "react-native";
import { fonts } from "../constants/fonts";
import { useColors } from "../hooks/useColors";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_LIMIT = 110; // how far you need to drag before it counts as a swipe

type Props = {
  children: ReactNode;
  onSwipeLeft: () => void; // Later
  onSwipeRight: () => void; // Start
};

// Give this a key={card.id} so it starts fresh for every new top card
export default function SwipeableCard({ children, onSwipeLeft, onSwipeRight }: Props) {
  const { colors } = useColors();
  const [position] = useState(() => new Animated.ValueXY());

  function swipeOut(direction: "left" | "right") {
    const x = direction === "right" ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5;
    Animated.timing(position, {
      toValue: { x: x, y: 0 },
      duration: 220,
      useNativeDriver: false,
    }).start(() => {
      if (direction === "right") {
        onSwipeRight();
      } else {
        onSwipeLeft();
      }
      // put the card back in the middle, for when we come back from the task screen
      position.setValue({ x: 0, y: 0 });
    });
  }

  const [panResponder] = useState(() =>
    PanResponder.create({
      // only start dragging when the finger moves sideways a bit, so taps still work
      onMoveShouldSetPanResponder: (event, gesture) => Math.abs(gesture.dx) > 10,
      onPanResponderMove: (event, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy * 0.3 });
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > SWIPE_LIMIT) {
          swipeOut("right");
        } else if (gesture.dx < -SWIPE_LIMIT) {
          swipeOut("left");
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  );

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: ["-12deg", "0deg", "12deg"],
  });
  const startOpacity = position.x.interpolate({
    inputRange: [0, SWIPE_LIMIT],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });
  const laterOpacity = position.x.interpolate({
    inputRange: [-SWIPE_LIMIT, 0],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.container,
        { transform: [{ translateX: position.x }, { translateY: position.y }, { rotate: rotate }] },
      ]}
    >
      {children}

      <Animated.View
        style={[styles.badge, styles.startBadge, { backgroundColor: colors.primary, opacity: startOpacity }]}
      >
        <Ionicons name="play" size={16} color={colors.onPrimary} />
        <Text style={[styles.badgeText, { color: colors.onPrimary }]}>Start</Text>
      </Animated.View>

      <Animated.View
        style={[styles.badge, styles.laterBadge, { backgroundColor: colors.surface, opacity: laterOpacity }]}
      >
        <Ionicons name="arrow-undo" size={16} color={colors.text} />
        <Text style={[styles.badgeText, { color: colors.text }]}>Later</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  badge: {
    position: "absolute",
    top: 110,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
  },
  startBadge: {
    left: 24,
  },
  laterBadge: {
    right: 24,
  },
  badgeText: {
    fontFamily: fonts.bold,
    fontSize: 18,
    marginLeft: 6,
  },
});
