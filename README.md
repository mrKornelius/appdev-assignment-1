# Apputveckling inlämningsuppgift 1 - React Native

I den här uppgiften fick vi välja att göra en valfri React Native app med Expo och TypeScript.

Jag har valt att använda mig av accelerometern i mobilen för att styra en kula på skärmen genom att luta mobilen i den riktning man vill att kulan ska röra sig. Inspirationen var kommer ifrån klassiska balansspelet labyrint.

![labyrint](labyrint.png)

## Bygga och köra projektet

Börja med att köra `npm install` för att installera alla npm-paket som behövs för att köra projektet. Sedan kan projektet startas med `npm start`.

För att testa appen används Expo-appen på en mobiltelefon, scanna QR-koden som kommer i terminalen, alternativt så kan man köra en emulator från Android Studio. (Appen har inte testats på iOS men bör fungera).

### React Native komponenter

1. View
2. Text
3. Pressable
4. Button

### Expo komponenter

1. Sensors (accelerometer)
2. Haptics
3. StatusBar
4. AsyncStorage

### Ytterligare extern modul

Har använt modulen DialogInput för att få en alert-liknande dialog med ett input-fält efter att man klarat ett spel och ska skriva in sig till high score-listan.

### Uppfyllda krav

- [x] minst 4 RN
- [x] minst 4 Expo
- [x] Readme
- [x] React Navigation
- [x] Git och Github
- [x] ytterligare en extern modul
- [x] använda ett web API
- [ ] Förbered lansering (görs senare)
