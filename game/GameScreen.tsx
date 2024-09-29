import { Accelerometer } from "expo-sensors";
import { Subscription } from "expo-sensors/build/Pedometer";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Coord = { x: number; y: number; z: number };
type Coord2d = { x: number; y: number };

// const list = useMemo(() => {}, [])
const gridSize = 50;
const area = [
  [0, 0, 0, 2, 0, 0, 0, 2],
  [0, 0, 0, 0, 0, 0, 0, 2],
  [0, 2, 0, 0, 0, 0, 0, 2],
  [0, 2, 0, 2, 0, 0, 0, 2],
  [0, 2, 0, 2, 2, 0, 0, 2],
  [0, 2, 0, 2, 1, 0, 0, 2],
  [0, 2, 0, 0, 0, 0, 0, 2],
  [3, 2, 0, 0, 0, 3, 0, 2],
];
const distance = (p: Coord2d, q: Coord2d) =>
  Math.sqrt(Math.pow(p.x - q.x, 2) + Math.pow(p.y - q.y, 2));

export default function GameScreen({ navigation }: any) {
  //FIXME: type!
  const startPosition: Coord2d = { x: 100, y: 100 };
  const goal: Coord2d = { x: 100, y: 300 };

  const [position, setPosition] = useState({ ...startPosition });
  const [{ x, y, z }, setData] = useState<Coord>({ x: 0, y: 0, z: 0 });

  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const _slow = () => Accelerometer.setUpdateInterval(500);
  const _fast = () => Accelerometer.setUpdateInterval(16);
  const _subscribe = () => {
    setSubscription(Accelerometer.addListener(updatePosition));
    console.log("sub:", subscription);
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  const toggleSubscription = () =>
    subscription ? _unsubscribe() : _subscribe();

  const checkGoal = () => {
    if (distance(position, goal) < 36) {
      Accelerometer.removeAllListeners();

      let time = 12345;
      Alert.alert(
        "Nice job!",
        `Your time: ${(time / 1000).toFixed(2)} seconds.`,
        [
          // {
          //   text: "Restart",
          //   onPress: () => {
          //     console.log(position);
          //     console.log(startPosition);

          //     // setPosition({ x: 100, y: 100 });
          //     setPosition(startPosition);
          //     console.log(position);
          //     _subscribe();
          //   },
          // },
          {
            text: "Go back",
            onPress: () => {
              navigation.goBack();
            },
          },
        ]
      );
    }
  };

  const updatePosition = (event: Coord) => {
    // p += v * dt
    // v += a * dt
    setData(event);
    setPosition({
      x: (position.x += -10 * event.x),
      y: (position.y += 10 * event.y),
    });
    checkGoal();
  };

  return (
    <View style={s.container}>
      <Pressable onPress={() => alert("lol")}>
        <Text style={s.text}>
          x: {position.x.toFixed(2)} y: {position.y.toFixed(2)}
        </Text>
      </Pressable>
      <Text style={s.text}>Accelerometerrr: (in gs where 1g = 9.81 m/s^2)</Text>
      <Text style={s.text}>x: {x.toFixed(6)}</Text>
      <Text style={s.text}>y: {y.toFixed(6)}</Text>
      <Text style={s.text}>z: {z.toFixed(6)}</Text>
      <View style={s.buttonContainer}>
        <TouchableOpacity onPress={toggleSubscription} style={s.button}>
          <Text>{subscription ? "On" : "Off"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={_slow} style={[s.button, s.middleButton]}>
          <Text>Slow</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={_fast} style={s.button}>
          <Text>Fast</Text>
        </TouchableOpacity>
      </View>

      <View
        style={[
          s.goal,
          { transform: [{ translateX: goal.x }, { translateY: goal.y }] },
        ]}
      />
      {area.map((row, r) =>
        row.map((cell, c) => (
          // <Text>cell: {`(${r},${c}): ${cell}`}</Text>
          <View
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
                  { translateX: gridSize * c },
                  { translateY: gridSize * r },
                ],
              },
            ]}
          />
        ))
      )}
      <View
        style={[
          s.ball,
          {
            transform: [{ translateX: position.x }, { translateY: position.y }],
          },
        ]}
      >
        <Text style={{ color: "white", fontSize: 10 }}>x{x.toFixed(2)}</Text>
        <Text style={{ color: "white", fontSize: 10 }}>y{y.toFixed(2)}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  text: {
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "stretch",
    marginTop: 15,
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
    padding: 10,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#ccc",
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
    // borderRadius: 100,
    // opacity: 0.6,
    left: -25,
    top: -25,
    width: 50,
    height: 50,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: -1,
  },
  cell: {
    position: "absolute",
    // left: -25,
    // top: -25,
    // width: 50,
    // height: 50,
    zIndex: -3,
  },
});
