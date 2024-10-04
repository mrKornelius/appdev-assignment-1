import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function RandomAdvice() {
  const [advice, setAdvice] = useState("");

  useEffect(() => {
    const fetcher = async () => {
      const response = await fetch("https://api.adviceslip.com/advice");
      const data = await response.json();
      setAdvice(data.slip.advice);
    };
    fetcher();
  });

  return (
    <View style={s.container}>
      <View>
        <Text style={s.heading}>Todays Advice</Text>
      </View>
      <View>
        <Text style={s.text}>{advice}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { marginTop: 50 },
  text: {
    fontSize: 18,
    marginHorizontal: 25,
    paddingHorizontal: 5,
    borderWidth: 1,
  },
  heading: {
    backgroundColor: "#555",
    color: "#f5f5f5",
    marginHorizontal: 25,
    fontWeight: "700",
    paddingHorizontal: 5,
  },
});
