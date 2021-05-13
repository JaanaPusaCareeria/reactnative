import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, Image, Pressable, Modal, TouchableHighlight, ActivityIndicator } from 'react-native';
import { FontAwesome5, Octicons } from '@expo/vector-icons'; //iconit käyttöön!
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

export default function NWTuotteetListPop() {
    // tätä voidaan käyttää silmukassa, jossa mapataan tuotteet
    const [product, setProduct] = useState<Partial<INWProductsResponse>>({});
    const [productItems, setproductItems] = useState<any>([]);
    const [productItemsCount, setproductItemsCount] = useState(0);
    const [ProductId, setProductId] = useState(0);
    const [productDetailsModal, setProductDetailsModal] = useState(false);
    // Modaalin kentät
    const [ProductName, setProductName] = useState('');
    const [SupplierId, setSupplierId] = useState(0);
    const [CategoryId, setCategoryId] = useState(0);
    const [QuantityPerUnit, setQuantityPerUnit] = useState('');
    const [UnitPrice, setUnitPrice] = useState(0);
    const [UnitsInStock, setUnitsInStock] = useState(0);
    const [UnitsOnOrder, setUnitsOnOrder] = useState(0);
    const [ReorderLevel, setReorderLevel] = useState(0);
    const [Discontinued, setDiscontinued] = useState(false);
    const [ImageLink, setImageLink] = useState('');
    //Modaalin kentät päättyy
    {/*Tuotelistan päivityksen muuttujat*/ }
    const [refreshProducts, setRefreshProducts] = useState(false);
    const [refreshIndicator, setRefreshIndicator] = useState(false);

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

    //Modaali-ikkunan sulkeminen
    function closeModal() {
        setProductDetailsModal(!productDetailsModal);
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
                            {/*Mikäli item.imageLink on undefined -> näytetään default -kuva, muuten item.imageLink*/}
                            <Image source={item.imageLink ? { uri: item.imageLink } : { uri: 'https://scontent.fqlf1-1.fna.fbcdn.net/v/t1.6435-9/174553569_10158502928428655_3102860319614201140_n.jpg?_nc_cat=104&ccb=1-3&_nc_sid=730e14&_nc_ohc=x5FRCk2MXy8AX8KVONq&_nc_ht=scontent.fqlf1-1.fna&oh=065f8e13b4536098e4b912b98a259deb&oe=60C47DA7' }} 
                                style={[styles.centerSection, { height: 60, width: 60, backgroundColor: '#eeeeee', margin: 6, }]} />
                            <View style={{ flexGrow: 1, flexShrink: 1, alignSelf: 'center' }}>
                                <Text style={{ fontSize: 15 }}>{item.productName}</Text>
                                <Text style={{ color: '#8f8f8f' }}>{item.category ? 'Variation: ' + item.category : ''}</Text>
                                {/* jos unitpricea ei ole, näytetään "unitprice is missing", '\u00E1' tulee á -merkki ja '\u20AC' tulee euro-merkki*/}
                                <Text style={{ color: '#333333', marginBottom: 10 }}>{'\u00E1 ' + (item.unitPrice == null ? 'unitprice is missing ' : item.unitPrice.toFixed(2))  + '\u20AC'}</Text>
                            </View>
                        </View>
                    </Pressable>
                ))}
               {/* Modal starts here */}
               <Modal
                    animationType="slide"
                    transparent={true}
                    visible={productDetailsModal}
                    onRequestClose={() => {
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Tuotteen tiedot</Text>
                            <View style={styles.modalInfo}>
                                {/* näissä viitattava productiin, koska map-silmukassa asetettiin setProductiin itemin tiedot kokonaan */}
                                <Text style={styles.modalTextTitle}>{'Product Id: '}</Text>
                                <Text style={styles.modalText}>{product.productId}</Text>
                            </View>
                            <View style={styles.modalInfo}>
                                <Text style={styles.modalTextTitle}>{'Product Name: '}</Text>
                                <Text style={styles.modalText}>{product.productName}</Text>
                            </View>
                            <View style={styles.modalInfo}>
                                <Text style={styles.modalTextTitle}>{'Supplier Id: '}</Text>
                                <Text style={styles.modalText}>{product.supplierId}</Text>
                            </View>
                            <View style={styles.modalInfo}>
                                <Text style={styles.modalTextTitle}>{'Category Id: '}</Text>
                                <Text style={styles.modalText}>{product.categoryId}</Text>
                            </View>
                            <View style={styles.modalInfo}>
                                <Text style={styles.modalTextTitle}>{'Quantity Per Unit: '}</Text>
                                <Text style={styles.modalText}>{product.quantityPerUnit}</Text>
                            </View>
                            <View style={styles.modalInfo}>
                                <Text style={styles.modalTextTitle}>{'Unit Price: '}</Text>
                                <Text style={styles.modalText}>{product.unitPrice}</Text>
                            </View>
                            <View style={styles.modalInfo}>
                                <Text style={styles.modalTextTitle}>{'Units In Stock: '}</Text>
                                <Text style={styles.modalText}>{product.unitsInStock}</Text>
                            </View>
                            <View style={styles.modalInfo}>
                                <Text style={styles.modalTextTitle}>{'Units On Order: '}</Text>
                                <Text style={styles.modalText}>{product.unitsOnOrder}</Text>
                            </View>
                            <View style={styles.modalInfo}>
                                <Text style={styles.modalTextTitle}>{'Reorder Level: '}</Text>
                                <Text style={styles.modalText}>{product.reorderLevel}</Text>
                            </View>
                            <View style={styles.modalInfo}>
                                <Text style={styles.modalTextTitle}>{'Discontinued: '}</Text>
                                <Text style={styles.modalText}>{product.discontinued ? product.discontinued.toString() : 'false'}</Text>
                            </View>
                            <View style={styles.modalInfo}>
                                <Text style={styles.modalTextTitle}>{'Image: '}</Text>
                            </View>
                            <Image source={ImageLink ? { uri: ImageLink } : { uri: 'https://scontent.fqlf1-1.fna.fbcdn.net/v/t1.6435-9/174553569_10158502928428655_3102860319614201140_n.jpg?_nc_cat=104&ccb=1-3&_nc_sid=730e14&_nc_ohc=x5FRCk2MXy8AX8KVONq&_nc_ht=scontent.fqlf1-1.fna&oh=065f8e13b4536098e4b912b98a259deb&oe=60C47DA7' }} style={[styles.centerElement, { height: 60, width: 60, backgroundColor: '#eee', margin: 6, alignSelf: 'center' }]} />


                            <TouchableHighlight
                                style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                                onPress={() => {
                                    closeModal(); //HOX tämä kutsuu siis erillistä funktiota, jossa alla oleva toiminto
                                    // setProductDetailsModal(!productDetailsModal);
                                }}
                            >
                                <Text style={styles.textStyle}>Sulje</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </Modal>
                {/* Modal ends here */}
            </ScrollView>
        </View>
    );
}