import { ReactNode } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "../hooks/useColors";

type Props = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  tall?: boolean; // tall sheets take almost the whole screen (New Card form)
  backgroundColor?: string;
};

// Custom drawn sheet so it looks the same on every phone.
// onRequestClose is the Android back button, it works like Cancel.
export default function BottomSheet({ visible, onClose, children, tall, backgroundColor }: Props) {
  const { colors } = useColors();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        {/* Tapping the dark area closes the sheet */}
        <Pressable style={styles.closeArea} onPress={onClose} />

        <View
          style={[
            styles.sheet,
            tall && styles.tallSheet,
            {
              backgroundColor: backgroundColor || colors.surface,
              paddingBottom: insets.bottom + 16,
            },
          ]}
        >
          <View style={[styles.handle, { backgroundColor: colors.textTertiary }]} />
          {children}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  closeArea: {
    flex: 1,
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 8,
  },
  tallSheet: {
    height: "93%",
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 8,
    opacity: 0.6,
  },
});
