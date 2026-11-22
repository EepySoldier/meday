import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";
import { fonts } from "../constants/fonts";
import { Card } from "../db/cards";
import { useColors } from "../hooks/useColors";

export function getCardLabel(card: Card) {
  if (card.type === "task") {
    return "Task";
  }
  if (card.repeat === "weekly") {
    return "Routine · Weekly";
  }
  return "Routine · Daily";
}

type Props = {
  card: Card;
};

export default function DeckCard({ card }: Props) {
  const { colors, cardColors } = useColors();

  return (
    <View style={[styles.card, { backgroundColor: cardColors[card.color] }]}>
      <View style={styles.topRow}>
        <View style={[styles.iconBox, { backgroundColor: colors.cardIconBox }]}>
          <Ionicons
            name={card.type === "task" ? "checkmark-circle-outline" : "repeat-outline"}
            size={26}
            color={colors.text}
          />
        </View>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {getCardLabel(card)}
        </Text>
      </View>

      <View style={styles.bottom}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={3}>
          {card.title}
        </Text>
        {card.notes !== "" && (
          <Text style={[styles.notes, { color: colors.textSecondary }]} numberOfLines={3}>
            {card.notes}
          </Text>
        )}

        {(card.duration > 0 || card.steps.length > 0) && (
          <View style={[styles.metaRow, { borderTopColor: colors.border }]}>
            {card.duration > 0 && (
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={20} color={colors.text} />
                <Text style={[styles.metaText, { color: colors.text }]}>
                  {card.duration} min
                </Text>
              </View>
            )}
            {card.steps.length > 0 && (
              <View style={styles.metaItem}>
                <Ionicons name="list-outline" size={20} color={colors.text} />
                <Text style={[styles.metaText, { color: colors.text }]}>
                  {card.steps.length} {card.steps.length === 1 ? "step" : "steps"}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 28,
    padding: 24,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.06)",
    elevation: 3,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  label: {
    fontFamily: fonts.semibold,
    fontSize: 14,
  },
  bottom: {},
  title: {
    fontFamily: fonts.bold,
    fontSize: 32,
    lineHeight: 38,
  },
  notes: {
    fontFamily: fonts.regular,
    fontSize: 16,
    marginTop: 8,
  },
  metaRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    marginTop: 20,
    paddingTop: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  metaText: {
    fontFamily: fonts.regular,
    fontSize: 16,
    marginLeft: 6,
  },
});
