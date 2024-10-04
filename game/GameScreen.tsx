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
const BOUNCE_DAMPING = 0.95;
const UPDATE_INTERVAL = 20;

// type Props = NativeStackScreenProps<RootStackParamList, "">;
type Props = CompositeScreenProps<
  NativeStackScreenProps<RootStackParamList, "GameScreen">,
  BottomTabScreenProps<TabParamList>
>;
export default function GameScreen({ navigation }: Props) {
  // export default function GameScreen({ navigation }: any) {
  // setup states
  const startPosition: Coord2d = { x: 60, y: 80 };
  const goal = { x: 100, y: 600 };
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
          // limit velocity change to +/-1[G] (and map x to -x)
          // if the acc is more than 1G the user is trying to cheat by moving the
          // phone fast in a direction...
          x: prev.x - (9.81 * limitOutput(x, -1, 1) * UPDATE_INTERVAL) / 100,
          y: prev.y + (9.81 * limitOutput(y, -1, 1) * UPDATE_INTERVAL) / 100,
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

  useEffect(() => {
    let t = Date.now();
    // limit dt here because the first update has not the correct prev t-value
    // and if there are delays we should not have a dt > 2x UPDATE_INTERVAL.
    let dt = limitOutput(t - time, 0, 2 * UPDATE_INTERVAL);
    // console.log("new velocity dt=", dt);

    setPosition((prev) => {
      // collision detection x
      let newX = prev.x + (velocity.x * dt) / 500;
      if (newX - 50 < 0 || newX > width - 50)
        setVelocity({ x: -BOUNCE_DAMPING * velocity.x, y: velocity.y });

      // collision detection y
      let newY = prev.y + (velocity.y * dt) / 500;
      if (newY - 70 < 0 || newY > height - 90)
        setVelocity({ x: velocity.x, y: -BOUNCE_DAMPING * velocity.y });

      // make sure the ball is inside the game area
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

  const handleSensorToggle = () => setSensorEnabled(!senorEnabled);
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

      <Pressable onPress={handleSensorToggle}>
        {senorEnabled ? "" : <Text style={s.start}>Start</Text>}
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
        message={`You won! Time: ${finishTime / 1000}s`}
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
  start: {
    fontSize: 96,
    margin: 0,
    paddingHorizontal: 25,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 25,
    backgroundColor: "lightgray",
    opacity: 0.7,
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
    left: -25,
    top: -25,
    width: 50,
    height: 50,
    zIndex: -1,
  },
});
