import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, Image, Pressable, TouchableHighlight, Switch, Platform, TextInput } from 'react-native';
import { FontAwesome5, Octicons } from '@expo/vector-icons'; //iconit käyttöön!
import styles from './styles/styles';
import {Picker} from '@react-native-picker/picker'

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

interface INWCategories {
    categoryId: number;
    categoryName: string;
    description: string;
    picture: string;
}

interface INWSuppliers {
    supplierId: number;
    companyName: string;
    contactName: string;
    contactTitle: string;
    address: string;
    city: string;
    region: number;
    postalCode: string;
    country: string;
    phone: string;
    fax: string;
    homePage: string;
}


const CreateProduct = (props: { closeModal: any, refreshAfterEdit: any }) => {
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
    const [categories, setCategories] = useState<any>([]);
    const [suppliers, setSuppliers] = useState<any>([]);
    //HOX validaatio -jos ei mene läpi, tallenna-painike ei ole aktiivinen
    let validaatio = false;

    useEffect(() => {
        GetCategories();
        GetSuppliers();
    }, []);

    function GetCategories() {
        let uri = 'https://northwindwebapi2021.azurewebsites.net/northwind/product/getcat';
        fetch(uri)
            .then(response => response.json())
            .then((json: INWCategories) => {
                setCategories(json);
                })
        }

    function GetSuppliers() {
        let uri = 'https://northwindwebapi2021.azurewebsites.net/northwind/product/getsupplier';
        fetch(uri)
            .then(response => response.json())
            .then((json: INWSuppliers) => {
                setSuppliers(json);
                })
        }

    const categoriesList = categories.map((cat: INWCategories, index: any) => {
        return (
            <Picker.Item label={cat.categoryId.toString() + '   -   ' + cat.categoryName} value={cat.categoryId} key={index} />
        )
    });

    const supplierList = suppliers.map((supplier: INWSuppliers, index: any) => {
        return (
            <Picker.Item label={supplier.supplierId.toString() + '   -   ' + supplier.companyName} value={supplier.supplierId} key={index} />
        )
    });

    //tuotteen lisäys, saa parametrinä productNamen. Se tarkistaa, onko menossa nettisivuille (web) vai ei (jolloin oletetaan että se on android)
    //jos se onnistuu, kutsutaan PostToDB-funktiota await -lisämääreellä, kerrotaan että muokkaus on onnistunut
    //ja sitten tulee refreshAfterEdit, joka asetetaan trueksi ja kutsuva ohjelma saa siitä tiedon.
    async function createProductOnPress(productName: string) {
        if (Platform.OS === 'web') {
            if (validaatio == false) {
                alert('Tuotetta ' + productName + ' ei voi tallentaa tietojen puutteellisuuden vuoksi');
            } else {
                await PostToDB();
                console.log ('Tuote ' + productName + ' Lisätty');
                closeModalAndRefresh();
            }
        } else {
            if (validaatio == false) {
                alert('Tuotetta ' + productName + ' ei voi tallentaa tietojen puutteellisuuden vuoksi');
            } else {
                await PostToDB();
                console.log ('Tuote ' + productName + ' Lisätty');
                closeModalAndRefresh();
            }
        }
    }

    // Funktio, jossa lähetetään uudet annetut tiedot tietokantaan
    function PostToDB() {
        const product =
        {
            ProductName: ProductName,
            SupplierId: Number(SupplierId),
            CategoryID: Number(CategoryId),
            UnitPrice: parseFloat(Number(UnitPrice).toFixed(2)),
            UnitsInStock: Number(UnitsInStock),
            UnitsOnOrder: Number(UnitsOnOrder),
            ReorderLevel: Number(ReorderLevel),
            Discontinued: Boolean(Discontinued),
            ImageLink: ImageLink,
        };

        //konvertoidaan muuttuja JSON-string-tyyppiseksi
        const prodcreateJSON = JSON.stringify(product);
        //console.log(prodcreateJSON);

        const apiUrl = 'https://northwindwebapi2021.azurewebsites.net/northwind/product/';
        fetch(apiUrl, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json; charset=utf-8"
            },
            body: prodcreateJSON //lähetetään konvertoitu data html-bodyssa
        })
            .then((response) => response.json())
            .then((json) => {
                const success = json;
                if (success) {
                    console.log(success);
                } else {
                    console.log('Error updating ' + ProductName)
                }
            });
    } //postTODB päättyy

    //Sulje details-modaali
    function closeModal() {
        props.closeModal()
    }

    //suljetaan ikkuna ja päivitetään lista
    function closeModalAndRefresh() {
        props.closeModal();
        props.refreshAfterEdit();
    }

    //validointi
    function priceValidation(price: string, field: string) {
        //alert(price);
        //alert(typeof(price));
        if ((price == '') || (price === null) || (price.indexOf(',') > 0)) {
            validaatio = false;
            return false;
        } else {
            validaatio = true;
            return true;
        }
    }

    //returnissa sitten input-kentät
    //styles-tiedoston muokkaukset käyty hakemassa valmiista koodista
    return (
        <View style={styles.inputContainer}>
            <ScrollView>
                <View>
                    <View style={styles.topSection}>
                        {/* Kutsuu editProductOnPress-funktiota, kun tallennetaan tiedot */}
                        <Pressable onPress={() => createProductOnPress(ProductName)}>
                            <View><Octicons name="check" size={24} color="green" /></View> 
                        </Pressable>
                    
                        <Pressable onPress={() => closeModal()}>
                            <View><Octicons name="x" size={24} color="black" /></View>
                        </Pressable>
                    </View>

                    <Text style={styles.inputHeaderTitle}>Tuotteen lisäys:</Text>

                    <Text style={styles.inputTitle}>Nimi:</Text>
                    <TextInput style={styles.editInput} 
                        underlineColorAndroid="transparent"
                        onChangeText={val => setProductName(val)}
                        // ei ole placeholderia missään, joten nämä voisi poistaa mutta annetaan olla
                        placeholderTextColor="#9a73ef"
                        autoCapitalize="none"
                        // kun tuotteen nimi-kenttää klikataan, se automaattisesti valitsee sen ja voi alkaa kirjoittaa
                        // uutta nimeä
                        selectTextOnFocus={true}  
                    />
                    { ProductName ? null: ( <Text style={styles.validationError}>Anna tuotteen nimi</Text>)}

                    <Text style={styles.inputTitle}>Hinta:</Text>
                    <TextInput style={styles.editInput}
                        underlineColorAndroid="transparent"
                        onChangeText={val => setUnitPrice(val)}
                        placeholderTextColor="#9a73ef"
                        autoCapitalize="none"
                        // mobiililaitteessa kätevää ettei näytä aakkosia kun klikataan tätä
                        keyboardType='numeric'
                        selectTextOnFocus={true}
                    />
                    { priceValidation(UnitPrice, 'UnitPrice') == true ? null : ( <Text style={styles.validationError}>Anna hinta muodossa n.zz!</Text>)}
                    
                    <Text style={styles.inputTitle}>Varastossa:</Text>
                    <TextInput style={styles.editInput}
                        underlineColorAndroid="transparent"
                        onChangeText={val => setUnitsInStock((val))}
                        placeholderTextColor="#9a73ef"
                        autoCapitalize="none"
                        keyboardType='numeric'
                        selectTextOnFocus={true}
                    />
   
                    <Text style={styles.inputTitle}>Hälytysraja:</Text>
                    <TextInput style={styles.editInput}
                        underlineColorAndroid="transparent"
                        onChangeText={val => setReorderLevel(val)}
                        placeholderTextColor="#9a73ef"
                        autoCapitalize="none"
                        keyboardType='numeric'
                        selectTextOnFocus={true}
                    />

                    <Text style={styles.inputTitle}>Tilauksessa:</Text>
                    <TextInput style={styles.editInput}
                        underlineColorAndroid="transparent" 
                        onChangeText={val => setUnitsOnOrder(val)}
                        placeholderTextColor="#9a73ef"
                        autoCapitalize="none"
                        keyboardType='numeric'
                        selectTextOnFocus={true}
                    />
                    <Text style={styles.inputTitle}>Kategoria:</Text>
                        <Picker
                            prompt='Valitse tuoteryhmä'
                            selectedValue={CategoryId}
                            // style={{ height: 50, width: 250 }}
                            style={styles.editInput}
                            onValueChange={(value) => setCategoryId(value)}
                        >
                        {categoriesList}
                        </Picker>

                    <Text style={styles.inputTitle}>Pakkauksen koko:</Text>
                    <TextInput style={styles.editInput}
                        underlineColorAndroid="transparent"
                        onChangeText={val => setQuantityPerUnit(val)}
                        placeholderTextColor="#9a73ef"
                        autoCapitalize="none"
                        keyboardType='numeric'
                        selectTextOnFocus={true}
                    />

                    <Text style={styles.inputTitle}>Tavarantoimittaja:</Text>
                        <Picker
                            prompt='Valitse toimittaja'
                            selectedValue={SupplierId}
                            // style={{ height: 50, width: 250 }}
                            style={{ height: 50, width: 200 }}
                            onValueChange={(value) => setSupplierId(value)}
                        >
                        {supplierList}
                        </Picker>

                    <Text style={styles.inputTitle}>Tuote poistunut:</Text>
                    <View style={{ flexDirection: 'row', marginLeft: 15, }}>
                        <Text style={{ marginRight: 4, }}>Ei</Text>
                        {/* koska boolean tyyppinen, kivempi näyttää vipukytkin. Kun value muuttuu kutsuu set-metodia */}
                        <Switch
                            value={Discontinued}
                            onValueChange={val => setDiscontinued(val)}
                        />
                        <Text style={{ marginLeft: 4, }}>Kyllä</Text>
                    </View>

                    <Text style={styles.inputTitle}>Kuvan linkki:</Text>
                    <TextInput style={styles.editInput}
                        underlineColorAndroid="transparent"
                        onChangeText={val => setImageLink(val)}
                        placeholderTextColor="#9a73ef"
                        autoCapitalize="none"
                        selectTextOnFocus={true}
                    />

                    <Pressable
                        style={styles.submitButton}
                        onPress={
                            () => createProductOnPress(ProductName)
                        }>
                        <Text style={styles.submitButtonText}>{' Lisää tuote '}</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </View> 

    );
}

export default CreateProduct