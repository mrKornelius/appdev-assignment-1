import { useEffect, useState } from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";

type YesNo = {
  answer: string;
  forced: boolean;
  image: string;
};

export default function ApiScreen() {
  const [yesNo, setYesNo] = useState<YesNo>();
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    const fetcher = async () => {
      const response = await fetch("https://yesno.wtf/api");
      const data = await response.json();
      setYesNo(data);
    };
    fetcher();
  }, [toggle]);

  return (
    <View style={s.container}>
      <Text style={s.text}>Answer: {yesNo?.answer}</Text>
      <Image style={s.image} source={{ uri: yesNo?.image }} />
      <Button title="Again?" onPress={() => setToggle(!toggle)} />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
  },
  text: {
    fontSize: 36,
  },
  image: {
    height: 300,
    resizeMode: "contain",
  },
});
