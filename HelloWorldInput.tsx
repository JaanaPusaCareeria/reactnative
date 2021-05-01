import React, { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function HelloWorldInput() {
    // Hooks-muuttujia:
    const [counter, setCounter] = useState(0);
    const [name, setName] = useState('');
    const [outputName, changeOutputName] = useState('');
    //taulukko-tyyppinen array-muuttuja joka ottaa vastaan string-tyyppisiä muuttujia
    const [array, setArray] = useState<string[]>([]);

    // Funktio, jota button kutsuu ja changeOutputname päivittää sen outputNameen ja setArray lisää sen taulukkoon. \n on rivinvaihto
    const showName = (name: string) => {
        changeOutputName(name);
        setArray(array => [...array, '\n' + name])
    }

    setTimeout(
        () => setCounter(counter + 1), 1000)


    return (
        // scrollview:n avulla voidaan vierittää näyttöä sormin
        // fadingEdge häivyttää tekstiä sivun ala- ja yläosasta jolloin näkee ehkä helpommin, että tekstiä on lisää
        <View style={styles.container2}>
            <View>
                <Text>Terve maailma!</Text>
            </View>
            <View>
                <Text style={styles.bigCentered}>{counter}</Text>
            </View>
            <View>
                <Text>Anna nimi:</Text>
                {/* Textinput-kenttä, jolla on onChanteText event jota kuunnellaan, tallennetaan tieto nameen */}
                {/* ja kutsutaan setNamea ja sen state päivittyy */}
                <TextInput
                    style = {{ height: 40, borderColor: 'gray', backgroundColor: 'white', padding: 4, borderWidth: 1, margin: 2,}}
                    onChangeText={text => setName(text)}
                    value={name}
                />
                {/* button kutsuu funktiota showName, joka saa parametriksi namen joka asetetaan yllä */}
                <Button 
                    title="Lisää henkilö"
                    onPress={() => showName(name)}
                />
                {/* <Text>{outputName}</Text> */}
                {/* Tuodaan taulukko tähän */}
                <ScrollView style={styles.scrollView} fadingEdgeLength={180}>
                    <Text style= {{fontSize: 20}}>{array}</Text>
                </ScrollView>
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
      padding: 50,
    },
    bigCentered: {
        color: 'blue',
        fontSize: 36,
        textAlign: 'center',
      },
      scrollView: {
        width: '100%',
        marginVertical: 10,
      }
  });

