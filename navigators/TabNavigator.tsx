import Ionicons from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HighScoreScreen from "../screens/HighScoreScreen";
import HomeScreen from "../screens/HomeScreen";
import NewGameScreen from "../screens/NewGameScreen";

export type TabParamList = {
  Home: undefined;
  NewGame: undefined;
  HighScore: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ navigation }) => ({
        headerRight: (props) => (
          <Ionicons
            name="settings-outline"
            size={24}
            color={props.tintColor}
            style={{ marginRight: 16 }}
            onPress={() => navigation.navigate("Settings")}
          />
        ),
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: () => (
            <Ionicons name="home-outline" size={36} color="black" />
          ),
        }}
      />
      <Tab.Screen
        name="NewGame"
        component={NewGameScreen}
        options={{
          title: "New Game",
          tabBarIcon: () => (
            <Ionicons name="game-controller-outline" size={36} color="black" />
          ),
        }}
      />
      <Tab.Screen
        name="HighScore"
        component={HighScoreScreen}
        options={{
          title: "High Scores",
          tabBarIcon: () => (
            <Ionicons name="trophy-outline" size={36} color="black" />
            // <Ionicons name="podium-outline" size={24} color="black" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
