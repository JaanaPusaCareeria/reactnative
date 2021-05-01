import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, Platform, ScrollView, TextInput, Button, TouchableWithoutFeedbackBase } from 'react-native'
import { API_id, API_key } from './APIKeyJHP';

export default function YLETekstiTV() {
    
    const [imageUrl, setUrl] = useState<string>();
    // Ennen kuin mitään sivua on annettu, sivu käynnistetään sivulla 100
    const [inputPage, changeInputPage] = useState(100);

    // Tämä on ylen syntaksin mukainen
    var url = 'https://external.api.yle.fi/v1/teletext/images/' + inputPage + '/1.png?app_id=' + API_id + '&app_key=' + API_key + "&date=" + Date.now.toString();
    return (
        <View style={styles.mainContainer}>
            <ScrollView contentContainerStyle={styles.scrollViewPage}>
                <Text style={styles.title}>YLE TekstiTV pääsivu</Text>
                <View style={styles.separatorLine}></View>
                <View style={styles.searchSection}>
                    <Button title="<<" onPress={() => changeInputPage(inputPage-1)} />
                    {/* changeInputPage vaihtaa inputPageen käyttäjän antaman numeron */}
                    <TextInput
                        style={{ height: 40, borderColor: 'gray', borderWidth: 1, backgroundColor: 'white', fontSize: 22, textAlign: 'center', margin: 2, width: 240 }}
                        onChangeText={(text) => changeInputPage(Number(text))}
                        value={inputPage.toString()}
                    />
                    
                    <Button title=">>" onPress={() => changeInputPage(inputPage+1)} />
                </View>
                <View style={styles.imageSection}>
                    <Image
                        style={styles.yleTextTV}
                        resizeMode={'contain'}
                        source={{
                            uri: url,
                        }}
                    />
                </View>
            </ScrollView>
        </View>


    );
}

//***********************************
//Tyylimäärittelyt
//***********************************
const styles = StyleSheet.create({

    mainContainer: {
        flex: 1, 
    },

    scrollViewPage: {
        justifyContent: 'center',
        paddingTop: 0,
    },

    imageSection: {
        flex: 1,
    },

    searchSection: {
        justifyContent: 'center',
        flex: 2,
        flexDirection: 'row',
    },

    yleTextTV: {
        width: '100%',
        height: Platform.OS === 'android' ? '100%' : 240,
        aspectRatio: 1.5,
        marginTop: 1,
    },

    title: {
        fontSize: 26,
        fontWeight: '300',
        letterSpacing: 7,
        textShadowOffset: { width: 1, height: 1 },
        textShadowColor: '#D1D1D1',
        textAlign: 'center',
    },

    separatorLine: {
        marginVertical: 5,
        height: 1,
        width: '100%',
        backgroundColor: '#eee',
    },

 });