import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { Button, View } from "react-native";
import { useHighScore } from "../contexts/useHighScore";
import { RootStackParamList } from "../navigators/RootStackNavigator";
import { TabParamList } from "../navigators/TabNavigator";
import { stylesDefault } from "./style";

type Props = CompositeScreenProps<
  NativeStackScreenProps<RootStackParamList, "Settings">,
  BottomTabScreenProps<TabParamList>
>;
export default function SettingsScreen({ navigation }: Props) {
  const { clearAll } = useHighScore();

  return (
    <View style={stylesDefault.container}>
      <View>
        <Button title="Reset High Score" onPress={clearAll} />
      </View>
    </View>
  );
}
