import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, Image, Pressable, Modal, TouchableHighlight, ActivityIndicator, TouchableOpacity } from 'react-native';
import { FontAwesome5, Octicons } from '@expo/vector-icons'; //iconit käyttöön!
import styles from './styles/styles';
import ProductDetails from './ProductDetails'
import ProductEdit from './EditProduct'
import {Picker} from '@react-native-picker/picker' //picker on dropdown-valikko

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

export default function NWTuotteetListModular() {
    // tätä voidaan käyttää silmukassa, jossa mapataan tuotteet
    const [product, setProduct] = useState<Partial<INWProductsResponse>>({});
    const [productItems, setproductItems] = useState<any>([]);
    const [productItemsCount, setproductItemsCount] = useState(0);
    const [ProductId, setProductId] = useState(0);
    const [productDetailsModal, setProductDetailsModal] = useState(false);
    const [productEditModal, setProductEditModal] = useState(false);
    {/*Tuotelistan päivityksen muuttujat*/ }
    const [refreshProducts, setRefreshProducts] = useState(false);
    const [refreshIndicator, setRefreshIndicator] = useState(false);
    //Pickerin muuttuja
    const [dropdownCategory, setDropdownCategory] = useState('All');

    // Kun pressablea painamalla refreshProductsin tila muuttuu trueksi, kun tämä state muuttuu, tämä useEffect laukeaa jolloin se kutsuu GetProductsia
    // joka hakee tuotteet ja asettaa refreshProductsin falseksi.
    useEffect(() => {
        GetProducts();
    }, [refreshProducts]);

    function GetProducts() {
        let uri = 'https://northwindwebapi2021.azurewebsites.net/northwind/product';
        fetch(uri)
            .then(response => response.json())
            .then((json: INWProductsResponse) => {
                setproductItems(json); //Tuotteet kirjoitetaan productItems hgh-array muuttujaan.
                const fetchCount = Object.keys(json).length; //Lasketaan montako tuotenimikettä on yhteensä.
                setproductItemsCount(fetchCount); //Kirjoitetaan tuotenimikkeiden määrä productItemsCount -muuttujaan.
            })
        // Eli kun haku on tehty, se laittaa falseksi kun ei tarvitse enää hakua tehdä
        setRefreshIndicator(false);
    }

    function refreshJsonData() {
        setRefreshProducts(!refreshProducts);
        setRefreshIndicator(true);
    }

    //Tuotteen muokkaus
    function editProductFunc(item: INWProductsResponse) {
        setProduct(item); //asettaa product -hooks objektiin klikatun tuotteen koko recordin
        setProductEditModal(true); //Näytetään edit-ikkuna
    }

    //Modaali-ikkunan sulkeminen
    function closeDetailsModal() {
        setProductDetailsModal(!productDetailsModal);
    }

    function closeEditModal() {
        setProductEditModal(!productEditModal);
    }

    //dropdownin funktio suodattamiseen
    function filterItems(category: string) {
        if (category === 'All') {
            setDropdownCategory('All');
            setRefreshProducts(!refreshProducts);
        } else if (category === 'cat1') {
            setDropdownCategory('cat1');
            setRefreshProducts(!refreshProducts);
        }
    }


    return (
        <View style={[ styles.mainWrapper ]}>
            <View style={[styles.topSection]}>
                <View>
                    <FontAwesome5 name="boxes" size={25} color="#000" />
                </View>
                    <Text style={{ fontSize: 18, color: '#000' }}>{'Tuotteita yhteensä: ' + productItemsCount}</Text>
                <Pressable onPress={() => refreshJsonData()} style={({ pressed }) => [{ backgroundColor: pressed ? 'lightgray' : 'white' }]} >
                    <View>
                        <Octicons name="sync" size={24} color="black" />
                    </View>
                </Pressable>
                <ActivityIndicator size="small" color="#0000ff" animating={refreshIndicator} />{/* ActivityIndicator aktivoituu refreshJsonData() -funktiossa ja se deaktivoidaan GetProducts() -funktiossa */}
            </View>
            {/* Picker-dropdown ylämenuun */}
            <View style={[styles.pickerSection]}>
                        <Picker
                            selectedValue={dropdownCategory}
                            style={{ height: 50, width: 250 }}
                                prompt='Valitse tuoteryhmä'
                                onValueChange={(itemValue, itemIndex) =>
                                filterItems(itemValue.toString())
                            }>
                            <Picker.Item label="Hae kaikki tuoteryhmät" value="All" />
                            <Picker.Item label="Juomat" value="cat1" />
                        </Picker>
            </View>
            <ScrollView>
                {productItems.map((item: INWProductsResponse) => (

                    // kaikissa näissä pitää olla key määritetty, tai herjaa
                    // Jos määritellään yksilöllinen key (ei tarvi olla idGenerator) tälle ylimmän tason elementille, niin childeihin eli muille rivi 150-> ei tarvi sitä laittaa
                    // Eli kun täällä käytetään keynä productId:tä, se riittää yksilöimään nämä tässä
                    <Pressable 
                        key={item.productId} 
                        // asetetaan setProductilla käsiteltävän itemin tiedot product-hooks-muuttujaan
                        onPress={() => {
                            setProduct(item)
                            setProductDetailsModal(true)
                        }}
                        style={({ pressed }) => [{ backgroundColor: pressed ? 'rgba(49, 179, 192, 0.5)' : 'white' }]}
                    >
                        <View key={item.productId.toString()} style={styles.productsContainer}>
                            {/*Mikäli item.imageLink on undefined -> näytetään default -kuva, muuten imageLink*/}
                            <Image source={item.imageLink ? { uri: item.imageLink } : { uri: 'https://scontent.fqlf1-1.fna.fbcdn.net/v/t1.6435-9/174553569_10158502928428655_3102860319614201140_n.jpg?_nc_cat=104&ccb=1-3&_nc_sid=730e14&_nc_ohc=x5FRCk2MXy8AX8KVONq&_nc_ht=scontent.fqlf1-1.fna&oh=065f8e13b4536098e4b912b98a259deb&oe=60C47DA7' }} 
                                style={[styles.centerSection, { height: 60, width: 60, backgroundColor: '#eeeeee', margin: 6, }]} />
                            <View style={{ flexGrow: 1, flexShrink: 1, alignSelf: 'center' }}>
                                <Text style={{ fontSize: 15 }}>{item.productName}</Text>
                                <Text style={{ color: '#8f8f8f' }}>{item.category ? 'Variation: ' + item.category : ''}</Text>
                                {/* jos unitpricea ei ole, näytetään "unitprice is missing", '\u00E1' tulee á -merkki ja '\u20AC' tulee euro-merkki*/}
                                <Text style={{ color: '#333333', marginBottom: 10 }}>{'\u00E1 ' + (item.unitPrice == null ? 'unitprice is missing ' : item.unitPrice.toFixed(2))  + '\u20AC'}</Text>
                            </View>
                            <View style={{ padding: 2, marginRight: 10, marginTop: 30 }}>
                                <TouchableOpacity style={[{ width: 32, height: 32 }]} onPress={() => editProductFunc(item)}>
                                    <Octicons name="pencil" size={24} color="black" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Pressable>
                ))}
                {/* DetailsModal -komponentin kutsu */}
                { productDetailsModal ? (
                    <Modal
                        style={[styles.modalContainer]}
                        animationType="slide"
                        transparent={true}
                        visible={true}
                        >
                            {/* propsien nimethän päättää miksi haluaa, ProductDetails ottaa sitten ne propsit vastaan. Tässä siis kutsutaan ProductDetails-komponenttia */}
                            {/* ja välitettään sille kaksi propsia */}
                            <ProductDetails closeModal={closeDetailsModal} passProductId={product.productId} />
                    </Modal>
                ) : null }

                {/* editProductFunc -komponentti */}
                { productEditModal ? (
                    <Modal 
                    style={[styles.modalContainer]}
                        animationType="none"
                        transparent={true}
                        visible={true}>
                            <ProductEdit closeModal={closeEditModal} refreshAfterEdit={refreshJsonData} passProductId={product.productId} />
                        </Modal>
                ) : null }
            </ScrollView>
        </View>
    );
}