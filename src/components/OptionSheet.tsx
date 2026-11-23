import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { fonts } from "../constants/fonts";
import { useColors } from "../hooks/useColors";
import BottomSheet from "./BottomSheet";

export type Option = {
  label: string;
  value: string;
};

type Props = {
  visible: boolean;
  title: string;
  options: Option[];
  selected: string;
  onSelect: (value: string) => void;
  onClose: () => void;
};

// A small sheet with a list of choices, like "Daily / Weekly"
export default function OptionSheet({ visible, title, options, selected, onSelect, onClose }: Props) {
  const { colors } = useColors();

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <View style={styles.list}>
        {options.map((option) => (
          <Pressable
            key={option.value}
            style={[styles.row, { borderBottomColor: colors.border }]}
            onPress={() => {
              onSelect(option.value);
              onClose();
            }}
          >
            <Text style={[styles.rowText, { color: colors.text }]}>{option.label}</Text>
            {option.value === selected && (
              <Ionicons name="checkmark" size={22} color={colors.primary} />
            )}
          </Pressable>
        ))}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.bold,
    fontSize: 20,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  list: {
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowText: {
    fontFamily: fonts.regular,
    fontSize: 17,
  },
});
