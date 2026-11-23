import Ionicons from "@expo/vector-icons/Ionicons";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { cardColorNames } from "../constants/colors";
import { fonts } from "../constants/fonts";
import { addCard, Card, CardInput, CardType, Repeat, updateCard } from "../db/cards";
import { useColors } from "../hooks/useColors";
import BottomSheet from "./BottomSheet";
import OptionSheet from "./OptionSheet";

const durations = [0, 10, 20, 30, 45, 60];

type Props = {
  card?: Card; // when we get a card, we are editing it
  onClose: () => void;
  onSaved: () => void;
};

// Render this only when it should be open: {showForm && <CardForm ... />}
export default function CardForm({ card, onClose, onSaved }: Props) {
  const db = useSQLiteContext();
  const { colors, cardColors } = useColors();

  const [title, setTitle] = useState(card ? card.title : "");
  const [notes, setNotes] = useState(card ? card.notes : "");
  const [type, setType] = useState<CardType>(card ? card.type : "task");
  const [repeat, setRepeat] = useState<Repeat>(card ? card.repeat : "daily");
  const [duration, setDuration] = useState(card ? card.duration : 0);
  const [steps, setSteps] = useState<string[]>(card ? card.steps : []);
  const [color, setColor] = useState(card ? card.color : "peach");
  const [showRepeatSheet, setShowRepeatSheet] = useState(false);

  const canSave = title.trim() !== "";

  async function handleSave() {
    if (!canSave) return;

    const data: CardInput = {
      title: title.trim(),
      notes: notes.trim(),
      type: type,
      repeat: repeat,
      duration: duration,
      // empty steps are thrown away
      steps: steps.map((step) => step.trim()).filter((step) => step !== ""),
      color: color,
    };

    if (card) {
      await updateCard(db, card.id, data);
    } else {
      await addCard(db, data);
    }
    onSaved();
    onClose();
  }

  function changeStep(index: number, text: string) {
    const newSteps = [...steps];
    newSteps[index] = text;
    setSteps(newSteps);
  }

  function removeStep(index: number) {
    const newSteps = steps.filter((step, i) => i !== index);
    setSteps(newSteps);
  }

  return (
    <BottomSheet visible={true} onClose={onClose} tall backgroundColor={colors.sheet}>
      <View style={styles.header}>
        <Pressable onPress={onClose} hitSlop={10}>
          <Text style={[styles.headerButton, { color: colors.primary }]}>Cancel</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {card ? "Edit Card" : "New Card"}
        </Text>
        <Pressable onPress={handleSave} hitSlop={10} disabled={!canSave}>
          <Text
            style={[
              styles.headerButton,
              styles.headerButtonBold,
              { color: canSave ? colors.primary : colors.textTertiary },
            ]}
          >
            {card ? "Save" : "Add"}
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Title and notes */}
        <View style={[styles.group, { backgroundColor: colors.surface }]}>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Title"
            placeholderTextColor={colors.textTertiary}
            style={[styles.titleInput, { color: colors.text, borderBottomColor: colors.border }]}
          />
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Notes (optional)"
            placeholderTextColor={colors.textTertiary}
            multiline
            style={[styles.notesInput, { color: colors.text }]}
          />
        </View>

        {/* Task / Routine switch */}
        <View style={[styles.segmented, { backgroundColor: colors.chip }]}>
          <Pressable
            onPress={() => setType("task")}
            style={[styles.segment, type === "task" && { backgroundColor: colors.surface, elevation: 1 }]}
          >
            <Text style={[styles.segmentText, { color: colors.text }]}>Task</Text>
          </Pressable>
          <Pressable
            onPress={() => setType("routine")}
            style={[styles.segment, type === "routine" && { backgroundColor: colors.surface, elevation: 1 }]}
          >
            <Text style={[styles.segmentText, { color: colors.text }]}>Routine</Text>
          </Pressable>
        </View>

        {type === "routine" && (
          <Pressable
            onPress={() => setShowRepeatSheet(true)}
            style={[styles.group, styles.row, { backgroundColor: colors.surface }]}
          >
            <Text style={[styles.rowText, { color: colors.text }]}>Repeat</Text>
            <View style={styles.rowRight}>
              <Text style={[styles.rowText, { color: colors.textSecondary }]}>
                {repeat === "daily" ? "Daily" : "Weekly"}
              </Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </View>
          </Pressable>
        )}

        {/* Duration chips */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>DURATION</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
          {durations.map((minutes) => {
            const selected = minutes === duration;
            return (
              <Pressable
                key={minutes}
                onPress={() => setDuration(minutes)}
                style={[
                  styles.chip,
                  { backgroundColor: selected ? colors.primary : colors.surface },
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: selected ? colors.onPrimary : colors.text },
                  ]}
                >
                  {minutes === 0 ? "None" : minutes + " min"}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Steps */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>STEPS</Text>
        <View style={[styles.group, { backgroundColor: colors.surface }]}>
          {steps.map((step, index) => (
            <View key={index} style={[styles.stepRow, { borderBottomColor: colors.border }]}>
              <Text style={[styles.stepNumber, { color: colors.textSecondary }]}>{index + 1}</Text>
              <TextInput
                value={step}
                onChangeText={(text) => changeStep(index, text)}
                placeholder="Step"
                placeholderTextColor={colors.textTertiary}
                style={[styles.stepInput, { color: colors.text }]}
                autoFocus={step === "" && index === steps.length - 1}
              />
              <Pressable onPress={() => removeStep(index)} hitSlop={10}>
                <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
              </Pressable>
            </View>
          ))}
          <Pressable onPress={() => setSteps([...steps, ""])} style={styles.addStep}>
            <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
            <Text style={[styles.addStepText, { color: colors.primary }]}>Add Step</Text>
          </Pressable>
        </View>

        {/* Color */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>COLOR</Text>
        <View style={[styles.group, styles.colorsRow, { backgroundColor: colors.surface }]}>
          {cardColorNames.map((name) => (
            <Pressable
              key={name}
              onPress={() => setColor(name)}
              style={[
                styles.colorRing,
                { borderColor: name === color ? colors.primary : "transparent" },
              ]}
            >
              <View style={[styles.colorDot, { backgroundColor: cardColors[name] }]} />
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <OptionSheet
        visible={showRepeatSheet}
        title="Repeat"
        options={[
          { label: "Daily", value: "daily" },
          { label: "Weekly", value: "weekly" },
        ]}
        selected={repeat}
        onSelect={(value) => setRepeat(value as Repeat)}
        onClose={() => setShowRepeatSheet(false)}
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    fontFamily: fonts.semibold,
    fontSize: 17,
  },
  headerButton: {
    fontFamily: fonts.regular,
    fontSize: 17,
  },
  headerButtonBold: {
    fontFamily: fonts.semibold,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  group: {
    borderRadius: 16,
    marginTop: 12,
    overflow: "hidden",
  },
  titleInput: {
    fontFamily: fonts.semibold,
    fontSize: 20,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  notesInput: {
    fontFamily: fonts.regular,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  segmented: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 3,
    marginTop: 20,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  segmentText: {
    fontFamily: fonts.semibold,
    fontSize: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: 20,
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowText: {
    fontFamily: fonts.regular,
    fontSize: 16,
    marginRight: 4,
  },
  sectionTitle: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    marginTop: 24,
    marginLeft: 12,
  },
  chips: {
    marginTop: 10,
    flexGrow: 0,
  },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 22,
    marginRight: 8,
  },
  chipText: {
    fontFamily: fonts.semibold,
    fontSize: 15,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  stepNumber: {
    fontFamily: fonts.regular,
    fontSize: 16,
    width: 24,
  },
  stepInput: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 16,
    paddingVertical: 14,
  },
  addStep: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  addStepText: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    marginLeft: 8,
  },
  colorsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  colorRing: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2.5,
    alignItems: "center",
    justifyContent: "center",
  },
  colorDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.08)",
  },
});
