import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CardForm from "../../components/CardForm";
import DeckCard from "../../components/DeckCard";
import EmptyDeck from "../../components/EmptyDeck";
import { fonts } from "../../constants/fonts";
import { useSettings } from "../../context/SettingsContext";
import {
  addSampleCards,
  Card,
  getAllCards,
  isCardInDeck,
  isDoneToday,
  moveCardToBack,
  shuffleCards,
} from "../../db/cards";
import { useColors } from "../../hooks/useColors";

// Shuffle only once per app start, not every time the tab is opened
let alreadyShuffled = false;

export default function DeckScreen() {
  const db = useSQLiteContext();
  const insets = useSafeAreaInsets();
  const { colors, cardColors } = useColors();
  const { settings } = useSettings();

  const [deck, setDeck] = useState<Card[]>([]);
  const [totalCards, setTotalCards] = useState(0);
  const [doneToday, setDoneToday] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  async function loadCards() {
    if (settings.shuffle && !alreadyShuffled) {
      await shuffleCards(db);
      alreadyShuffled = true;
    }

    const allCards = await getAllCards(db);
    setDeck(allCards.filter((card) => isCardInDeck(card)));
    setTotalCards(allCards.length);
    setDoneToday(allCards.filter((card) => isDoneToday(card)).length);
    setLoading(false);
  }

  // Reload every time we come back to this tab (for example after finishing a task)
  useFocusEffect(
    useCallback(() => {
      loadCards();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

  async function handleLater() {
    if (deck.length === 0) return;
    await moveCardToBack(db, deck[0].id);
    await loadCards();
  }

  function handleStart() {
    if (deck.length === 0) return;
    // TODO: open the task screen
  }

  function handleAddCard() {
    setShowForm(true);
  }

  async function handleSampleDeck() {
    await addSampleCards(db);
    await loadCards();
  }

  let subtitle = "No cards yet";
  if (totalCards > 0) {
    subtitle = deck.length + (deck.length === 1 ? " card" : " cards");
    subtitle += " · " + doneToday + " done today";
  }

  if (loading) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top + 16 }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Deck</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
        </View>
        <Pressable
          onPress={handleAddCard}
          style={[styles.addButton, { backgroundColor: colors.chip }]}
        >
          <Ionicons name="add" size={30} color={colors.primary} />
        </Pressable>
      </View>

      {totalCards === 0 && (
        <EmptyDeck
          title="Your deck is empty"
          text="Add the tasks and routines you want to get to. Then swipe through and pick one when you're ready."
          onAddCard={handleAddCard}
          onSampleDeck={handleSampleDeck}
        />
      )}

      {totalCards > 0 && deck.length === 0 && (
        <EmptyDeck
          title="All done for now"
          text="Every card is finished. Routines come back when it's time to do them again."
          onAddCard={handleAddCard}
        />
      )}

      {deck.length > 0 && (
        <>
          <View style={styles.stack}>
            {/* The two cards behind the top one, only their bottom edge peeks out */}
            {deck.length > 2 && (
              <View
                style={[
                  styles.backCard,
                  styles.backCard2,
                  { backgroundColor: cardColors[deck[2].color] },
                ]}
              />
            )}
            {deck.length > 1 && (
              <View
                style={[
                  styles.backCard,
                  styles.backCard1,
                  { backgroundColor: cardColors[deck[1].color] },
                ]}
              />
            )}
            <DeckCard card={deck[0]} />
          </View>

          {settings.showButtons && (
            <View style={styles.buttonsRow}>
              <View style={styles.buttonWrapper}>
                <Pressable
                  onPress={handleLater}
                  style={[styles.laterButton, { backgroundColor: colors.surface }]}
                >
                  <Ionicons name="arrow-undo-outline" size={26} color={colors.textSecondary} />
                </Pressable>
                <Text style={[styles.buttonLabel, { color: colors.textSecondary }]}>Later</Text>
              </View>
              <View style={styles.buttonWrapper}>
                <Pressable
                  onPress={handleStart}
                  style={[styles.startButton, { backgroundColor: colors.primary }]}
                >
                  <Ionicons name="play" size={30} color={colors.onPrimary} style={{ marginLeft: 4 }} />
                </Pressable>
                <Text style={[styles.buttonLabel, styles.startLabel, { color: colors.text }]}>
                  Start
                </Text>
              </View>
            </View>
          )}
          {!settings.showButtons && <View style={{ height: 24 }} />}
        </>
      )}

      {showForm && (
        <CardForm onClose={() => setShowForm(false)} onSaved={loadCards} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 34,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 15,
    marginTop: 2,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  stack: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 28,
  },
  backCard: {
    position: "absolute",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.06)",
  },
  backCard1: {
    top: 12,
    bottom: -12,
    left: 10,
    right: 10,
  },
  backCard2: {
    top: 24,
    bottom: -24,
    left: 20,
    right: 20,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    marginTop: 12,
    marginBottom: 20,
  },
  buttonWrapper: {
    alignItems: "center",
    marginHorizontal: 18,
  },
  laterButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    elevation: 2,
  },
  startButton: {
    width: 66,
    height: 66,
    borderRadius: 33,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  buttonLabel: {
    fontFamily: fonts.regular,
    fontSize: 13,
    marginTop: 8,
  },
  startLabel: {
    fontFamily: fonts.semibold,
  },
});
