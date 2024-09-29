import { Button, Text, View } from "react-native";
import { stylesDefault } from "./style";

export default function NewGameScreen({ navigation }: any) {
  // TODO: type!
  return (
    <View style={stylesDefault.container}>
      <Text>New Game screen</Text>
      <Button
        title="Start..."
        onPress={() => navigation.navigate("GameScreen")}
      />
    </View>
  );
}
