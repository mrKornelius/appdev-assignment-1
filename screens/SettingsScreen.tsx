import { Alert, Text, View } from "react-native";
import { stylesDefault } from "./style";

export default function SettingsScreen({ navigation }: any) {
  // TODO: type!
  let time = 12345;
  Alert.alert("Nice job!", `Your time: ${(time / 1000).toFixed(2)} seconds.`, [
    { text: "Restart", onPress: () => {} },
    {
      text: "Go back",
      onPress: () => {
        navigation.goBack();
      },
    },
  ]);
  return (
    <View style={stylesDefault.container}>
      <Text>Settings screen</Text>
    </View>
  );
}
