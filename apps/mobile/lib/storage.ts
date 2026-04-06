import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Lit une valeur sérialisée depuis AsyncStorage.
 */
export async function readStorageValue<TValue>(key: string): Promise<TValue | null> {
  const rawValue = await AsyncStorage.getItem(key);
  return rawValue ? (JSON.parse(rawValue) as TValue) : null;
}

/**
 * Écrit une valeur sérialisée dans AsyncStorage.
 */
export async function writeStorageValue(key: string, value: unknown) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

/**
 * Supprime une clé d'AsyncStorage.
 */
export async function removeStorageValue(key: string) {
  await AsyncStorage.removeItem(key);
}
