import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, Pressable, Switch, Platform, TextInput } from 'react-native';
import { Octicons } from '@expo/vector-icons'; //iconit käyttöön!
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

//pickeriin tuotekategorioille
interface INWCategories {
    //Typescript-interface
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

const ProductEdit = (props: { passProductId: any, closeModal: any, refreshAfterEdit: any }) => {
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
    const [categories, setCategories] = useState<any>([]);
    const [suppliers, setSuppliers] = useState<any>([]);
    // const [selectedCat, setSelectedCat] = useState<any>();
    const [currentCategory, setCurrentCategory] = useState<any>();
    const [currentSupplier, setCurrentSupplier] = useState<any>();


    //HOX validaatio -jos ei mene läpi, tallenna-painike ei ole aktiivinen
    let validaatio = false;

    useEffect(() => {
        GetCategories();
        GetSuppliers();
        GetProductData();
    }, [props.passProductId]); //aina, kun productId muuttuu, päivitetään useEffect

    //Tuotetietojen haku id:llä tietokannasta
    function GetProductData() {
        let uri = 'https://northwindwebapi2021.azurewebsites.net/northwind/product/' + ProductId;
        fetch(uri)
            .then(response => response.json())
            .then((json: INWProductsResponse) => {
                setProductName(json.productName);
                // asetetaan kategorian ja supplierin nykyiset tiedot currentCategory- ja CurrentSupplier-muuttujiin, jotta saadaan ne pickerin arvoksi
                setCurrentCategory(json.categoryId);
                setCurrentSupplier(json.supplierId);
                setQuantityPerUnit(json.quantityPerUnit);
                setUnitPrice(json.unitPrice.toString());
                setUnitsInStock(json.unitsInStock.toString());
                setUnitsOnOrder(json.unitsOnOrder.toString());
                setReorderLevel(json.reorderLevel.toString());
                setDiscontinued(json.discontinued);
                setImageLink(json.imageLink);
            })
    }

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

    //tuotteen muokkaus, saa parametrinä productNamen. Se tarkistaa, onko menossa nettisivuille (web) vai ei (jolloin oletetaan että se on android)
    //validaatio käsitellään myöhemmin. Jos se menee pieleen, tulee alert että ei voida tallentaa.
    //jos se onnistuu, kutsutaan PutToDB-funktiota await -lisämääreellä, kerrotaan että muokkaus on onnistunut
    //ja sitten tulee refreshAfterEdit, joka asetetaan trueksi ja kutsuva ohjelma saa siitä tiedon.
    async function editProductOnPress(productName: string) {
        if (Platform.OS === 'web') {
            if (validaatio == false) {
                alert('Tuotetta ' + productName + ' ei voi tallentaa tietojen puutteellisuuden vuoksi');
            } else {
                await PutToDB();
                console.log ('Tuotetta ' + productName + ' muokattu onnistuneesti');
                props.refreshAfterEdit(true);
                closeModal();
            }
        } else {
            if (validaatio == false) {
                alert('Tuotetta ' + productName + ' ei voi tallentaa tietojen puutteellisuuden vuoksi');
            } else {
                await PutToDB();
                console.log ('Tuotetta ' + productName + ' muokattu onnistuneesti');
                props.refreshAfterEdit(true);
                closeModal();
            }
        }
    }

    // Funktio, jossa lähetetään uudet annetut tiedot tietokantaan
    function PutToDB() {
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
        const prodeditJSON = JSON.stringify(product);

        const apiUrl = 'https://northwindwebapi2021.azurewebsites.net/northwind/product/' + ProductId;
        fetch(apiUrl, {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json; charset=utf-8"
            },
            body: prodeditJSON //lähetetään konvertoitu data html-bodyssa
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
    } //putTODB päättyy

    //Sulje details-modaali
    function closeModal() {
        props.closeModal(true)
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
                <View key={ProductId}>
                    <View style={styles.topSection}>
                        {/* Kutsuu editProductOnPress-funktiota, kun tallennetaan tiedot */}
                        <Pressable onPress={() => editProductOnPress(ProductName)}>
                            <View><Octicons name="check" size={24} color="green" /></View> 
                        </Pressable>
                    
                        <Pressable onPress={() => closeModal()}>
                            <View><Octicons name="x" size={24} color="black" /></View>
                        </Pressable>
                    </View>

                    <Text style={styles.inputHeaderTitle}>Tuotteen muokkaus:</Text>
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
                    <TextInput style={styles.editInput} 
                        underlineColorAndroid="transparent"
                        onChangeText={val => setProductName(val)}
                        value={ProductName.toString()}
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
                        // jos unitprice on null, laitetaan nolla
                        value={(UnitPrice.toString() == null ? '0' : UnitPrice.toString())}
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
                        value={UnitsInStock.toString()}
                        placeholderTextColor="#9a73ef"
                        autoCapitalize="none"
                        keyboardType='numeric'
                        selectTextOnFocus={true}
                    />
   
                    <Text style={styles.inputTitle}>Hälytysraja:</Text>
                    <TextInput style={styles.editInput}
                        underlineColorAndroid="transparent"
                        onChangeText={val => setReorderLevel(val)}
                        value={ReorderLevel.toString()}
                        placeholderTextColor="#9a73ef"
                        autoCapitalize="none"
                        keyboardType='numeric'
                        selectTextOnFocus={true}
                    />

                    <Text style={styles.inputTitle}>Tilauksessa:</Text>
                    <TextInput style={styles.editInput}
                        underlineColorAndroid="transparent"
                        onChangeText={val => setUnitsOnOrder(val)}
                        value={UnitsOnOrder.toString()}
                        placeholderTextColor="#9a73ef"
                        autoCapitalize="none"
                        keyboardType='numeric'
                        selectTextOnFocus={true}
                    />

                    <Text style={styles.inputTitle}>Kategoria:</Text>
                        <Picker
                            prompt='Valitse tuoteryhmä'
                            // Haetaan nykyinen tuoteryhmä pickerin oletusarvoksi
                            selectedValue={currentCategory}
                            // style={{ height: 50, width: 250 }}
                            style={styles.editPicker}
                            onValueChange={(value) => setCategoryId(value)}
                        >
                        {categoriesList}
                        </Picker>
                    
                    <Text style={styles.inputTitle}>Pakkauksen koko:</Text>
                    <TextInput style={styles.editInput}
                        underlineColorAndroid="transparent"
                        onChangeText={val => setQuantityPerUnit(val)}
                        value={(QuantityPerUnit == null ? '0' : QuantityPerUnit.toString())}
                        placeholderTextColor="#9a73ef"
                        autoCapitalize="none"
                        keyboardType='numeric'
                        selectTextOnFocus={true}
                    />
                    <Text style={styles.inputTitle}>Tavarantoimittaja:</Text>
                        <Picker
                            prompt='Valitse toimittaja'
                            selectedValue={currentSupplier}
                            style={styles.editPicker}
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
                        value={(ImageLink == null ? '' : ImageLink.toString())}
                        placeholderTextColor="#9a73ef"
                        autoCapitalize="none"
                        selectTextOnFocus={true}
                    />
                    
                </View>
            </ScrollView>
        </View> 

    );
}

export default ProductEdit