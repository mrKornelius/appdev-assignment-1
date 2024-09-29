import { Button, Text, View } from "react-native";
import { useHighScore } from "../contexts/useHighScore";

export default function HighScoreScreen() {
  const { highScore, addHighScore, clearAll } = useHighScore();

  const kalle = {
    name: "kalle",
    maxLevel: 2,
    date: new Date().toISOString(),
    score: 123,
    time: 29.345,
  };

  return (
    <View>
      <Button title="Clear storage" onPress={clearAll} />
      <Button title="Add kalle" onPress={() => addHighScore(kalle)} />
      <Text>High Scores!</Text>
      {highScore.map((score, index) => (
        <Text key={index}>
          {index + 1}. {score.name} {score.time}
        </Text>
      ))}
    </View>
  );
}
