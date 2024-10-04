import { Button, View } from "react-native";
import { stylesDefault } from "./style";

export default function NewGameScreen({ navigation }: any) {
  return (
    <View style={stylesDefault.container}>
      <Button
        title="Start a new game"
        onPress={() => navigation.navigate("GameScreen")}
      />
    </View>
  );
}
