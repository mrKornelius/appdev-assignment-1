import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Haptic from "expo-haptics";
import { Accelerometer } from "expo-sensors";
import { Subscription } from "expo-sensors/build/Pedometer";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import DialogInput from "react-native-dialog-input";
import { useHighScore } from "../contexts/useHighScore";
import { RootStackParamList } from "../navigators/RootStackNavigator";
import { TabParamList } from "../navigators/TabNavigator";
import { Coord2d, distance, limitOutput } from "./utils";

const { width, height } = Dimensions.get("window");
// const gridSize = Math.min(width / area[0].length, height / area.length);
// const offset = gridSize / 2;
const BOUNCE_DAMPING = 0.95;
const UPDATE_INTERVAL = 20;

type Props = CompositeScreenProps<
  NativeStackScreenProps<RootStackParamList, "GameScreen">,
  BottomTabScreenProps<TabParamList>
>;
export default function GameScreen({ navigation }: Props) {
  // setup states
  const startPosition: Coord2d = { x: 100, y: 100 };
  const goal: Coord2d = { x: 100, y: 600 };
  const [position, setPosition] = useState({ ...startPosition });
  const [velocity, setVelocity] = useState<Coord2d>({ x: 0, y: 0 });
  const [time, setTime] = useState(Date.now());
  const [senorEnabled, setSensorEnabled] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [finishTime, setFinishTime] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const { addHighScore } = useHighScore();

  useEffect(() => {
    let subscription: Subscription;
    if (senorEnabled) {
      subscription = Accelerometer.addListener(({ x, y }) => {
        setVelocity((prev) => ({
          // limit velocity change to +/-2 and map x to -x
          x: prev.x - limitOutput(x, -2, 2),
          y: prev.y + limitOutput(y, -2, 2),
        }));
      });
      Accelerometer.setUpdateInterval(UPDATE_INTERVAL);
      setStartTime(Date.now());
    } else {
      if (Accelerometer.hasListeners()) {
        Accelerometer.removeAllListeners();
      }
    }
    return () => subscription?.remove();
  }, [senorEnabled]);

  const handleGyroToggle = () => setSensorEnabled(!senorEnabled);

  useEffect(() => {
    let t = Date.now();
    let dt = limitOutput(t - time, 0, 2 * UPDATE_INTERVAL);
    // console.log("new velocity dt=", dt);

    setPosition((prev) => {
      let newX = prev.x + (velocity.x * dt) / 500;
      if (newX - 50 < 0 || newX > width - 50)
        setVelocity({ x: -BOUNCE_DAMPING * velocity.x, y: velocity.y });

      let newY = prev.y + (velocity.y * dt) / 500;
      if (newY - 70 < 0 || newY > height - 90)
        setVelocity({ x: velocity.x, y: -BOUNCE_DAMPING * velocity.y });

      return {
        x: limitOutput(newX, 50, width - 50),
        y: limitOutput(newY, 70, height - 90),
      };
    });
    setTime(t);
  }, [velocity]);

  useEffect(() => {
    checkGoal();
  }, [position]);

  const showGameFinishedDialog = () => setShowDialog(true);
  const checkGoal = () => {
    if (distance(position, goal) < 36) {
      Accelerometer.removeAllListeners();

      setFinishTime(Date.now() - startTime);
      Haptic.notificationAsync(Haptic.NotificationFeedbackType.Success);
      showGameFinishedDialog();
    }
  };

  return (
    <SafeAreaView style={s.container}>
      <View
        style={{
          position: "absolute",
          top: 50,
          left: 30,
          width: width - 60,
          height: height - 120,
          borderWidth: 2,
        }}
      />
      {/* <Text>
        p: ({position.x.toFixed(2)}, {position.y.toFixed(2)})
      </Text>
      <Text>
        v: ({velocity.x.toFixed(2)}, {velocity.y.toFixed(2)})
      </Text>
      <Text>
        w:{width.toFixed(0)}, h:{height.toFixed(0)}
      </Text>
      <Pressable
        onPress={() => {
          setVelocity({ x: 0, y: 0 });
          setPosition({ ...startPosition });
        }}
      >
        <Text style={{ fontSize: 24 }}>RESET</Text>
      </Pressable>
      <Text style={{ fontSize: 36 }}>Acc. test</Text> */}
      <Pressable onPress={handleGyroToggle}>
        <Text style={{ fontSize: 96 }}>{senorEnabled ? "" : "start"}</Text>
      </Pressable>

      <View
        style={[
          s.ball,
          {
            transform: [{ translateX: position.x }, { translateY: position.y }],
          },
        ]}
      />
      <View
        style={[
          s.goal,
          {
            transform: [{ translateX: goal.x }, { translateY: goal.y }],
          },
        ]}
      />
      <DialogInput
        isDialogVisible={showDialog}
        title="Congratulations"
        message={`You won! Time: ${finishTime / 1000}`}
        hintInput="name"
        submitInput={(inputText) => {
          addHighScore({
            name: inputText,
            time: finishTime / 1000,
            date: new Date().toISOString(),
            score: 0,
            maxLevel: 0,
          });
          navigation.navigate("HighScoreScreen");
        }}
        closeDialog={() => {
          setShowDialog(false);
          navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  ball: {
    position: "absolute",
    backgroundColor: "teal",
    borderRadius: 100,
    top: -20,
    left: -20,
    width: 40,
    height: 40,
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

// <View style={s.container}>
//   <Pressable onPress={() => alert("lol")}>
//     <Text style={s.text}>
//       x: {position.x.toFixed(2)} y: {position.y.toFixed(2)}
//     </Text>
//   </Pressable>

//  {area.map((row, r) =>
//   row.map((cell, c) => (
//     // <Text>cell: {`(${r},${c}): ${cell}`}</Text>
//     <View
//       key={c + "-" + r}
//       style={[
//         s.cell,
//         {
//           backgroundColor:
//             cell === 0
//               ? "silver"
//               : cell === 1
//               ? "lightgreen"
//               : cell === 2
//               ? "black"
//               : "tomato",
//           left: -gridSize / 2,
//           top: -gridSize / 2,
//           width: gridSize,
//           height: gridSize,
//         },
//         {
//           transform: [
//             { translateX: gridSize * c + offset },
//             { translateY: gridSize * r + offset },
//           ],
//         },
//       ]}
//     />
//   ))
// )}
// </View>
