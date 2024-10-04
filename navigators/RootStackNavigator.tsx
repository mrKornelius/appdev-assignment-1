import { NavigatorScreenParams } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GameScreen from "../game/GameScreen";
import HighScoreScreen from "../screens/HighScoreScreen";
import NewGameScreen from "../screens/NewGameScreen";
import SettingsScreen from "../screens/SettingsScreen";
import TabNavigator, { TabParamList } from "./TabNavigator";

export type RootStackParamList = {
  HomeNavigator: NavigatorScreenParams<TabParamList>;
  Settings: undefined;
  NewGameScreen: undefined;
  HighScoreScreen: undefined;
  GameScreen: undefined;
};
const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name="HomeNavigator"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <RootStack.Screen name="Settings" component={SettingsScreen} />
      <RootStack.Screen name="NewGameScreen" component={NewGameScreen} />
      <RootStack.Screen name="HighScoreScreen" component={HighScoreScreen} />
      <RootStack.Screen name="GameScreen" component={GameScreen} />
    </RootStack.Navigator>
  );
}
