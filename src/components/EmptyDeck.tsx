import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { fonts } from "../constants/fonts";
import { useColors } from "../hooks/useColors";

type Props = {
  title: string;
  text: string;
  onAddCard: () => void;
  onSampleDeck?: () => void; // only shown when the deck is really empty
};

export default function EmptyDeck({ title, text, onAddCard, onSampleDeck }: Props) {
  const { colors } = useColors();

  return (
    <View style={styles.container}>
      <Pressable onPress={onAddCard} style={styles.cardsBox}>
        <View style={[styles.dashedCard, styles.backCard2, { borderColor: colors.border }]} />
        <View style={[styles.dashedCard, styles.backCard1, { borderColor: colors.border }]} />
        <View
          style={[
            styles.dashedCard,
            { backgroundColor: colors.surface, borderColor: colors.textTertiary },
          ]}
        >
          <Ionicons name="add" size={44} color={colors.textSecondary} />
        </View>
      </Pressable>

      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.text, { color: colors.textSecondary }]}>{text}</Text>

      <Pressable
        onPress={onAddCard}
        style={[styles.button, { backgroundColor: colors.primary }]}
      >
        <Text style={[styles.buttonText, { color: colors.onPrimary }]}>Add a Card</Text>
      </Pressable>

      {onSampleDeck && (
        <Pressable onPress={onSampleDeck} style={styles.linkButton}>
          <Text style={[styles.linkText, { color: colors.primary }]}>Try a Sample Deck</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  cardsBox: {
    width: 150,
    height: 180,
    marginBottom: 48,
  },
  dashedCard: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    borderWidth: 1.5,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  backCard1: {
    top: 8,
    bottom: -8,
    left: 6,
    right: 6,
  },
  backCard2: {
    top: 16,
    bottom: -16,
    left: 12,
    right: 12,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 22,
    marginBottom: 8,
    textAlign: "center",
  },
  text: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 23,
    textAlign: "center",
    marginBottom: 28,
  },
  button: {
    paddingHorizontal: 32,
    paddingVertical: 15,
    borderRadius: 30,
  },
  buttonText: {
    fontFamily: fonts.bold,
    fontSize: 17,
  },
  linkButton: {
    padding: 12,
    marginTop: 8,
  },
  linkText: {
    fontFamily: fonts.semibold,
    fontSize: 16,
  },
});
