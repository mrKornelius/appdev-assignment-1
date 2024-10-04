import { StyleSheet, Text, View } from "react-native";
import RandomAdvice from "../lib/RandomAdvice";

export default function HomeScreen() {
  return (
    <View style={s.container}>
      <Text style={{ fontSize: 36, color: "black" }}>
        Accelerating Ball Game
      </Text>
      <RandomAdvice />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
