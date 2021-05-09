import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, Image, Pressable, Modal, TouchableHighlight } from 'react-native';
import { FontAwesome5, Octicons } from '@expo/vector-icons'; //iconit käyttöön!
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

export default function NWTuotteetListPop() {
    // tätä voidaan käyttää silmukassa, jossa mapataan tuotteet
    const [product, setProduct] = useState<Partial<INWProductsResponse>>({});
    const [inventoryItems, setInventoryItems] = useState<any>([]);
    const [inventoryItemsCount, setInventoryItemsCount] = useState(0);
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
                setInventoryItems(json); //Tuotteet kirjoitetaan inventoryItems hgh-array muuttujaan.
                const fetchCount = Object.keys(json).length; //Lasketaan montako tuotenimikettä on yhteensä.
                setInventoryItemsCount(fetchCount); //Kirjoitetaan tuotenimikkeiden määrä inventoryItemsCount -muuttujaan.
            })
        // Eli kun haku on tehty, se laittaa falseksi kun ei tarvitse enää hakua tehdä
        setRefreshIndicator(false);
    }

    function refreshJsonData() {
        setRefreshProducts(!refreshProducts);
        setRefreshIndicator(true);
    }

    //Jokaiselle komponentille random-key, palautetaan string -tyyppisenä
    // sovellus herjaa, jos jokaisella ei ole yksilöllistä key-tietoa
    function idGenerator() {
        var rnds = function () {
            return (((1 + Math.random()) * 0x10) | 0).toString(16).substring(1);
        };
        return (rnds() + rnds() + "-" + rnds() + "-" + rnds() + "-" + rnds() + "-" + rnds() + rnds() + rnds());
    }

    //Tuotetietojen näyttäminen
    function showDetails(id: number, name: string, suppid: number, catid: number, quantityp: string, price: number, instock: number, onorder: number, reorderlvl: number, disco: boolean, imglnk: string, cat: any, supp: any ) {
        //console.log(id + name + suppid + catid + quantityp + price + instock + onorder + reorderlvl + disco + imglnk)
        setProductDetailsModal(true),
        setProductId(id),
        setProductName(name),
        setSupplierId(suppid),
        setCategoryId(catid),
        setQuantityPerUnit(quantityp),
        setUnitPrice(price),
        setUnitsInStock(instock),
        setUnitsOnOrder(onorder),
        setReorderLevel(reorderlvl),
        setDiscontinued(disco)
        if (imglnk !== null) {
            setImageLink(imglnk);
        }
        else {
            setImageLink('');
        }
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
                <View style={[styles.centerSection, { height: 50 }]}>
                    <Text style={{ fontSize: 18, color: '#000' }}>{'Tuotteita yhteensä: ' + inventoryItemsCount}</Text>
                </View>
                <Pressable onPress={() => refreshJsonData()} style={({ pressed }) => [{ backgroundColor: pressed ? 'lightgray' : 'white' }]} >
                    <View>
                        <Octicons name="sync" size={24} color="black" />
                    </View>
                </Pressable>
            </View>
            <ScrollView>
                {inventoryItems.map((item: INWProductsResponse) => (

                    // kaikissa näissä pitää olla key määritetty, tai herjaa
                    // Jos määritellään yksilöllinen key (ei tarvi olla idGenerator) tälle ylimmän tason elementille, niin childeihin eli muille rivi 150-> ei tarvi sitä laittaa
                    <Pressable 
                        key={idGenerator()} 
                        onPress={() => {
                            showDetails(
                                item.productId,
                                item.productName,
                                item.supplierId,
                                item.categoryId,
                                item.quantityPerUnit,
                                item.unitPrice,
                                item.unitsInStock,
                                item.unitsOnOrder,
                                item.reorderLevel,
                                item.discontinued,
                                item.imageLink,
                                item.category,
                                item.supplier
                            )
                        }}
                        style={({ pressed }) => [{ backgroundColor: pressed ? 'rgba(49, 179, 192, 0.5)' : 'white' }]}
                    >
                        <View key={item.productId.toString()} style={styles.productsContainer}>
                            {/*Mikäli item.imageLink on undefined -> näytetään default -kuva, muuten item.imageLink*/}
                            <Image source={item.imageLink ? { uri: item.imageLink } : { uri: 'https://www.tibs.org.tw/images/default.jpg' }} 
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
                                <Text style={styles.modalTextTitle}>{'Product Id: '}</Text>
                                <Text style={styles.modalText}>{ProductId}</Text>
                            </View>
                            <View style={styles.modalInfo}>
                                <Text style={styles.modalTextTitle}>{'Product Name: '}</Text>
                                <Text style={styles.modalText}>{ProductName}</Text>
                            </View>
                            <View style={styles.modalInfo}>
                                <Text style={styles.modalTextTitle}>{'Supplier Id: '}</Text>
                                <Text style={styles.modalText}>{SupplierId}</Text>
                            </View>
                            <View style={styles.modalInfo}>
                                <Text style={styles.modalTextTitle}>{'Category Id: '}</Text>
                                <Text style={styles.modalText}>{CategoryId}</Text>
                            </View>
                            <View style={styles.modalInfo}>
                                <Text style={styles.modalTextTitle}>{'Quantity Per Unit: '}</Text>
                                <Text style={styles.modalText}>{QuantityPerUnit}</Text>
                            </View>
                            <View style={styles.modalInfo}>
                                <Text style={styles.modalTextTitle}>{'Unit Price: '}</Text>
                                <Text style={styles.modalText}>{UnitPrice}</Text>
                            </View>
                            <View style={styles.modalInfo}>
                                <Text style={styles.modalTextTitle}>{'Units In Stock: '}</Text>
                                <Text style={styles.modalText}>{UnitsInStock}</Text>
                            </View>
                            <View style={styles.modalInfo}>
                                <Text style={styles.modalTextTitle}>{'Units On Order: '}</Text>
                                <Text style={styles.modalText}>{UnitsOnOrder}</Text>
                            </View>
                            <View style={styles.modalInfo}>
                                <Text style={styles.modalTextTitle}>{'Reorder Level: '}</Text>
                                <Text style={styles.modalText}>{ReorderLevel}</Text>
                            </View>
                            <View style={styles.modalInfo}>
                                <Text style={styles.modalTextTitle}>{'Discontinued: '}</Text>
                                <Text style={styles.modalText}>{Discontinued.toString()}</Text>
                            </View>
                            <View style={styles.modalInfo}>
                                <Text style={styles.modalTextTitle}>{'Image: '}</Text>
                            </View>
                            <Image source={ImageLink ? { uri: ImageLink } : { uri: 'https://www.tibs.org.tw/images/default.jpg' }} style={[styles.centerElement, { height: 60, width: 60, backgroundColor: '#eee', margin: 6, alignSelf: 'center' }]} />


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