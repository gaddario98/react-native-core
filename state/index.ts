import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import {
  AtomGeneratorOptions,
  atomStateGenerator,
  setCustomStorage,
  useLoadingState,
  useLoadingValue,
  useSetLoading,
} from "@gaddario98/react-core/state";
import { compress, decompress } from "lz-string";

const storage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      if (Platform.OS === "web") {
        const compressedValue = localStorage.getItem(key);
        if (compressedValue) {
          const decompressed = decompress(compressedValue);
          return decompressed ?? null;
        }
        return null;
      } else {
        const value = await AsyncStorage.getItem(key);
        return value;
      }
    } catch (error) {
      console.error("Error getting item:", error);
      return null;
    }
  },

  setItem: async (key: string, value: string): Promise<void> => {
    try {
      if (!value) return;
      if (Platform.OS === "web") {
        const compressedValue = compress(value);
        localStorage.setItem(key, compressedValue);
      } else {
        await AsyncStorage.setItem(key, value);
      }
    } catch (error) {
      console.error("Error setting item:", error);
    }
  },

  removeItem: async (key: string): Promise<void> => {
    try {
      if (Platform.OS === "web") {
        localStorage.removeItem(key);
      } else {
        await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  },
};

export const setReactNativeStorage = () => setCustomStorage(storage);

export {
  type AtomGeneratorOptions,
  atomStateGenerator,
  storage,
  useLoadingState,
  useLoadingValue,
  useSetLoading,
};
