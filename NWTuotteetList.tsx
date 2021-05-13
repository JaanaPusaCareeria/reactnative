import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, Image, Pressable, Modal, TouchableHighlight } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; //iconit käyttöön!
import styles from './styles/styles';

interface INWProductsResponse {
    //Typescript -interface käytetään inventoryItems -muuttujassa json
    productId: number;
    productName: string;
    supplierId: number;
    categoryId: number;
    quantityPerUnit: string;
    unitPrice: number;
    unitsInStock: number;
    unitsOnOrder: number;
    reorderLevel: number;
    discontinued: boolean;
    imageLink: string;
    category: string;
    supplier: string;
    checked: any;
}

export default function NWTuotteetList() {
    const [inventoryItems, setInventoryItems] = useState<any>([]);
    const [inventoryItemsCount, setInventoryItemsCount] = useState(0);
    const [ProductId, setProductId] = useState(0);
    const [productDetailsModal, setProductDetailsModal] = useState(false);

    useEffect(() => {
        GetProducts();
    }, []);

    function GetProducts() {
        let uri = 'https://northwindwebapi2021.azurewebsites.net/northwind/product';
        fetch(uri)
            .then(response => response.json())
            .then((json: INWProductsResponse) => {
                setInventoryItems(json); //Tuotteet kirjoitetaan inventoryItems hgh-array muuttujaan.
                const fetchCount = Object.keys(json).length; //Lasketaan montako tuotenimikettä on yhteensä.
                setInventoryItemsCount(fetchCount); //Kirjoitetaan tuotenimikkeiden määrä inventoryItemsCount -muuttujaan.
            })
    }

    //Jokaiselle komponentille random-key, palautetaan string -tyyppisenä
    // sovellus herjaa, jos jokaisella ei ole yksilöllistä key-tietoa
    function idGenerator() {
        var rnds = function () {
            return (((1 + Math.random()) * 0x10) | 0).toString(16).substring(1);
        };
        return (rnds() + rnds() + "-" + rnds() + "-" + rnds() + "-" + rnds() + "-" + rnds() + rnds() + rnds());
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#f6f6f6' }}>
            <View style={[styles.topSection]}>
                <View style={[styles.centerSection, { width: 50, height: 50 }]}>
                    <FontAwesome5 name="boxes" size={25} color="#000" />
                </View>
                <View style={[styles.centerSection, { height: 50 }]}>
                    <Text style={{ fontSize: 18, color: '#000' }}>Tuotteet</Text>
                    <Text style={{ fontSize: 10, color: '#000' }}>{'Tuotteita yhteensä: ' + inventoryItemsCount}</Text>
                </View>
            </View>
            <ScrollView>
                {inventoryItems.map((item: INWProductsResponse) => (

                    <Pressable key={idGenerator()} onPress={() => {/*this.props.navigation.navigate('ProductDetails', {productDetails: item})*/ }}
                    style={({ pressed }) => [{ backgroundColor: pressed ? 'rgba(49, 179, 192, 0.5)' : 'white' }]}
                    onLongPress={() => {
                        setProductDetailsModal(true);
                    }}
                    >
                        <View key={item.productId.toString()} style={styles.productsContainer}>
                            {/*Mikäli item.imageLink on undefined -> näytetään default -kuva, muuten item.imageLink*/}
                            <Image key={idGenerator()} source={item.imageLink ? { uri: item.imageLink } : { uri: 'https://scontent.fqlf1-1.fna.fbcdn.net/v/t1.6435-9/174553569_10158502928428655_3102860319614201140_n.jpg?_nc_cat=104&ccb=1-3&_nc_sid=730e14&_nc_ohc=x5FRCk2MXy8AX8KVONq&_nc_ht=scontent.fqlf1-1.fna&oh=065f8e13b4536098e4b912b98a259deb&oe=60C47DA7' }} 
                                style={[styles.centerSection, { height: 60, width: 60, backgroundColor: '#eeeeee', margin: 6, }]} />
                            <View key={idGenerator()} style={{ flexGrow: 1, flexShrink: 1, alignSelf: 'center' }}>
                                <Text key={idGenerator()} style={{ fontSize: 15 }}>{item.productName}</Text>
                                <Text key={idGenerator()} style={{ color: '#8f8f8f' }}>{item.category ? 'Variation: ' + item.category : ''}</Text>
                                {/* jos unitpricea ei ole, näytetään "unitprice is missing", '\u00E1' tulee á -merkki ja '\u20AC' tulee euro-merkki*/}
                                <Text key={idGenerator()} style={{ color: '#333333', marginBottom: 10 }}>{'\u00E1 ' + (item.unitPrice == null ? 'unitprice is missing ' : item.unitPrice.toFixed(2))  + '\u20AC'}</Text>
                            </View>
                        </View>
                    </Pressable>
                ))}
                {/* Modal Starts Here */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={productDetailsModal}
                    onRequestClose={() => {
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Tuotteen tarkemmat tiedot:</Text>
                            <TouchableHighlight
                                style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                                onPress={() => {
                                    setProductDetailsModal(!productDetailsModal);
                                }}
                            >
                                <Text style={styles.textStyle}>Sulje</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </Modal>
                {/* Modal Ends Here */}
            </ScrollView>
        </View>
    );
}