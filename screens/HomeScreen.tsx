import { StyleSheet, View } from "react-native";
import createMazeWithPaths from "../game/generateMaze";

const gridSize = 20;

export default function HomeScreen({ navigation }: any) {
  // TODO: type!

  const maze = createMazeWithPaths();

  return (
    <View style={s.container}>
      {maze.map((row, r) =>
        row.map((cell, c) => (
          // <Text>cell: {`(${r},${c}): ${cell}`}</Text>
          <View
            key={`${r}-${c}`}
            style={[
              s.cell,
              {
                backgroundColor:
                  cell === 0
                    ? "silver"
                    : cell === 1
                    ? "lightgreen"
                    : cell === 2
                    ? "black"
                    : "tomato",
                left: -gridSize / 2,
                top: -gridSize / 2,
                width: gridSize,
                height: gridSize,
              },
              {
                transform: [
                  { translateX: gridSize * c + gridSize / 2 + 5 },
                  { translateY: gridSize * r + gridSize / 2 },
                ],
              },
            ]}
          />
        ))
      )}
      {/* <Text style={{ fontSize: 96, color: "red", zIndex: 100 }}>hejj</Text> */}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  cell: {
    position: "absolute",
    zIndex: -3,
  },
  ball: {
    position: "absolute",
    backgroundColor: "blue",
    borderRadius: 100,
    // opacity: 0.6,
    left: -20,
    top: -20,
    width: 40,
    height: 40,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  goal: {
    position: "absolute",
    backgroundColor: "green",
    zIndex: -1,
  },
});
