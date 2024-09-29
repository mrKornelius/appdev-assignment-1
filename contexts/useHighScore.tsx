import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

type HighScore = {
  name: string;
  maxLevel: number;
  score: number;
  time: number;
  date: string;
};

interface ContextValue {
  highScore: HighScore[];
  addHighScore: (highScore: HighScore) => void;
  clearAll: () => void;
}

const HighScoreContext = createContext({} as ContextValue);

export default function HighScoreProvider({ children }: PropsWithChildren) {
  const [highScore, setHighScore] = useState<HighScore[]>([]);

  const addHighScore = (h: HighScore) => {
    let tmp = [...highScore, h];
    setHighScore(tmp);
    const save = async () => {
      await AsyncStorage.setItem("highScore", JSON.stringify(tmp));
      console.log("added item", h);
    };
    save();
  };

  const clearAll = () => {
    setHighScore([]);
    const clearStorage = async () => {
      await AsyncStorage.removeItem("highScore");
      console.log("cleared!");
    };
    clearStorage();
  };

  useEffect(() => {
    const load = async () => {
      const data = await AsyncStorage.getItem("highScore");
      if (data) setHighScore(JSON.parse(data));
      else setHighScore([]);
    };
    load();
    console.log("stuff loaded!", "items:", highScore.length);
  }, []);

  return (
    <HighScoreContext.Provider value={{ highScore, addHighScore, clearAll }}>
      {children}
    </HighScoreContext.Provider>
  );
}

export const useHighScore = () => useContext(HighScoreContext);
