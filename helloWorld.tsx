import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function HelloWorld() {
    const [counter, setCounter] = React.useState(0);

    setTimeout(
        () => setCounter(counter + 1), 1000)


    return (
        <View style={styles.container2}>
            <View>
                <Text>Terve maailma!</Text>
            </View>
            <View>
                <Text style={styles.bigCentered}>{counter}</Text>
            </View>
        </View>
    );
}

// flex liittyy react nativen flexbox-rakenteeseen, jossa näyttö jaetaan kuuteen osaan
const styles = StyleSheet.create({
    container2: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    bigCentered: {
        color: 'blue',
        fontSize: 172,
        textAlign: 'center',
      },
  });

