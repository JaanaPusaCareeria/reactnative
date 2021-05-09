import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import HelloWorld from './helloWorld'
import HelloWorldInput from './HelloWorldInput'
import JsonList from './JsonList'
import JsonListPressable from './JsonListPressable';
// import YLETekstiTV100 from './YLETekstiTV100'
import YLETekstiTV from './YLETekstiTV'

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.upperx}>
        {/* Tuodaan kuva sivulle */}
        <View style={{ alignItems: 'center' }}>
          <Image style={styles.logoCareeria}
          source={{ uri: 'https://careeria.fi/Static/careeria/careeria_logo_alpha_230x67_once.gif', }}
          />
        </View>
          <Text>Tämä on ensimmäinen React Native</Text>
        </View>
        <View style={styles.centerx}>
          <JsonListPressable />
        </View>
        <View style={styles.lowerx}>
          <YLETekstiTV />
        </View>
          <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5dbb63',
    alignItems: 'center',
    justifyContent: 'center',
  },
  upperx: {
    flex: 1,
    width: '100%',
    backgroundColor: '#5dbb63',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerx: {
    flex: 1,
    width: '100%',
    backgroundColor: '#99edc3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lowerx: {
    flex: 4,
    width: '100%',
    backgroundColor: '#fbfcf8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCareeria: {
    width: 230,
    height: 67,
    margin: 12,
    padding: 20,
  }
});
