import type { ComponentProps } from "react";
import { Pressable, Text } from "react-native";

import { useTheme } from "../../hooks/useTheme";

/**
 * Bouton principal tenant-aware.
 */
export function ThemedButton({
  className,
  label,
  ...props
}: ComponentProps<typeof Pressable> & { label: string }) {
  const theme = useTheme();

  return (
    <Pressable
      className={`rounded-2xl px-5 py-4 ${className ?? ""}`}
      style={{ backgroundColor: theme.primary }}
      {...props}
    >
      <Text className="text-center text-base font-semibold text-white">{label}</Text>
    </Pressable>
  );
}
