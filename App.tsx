import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import HighScoreProvider from "./contexts/useHighScore";
import RootStackNavigator from "./navigators/RootStackNavigator";

export default function App() {
  return (
    <HighScoreProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <RootStackNavigator />
      </NavigationContainer>
    </HighScoreProvider>
  );
}
