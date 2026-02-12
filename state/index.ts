import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import {
  AtomGeneratorOptions,
  atomStateGenerator,
  setCustomStorage,
  storage as webStorage,
  SyncStorage,
  AtomState,
  PrimitiveAtom,
} from "@gaddario98/react-core/state";

const storage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      if (Platform.OS === "web") {
        return webStorage.getItem(key);
      } else {
        return await AsyncStorage.getItem(key);
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
        webStorage.setItem(key, value);
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
        webStorage.removeItem(key);
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
  type SyncStorage,
  type AtomState,
  type PrimitiveAtom,
};
