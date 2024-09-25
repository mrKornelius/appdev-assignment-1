import { Text, View } from "react-native";
import { stylesDefault } from "./style";

export default function HomeScreen() {
  return (
    <View style={stylesDefault.container}>
      <Text>Home screen</Text>
    </View>
  );
}

// const s = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });
