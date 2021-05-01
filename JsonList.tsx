import React, { useState } from 'react';
import { Button, FlatList, Text, View } from 'react-native';
import styles from './styles'

export default function JsonList() {
    // Muuttuja, johon haettava JSON-data tallennetaan
    const [jsonData, setJsonData] = useState();
    // Haetaan JSON-data jsonplaceholderista ja kirjoitetaan se jsonData -muuttujaan
    const getData = () => {
        fetch("https://jsonplaceholder.typicode.com/todos")
        .then((response) => response.json())
            .then((responseData) => {
                setJsonData(responseData);
            })
    }

    return (
        <View>
            {/* Button kutsuu yllä tehtyä getData-funktiota, joka hakee jsonplaceholderista datan ja asettaa sen jsonData-muuttujaan */}
            <Button
                onPress={() => getData()}
                title="Lataa To do -lista"
                color="#556b2f"
            />
            <FlatList
                // Flatlistille kerrotaan, mitä dataa käytetään
                data={jsonData} 
                // Käyttää JSONista tulevaa avaintietoa
                keyExtractor={(item) => item.id.toString()}
                //  Otetaan objekti item jsonData objektiesiintymästä
                renderItem={({ item }) => (
                    <View>
                        <View style={styles.separatorLine} />
                        <Text style={styles.itemItalic}>UserId: {item.userId.toString()}</Text>
                        <Text style={styles.itemBolded}>Title: {item.title}</Text>
                        <Text>Status: {item.completed.toString()}</Text>
                    </View>
                )}
            />
        </View>
    );
    



}
