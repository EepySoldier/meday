import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getCardLabel } from "../../components/DeckCard";
import TimerRing from "../../components/TimerRing";
import { fonts } from "../../constants/fonts";
import { Card, getCard, markCardDone } from "../../db/cards";
import { useColors } from "../../hooks/useColors";

export default function TaskScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const db = useSQLiteContext();
  const insets = useSafeAreaInsets();
  const { colors, cardColors } = useColors();

  const [card, setCard] = useState<Card | null>(null);
  const [checkedSteps, setCheckedSteps] = useState<number[]>([]);

  // Timer
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [endTime, setEndTime] = useState<number | null>(null); // null = paused

  useEffect(() => {
    getCard(db, Number(id)).then((loaded) => {
      setCard(loaded);
      if (loaded && loaded.duration > 0) {
        const seconds = loaded.duration * 60;
        setTotalSeconds(seconds);
        setSecondsLeft(seconds);
        setEndTime(Date.now() + seconds * 1000); // timer starts right away
      }
    });
  }, [db, id]);

  // Count down. We use the end time instead of just -1 every second,
  // so the timer stays correct even if the phone was locked for a while.
  useEffect(() => {
    if (endTime === null) return;

    const interval = setInterval(() => {
      const left = Math.max(0, Math.round((endTime - Date.now()) / 1000));
      setSecondsLeft(left);
      if (left === 0) {
        setEndTime(null);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [endTime]);

  function handlePauseResume() {
    if (endTime === null) {
      if (secondsLeft === 0) return;
      setEndTime(Date.now() + secondsLeft * 1000);
    } else {
      setEndTime(null);
    }
  }

  function handleAddFiveMinutes() {
    setTotalSeconds(totalSeconds + 300);
    if (endTime === null) {
      // paused or finished: start again with 5 more minutes
      setSecondsLeft(secondsLeft + 300);
      setEndTime(Date.now() + (secondsLeft + 300) * 1000);
    } else {
      setEndTime(endTime + 300 * 1000);
    }
  }

  function toggleStep(index: number) {
    if (checkedSteps.includes(index)) {
      setCheckedSteps(checkedSteps.filter((i) => i !== index));
    } else {
      setCheckedSteps([...checkedSteps, index]);
    }
  }

  async function handleDone() {
    if (!card) return;
    await markCardDone(db, card.id);
    router.back();
  }

  // Nothing changes in the database, the card just stays in the deck
  function handlePutBack() {
    router.back();
  }

  if (!card) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  const isPaused = endTime === null;

  return (
    <View style={[styles.screen, { backgroundColor: cardColors[card.color] }]}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}
      >
        <View style={styles.topBar}>
          <Pressable
            onPress={handlePutBack}
            style={[styles.roundButton, { backgroundColor: colors.cardButton }]}
          >
            <Ionicons name="chevron-down" size={24} color={colors.text} />
          </Pressable>
        </View>

        <Text style={[styles.label, { color: colors.textSecondary }]}>{getCardLabel(card)}</Text>
        <Text style={[styles.title, { color: colors.text }]}>{card.title}</Text>
        {card.notes !== "" && (
          <Text style={[styles.notes, { color: colors.textSecondary }]}>{card.notes}</Text>
        )}

        {card.duration > 0 && (
          <View style={styles.timerBox}>
            <TimerRing secondsLeft={secondsLeft} totalSeconds={totalSeconds} />
            <View style={styles.timerButtons}>
              <Pressable
                onPress={handlePauseResume}
                style={[styles.pill, { backgroundColor: colors.cardButton }]}
              >
                <Ionicons name={isPaused ? "play" : "pause"} size={18} color={colors.text} />
                <Text style={[styles.pillText, { color: colors.text }]}>
                  {isPaused ? "Resume" : "Pause"}
                </Text>
              </Pressable>
              <Pressable
                onPress={handleAddFiveMinutes}
                style={[styles.pill, { backgroundColor: colors.cardButton }]}
              >
                <Text style={[styles.pillText, { color: colors.text }]}>+5 min</Text>
              </Pressable>
            </View>
          </View>
        )}

        {card.steps.length > 0 && (
          <View style={[styles.stepsBox, { backgroundColor: colors.surface }]}>
            <View style={styles.stepsHeader}>
              <Text style={[styles.stepsTitle, { color: colors.text }]}>Steps</Text>
              <Text style={[styles.stepsCount, { color: colors.textSecondary }]}>
                {checkedSteps.length} of {card.steps.length}
              </Text>
            </View>
            {card.steps.map((step, index) => {
              const checked = checkedSteps.includes(index);
              const isLast = index === card.steps.length - 1;
              return (
                <Pressable key={index} onPress={() => toggleStep(index)} style={styles.stepRow}>
                  {checked ? (
                    <Ionicons name="checkmark-circle" size={28} color={colors.primary} />
                  ) : (
                    <Ionicons name="ellipse-outline" size={28} color={colors.textTertiary} />
                  )}
                  <Text
                    style={[
                      styles.stepText,
                      { color: checked ? colors.textSecondary : colors.text },
                      !isLast && { borderBottomColor: colors.border, borderBottomWidth: 1 },
                    ]}
                  >
                    {step}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + 12 }]}>
        <Pressable onPress={handleDone} style={[styles.doneButton, { backgroundColor: colors.primary }]}>
          <Text style={[styles.doneText, { color: colors.onPrimary }]}>Mark as Done</Text>
        </Pressable>
        <Pressable onPress={handlePutBack} style={styles.putBackButton}>
          <Text style={[styles.putBackText, { color: colors.text }]}>Put Back in Deck</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  roundButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    marginLeft: 4,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 32,
    marginLeft: 4,
    marginTop: 2,
  },
  notes: {
    fontFamily: fonts.regular,
    fontSize: 16,
    marginLeft: 4,
    marginTop: 6,
  },
  timerBox: {
    marginTop: 24,
  },
  timerButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 24,
    marginHorizontal: 6,
  },
  pillText: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    marginLeft: 6,
  },
  stepsBox: {
    borderRadius: 22,
    marginTop: 24,
    paddingLeft: 18,
    paddingTop: 16,
    paddingBottom: 4,
  },
  stepsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 18,
    marginBottom: 4,
  },
  stepsTitle: {
    fontFamily: fonts.semibold,
    fontSize: 18,
  },
  stepsCount: {
    fontFamily: fonts.regular,
    fontSize: 16,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 17,
    paddingVertical: 15,
    marginLeft: 14,
  },
  bottom: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  doneButton: {
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: "center",
  },
  doneText: {
    fontFamily: fonts.bold,
    fontSize: 17,
  },
  putBackButton: {
    alignItems: "center",
    paddingVertical: 14,
  },
  putBackText: {
    fontFamily: fonts.semibold,
    fontSize: 16,
  },
});
