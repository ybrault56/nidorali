import type { ComponentProps } from "react";
import { Text } from "react-native";

import { useTheme } from "../../hooks/useTheme";

/**
 * Texte piloté par le thème tenant.
 */
export function ThemedText(props: ComponentProps<typeof Text>) {
  const theme = useTheme();
  return <Text {...props} style={[{ color: theme.text }, props.style]} />;
}
