import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useHighScore } from "../contexts/useHighScore";
import { stylesDefault } from "./style";

export default function HighScoreScreen() {
  const { highScore } = useHighScore();

  return (
    <View style={[stylesDefault.container, { marginTop: 50 }]}>
      <ScrollView>
        {!highScore || highScore.length === 0 ? (
          <Text>No high scores yet!</Text>
        ) : (
          highScore
            .sort((a, b) => (a.time > b.time ? 1 : -1))
            .map((score, index) => (
              <View key={index} style={s.row}>
                <Text style={s.cell}>{index + 1}.</Text>
                <Text style={s.cell}>{score.name}</Text>
                <Text style={s.cell}>{score.time.toFixed(3)}s</Text>
              </View>
            ))
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: "row",
    minWidth: "50%",
    justifyContent: "space-between",
  },
  cell: { flex: 1 },
});
