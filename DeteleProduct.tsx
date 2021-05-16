import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, Image, Pressable, TouchableHighlight, Switch, Platform, TextInput } from 'react-native';
import { FontAwesome5, Octicons } from '@expo/vector-icons'; 
import styles from './styles/styles';


interface INWProductsResponse {
    //Typescript -interface käytetään productItems -muuttujassa json
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


const DeleteProduct = (props: { passProductId: any, closeModal: any, refreshAfterEdit: any }) => {
    let ProductId = props.passProductId; //propsi, jonka kutsuva ohjelma asettaa tälle komponentille
    const [ProductName, setProductName] = useState('...'); // kolme pistettä on alkuarvo, jota näytetään näyttöä ladattaessa ja sitten kun tiedot on ladattu, näkyy oikea asia
    const [SupplierId, setSupplierId] = useState('0');
    const [CategoryId, setCategoryId] = useState('0');
    const [QuantityPerUnit, setQuantityPerUnit] = useState('0');
    const [UnitPrice, setUnitPrice] = useState('0');
    const [UnitsInStock, setUnitsInStock] = useState('0');
    const [UnitsOnOrder, setUnitsOnOrder] = useState('0');
    const [ReorderLevel, setReorderLevel] = useState('0');
    const [Discontinued, setDiscontinued] = useState(false)
    const [ImageLink, setImageLink] = useState('0');
    //HOX validaatio -jos ei mene läpi, tallenna-painike ei ole aktiivinen
    let validaatio = false;

    useEffect(() => {
        GetProductData();
    }, [props.passProductId]); //aina, kun productId muuttuu, päivitetään useEffect

    //Tuotetietojen haku id:llä tietokannasta
    function GetProductData() {
        let uri = 'https://northwindwebapi2021.azurewebsites.net/northwind/product/' + ProductId;
        fetch(uri)
            .then(response => response.json())
            .then((json: INWProductsResponse) => {
                setProductName(json.productName);
                setSupplierId(json.supplierId.toString());
                setCategoryId(json.categoryId.toString());
                setQuantityPerUnit(json.quantityPerUnit);
                setUnitPrice(json.unitPrice.toString());
                setUnitsInStock(json.unitsInStock.toString());
                setUnitsOnOrder(json.unitsOnOrder.toString());
                setReorderLevel(json.reorderLevel.toString());
                setDiscontinued(json.discontinued);
                setImageLink(json.imageLink);
            })
    }

    async function deleteProductOnPress() {
        await DeleteFromDB();
        props.refreshAfterEdit(true);
        closeModal();
    }

    // Funktio, jossa lähetetään uudet annetut tiedot tietokantaan
    function DeleteFromDB() {
        const apiUrl = 'https://northwindwebapi2021.azurewebsites.net/northwind/product/' + ProductId;
        fetch(apiUrl, {
            method: "DELETE",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json; charset=utf-8"
            },
            body: null
        })
        // Eli tutkitaan fetchin vastausta, onko se success -> kerrotaan että tuote poistettu ja jos ei, annetaan toinen herja
            .then((response) => response.json())
            .then((json) => {
                const success = json;
                if (success) {
                    // console.log(success);
                    alert('Tuote id: ' + ProductId + ' poistettu')
                } else {
                    alert('Tuotteen ' + ProductId + ' poistossa tapahtui virhe')
                }
            });
    } //deleteFromDB päättyy

    //Sulje details-modaali
    function closeModal() {
        props.closeModal(true)
    }

    //returnissa sitten input-kentät
    //styles-tiedoston muokkaukset käyty hakemassa valmiista koodista
    return (
        <View style={styles.inputContainer}>
            <ScrollView>
                <View key={ProductId}>
                    <View style={styles.topSection}>
                        {/* Kutsuu deleteProductOnPress-funktiota, kun tallennetaan tiedot */}
                        <Pressable onPress={() => deleteProductOnPress()}>
                            <View><Octicons name="trashcan" size={24} color="red" /></View> 
                        </Pressable>
                        <Pressable onPress={() => closeModal()}>
                            <View><Octicons name="x" size={24} color="black" /></View>
                        </Pressable>
                    </View>

                    <Text style={styles.inputHeaderTitle}>Tuotteen poisto:</Text>
                    <Text style={styles.inputTitle}>ID:</Text>
                    <TextInput style={styles.inputTitle}
                        underlineColorAndroid="transparent"
                        // viittaa hooks-muuttujaan joka muunnettu string-tyyppiseksi
                        defaultValue={ProductId.toString()}
                        // tekisi isoja kirjaimia automaattiseksi, nyt pois päältä
                        autoCapitalize="none"
                        // editable false, koska id:tä ei voi muokata
                        editable={false}
                    />

                    <Text style={styles.inputTitle}>Nimi:</Text>
                    <TextInput style={styles.inputTitle} 
                        underlineColorAndroid="transparent"
                        value={ProductName.toString()}
                        // ei ole placeholderia missään, joten nämä voisi poistaa mutta annetaan olla
                        autoCapitalize="none"
                        editable={false}
                    />
                    { ProductName ? null: ( <Text style={styles.validationError}>Anna tuotteen nimi</Text>)}

                    <Text style={styles.inputTitle}>Hinta:</Text>
                    <TextInput style={styles.inputTitle}
                        underlineColorAndroid="transparent"
                        // jos unitprice on null, laitetaan nolla
                        value={(UnitPrice.toString() == null ? '0' : UnitPrice.toString())}
                        autoCapitalize="none"
                        // mobiililaitteessa kätevää ettei näytä aakkosia kun klikataan tätä
                        keyboardType='numeric'
                        editable={false}
                    />
                   
                    <Text style={styles.inputTitle}>Varastossa:</Text>
                    <TextInput style={styles.inputTitle}
                        underlineColorAndroid="transparent"
                        value={UnitsInStock.toString()}
                        autoCapitalize="none"
                        keyboardType='numeric'
                        editable={false}
                    />
   
                    <Text style={styles.inputTitle}>Hälytysraja:</Text>
                    <TextInput style={styles.inputTitle}
                        underlineColorAndroid="transparent"
                        value={ReorderLevel.toString()}
                        autoCapitalize="none"
                        keyboardType='numeric'
                        editable={false}
                    />

                    <Text style={styles.inputTitle}>Tilauksessa:</Text>
                    <TextInput style={styles.inputTitle}
                        underlineColorAndroid="transparent"
                        value={UnitsOnOrder.toString()}
                        autoCapitalize="none"
                        keyboardType='numeric'
                        editable={false}
                    />

                    <Text style={styles.inputTitle}>Kategoria:</Text>
                    <TextInput style={styles.inputTitle}
                        underlineColorAndroid="transparent"
                        value={CategoryId.toString()}
                        autoCapitalize="none"
                        keyboardType='numeric'
                        editable={false}
                    />

                    <Text style={styles.inputTitle}>Pakkauksen koko:</Text>
                    <TextInput style={styles.inputTitle}
                        underlineColorAndroid="transparent"
                        value={(QuantityPerUnit == null ? '0' : QuantityPerUnit.toString())}
                        autoCapitalize="none"
                        keyboardType='numeric'
                        editable={false}
                    />

                    <Text style={styles.inputTitle}>Tavarantoimittaja:</Text>
                    <TextInput style={styles.inputTitle}
                        underlineColorAndroid="transparent"
                        value={SupplierId.toString()}
                        autoCapitalize="none"
                        keyboardType='numeric'
                        editable={false}
                    />

                    <Text style={styles.inputTitle}>Tuote poistunut:</Text>
                    <View style={{ flexDirection: 'row', marginLeft: 15, }}>
                        <Text style={{ marginRight: 4, }}>Ei</Text>
                        {/* koska boolean tyyppinen, kivempi näyttää vipukytkin. Kun value muuttuu kutsuu set-metodia */}
                        <Switch
                            value={Discontinued}
                        />
                        <Text style={{ marginLeft: 4, }}>Kyllä</Text>
                    </View>

                    <Text style={styles.inputTitle}>Kuvan linkki:</Text>
                    <TextInput style={styles.inputTitle}
                        underlineColorAndroid="transparent"
                        value={(ImageLink == null ? '' : ImageLink.toString())}
                        autoCapitalize="none"
                        editable={false}
                    />
                    
                </View>
            </ScrollView>
        </View> 

    );
}

export default DeleteProduct