import 'react-native-gesture-handler';
// Navigaatio-komponentti
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// vector icons tuodaan näin
import { Octicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import HelloWorld from './helloWorld'
import HelloWorldInput from './HelloWorldInput'
import JsonList from './JsonList'
import JsonListPressable from './JsonListPressable';
import YLETekstiTV100 from './YLETekstiTV100'
import YLETekstiTV from './YLETekstiTV'
import NWTuotteetList from './NWTuotteetList'
import NWTuotteetListPop from './NWTuotteetListPop'

export default function App() {

  // Swipe navi-muuttuja
  const Tab = createMaterialTopTabNavigator();
  // Ylärivin ikonien koko
  const iconSize = 22;

  return (
    // Swipe-näkymä
    <NavigationContainer>
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: '#ffffff', //Aktiivisen linkin väri
          inactiveTintColor: '#000000',
          showLabel: false, //näytetäänkö navigaatio vai ei
          labelStyle: { fontSize: 10 },
          showIcon: true, //ikonin näyttö, jos sellainen on määritelty
          indicatorStyle: { height: 50 }, //height 0 is not displayed
          style: { backgroundColor: '#31b3c0', paddingTop: 40, },
        }}
      >
        {/* Varsinaiset "navigointilinkit"*/}
        {/* <Tab.Screen name="HelloWorld" component ={HelloWorld} />
        <Tab.Screen name="HelloWorldInput" component ={HelloWorldInput} />
        <Tab.Screen name="JsonList" component ={JsonList} />
        <Tab.Screen name="JsonListPressable" component ={JsonListPressable} />
        <Tab.Screen name="YLETekstiTV100" component ={YLETekstiTV100} />
        <Tab.Screen name="YLETekstiTV" component ={YLETekstiTV} /> */}

        <Tab.Screen name="HelloWorld" component={HelloWorld} options={{ tabBarIcon: () => <Octicons name="home" color="#333" size={iconSize} /> }} />
            <Tab.Screen name="HelloWorldInput" component={HelloWorldInput} options={{ tabBarIcon: () => <Octicons name="keyboard" color="#333" size={iconSize} /> }} />
            <Tab.Screen name="JsonList" component={JsonList} options={{ tabBarIcon: () => <Octicons name="database" color="#333" size={iconSize} /> }} />
            <Tab.Screen name="JsonListPressable" component={JsonListPressable} options={{ tabBarIcon: () => <Octicons name="desktop-download" color="#333" size={iconSize} /> }} />
            <Tab.Screen name="YLETekstiTV100" component={YLETekstiTV100} options={{ tabBarIcon: () => <Octicons name="broadcast" color="#333" size={iconSize} /> }} />
            <Tab.Screen name="YLETekstiTv" component={YLETekstiTV} options={{ tabBarIcon: () => <Octicons name="versions" color="#333" size={iconSize} /> }} />
            <Tab.Screen name="NWTuotteetListPop" component={NWTuotteetListPop} options={{ tabBarIcon: () => <Octicons name="list-unordered" color="#333" size={iconSize} /> }} />
      </Tab.Navigator>
    </NavigationContainer>

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
