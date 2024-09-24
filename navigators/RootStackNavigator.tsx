import { NavigatorScreenParams } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SettingsScreen from "../screens/SettingsScreen";
import TabNavigator, { TabParamList } from "./TabNavigator";

export type RootStackParamList = {
  HomeNavigator: NavigatorScreenParams<TabParamList>;
  Settings: undefined;
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
    </RootStack.Navigator>
  );
}
