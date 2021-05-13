import React, { useEffect, useState } from 'react';
import { Text, View, Image, Modal, TouchableHighlight } from 'react-native';
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


const ProductDetails = (props: { passProductId: any, closeModal: any }) => {
    const [product, setProduct] = useState<Partial<INWProductsResponse>>({});
    // tässä oletusarvona siis propsina saatu passProductId
    const [productId, setProductId] = useState(props.passProductId);

    useEffect(() => {
        GetProductInfo();
    }, [props.passProductId]); //aina, kun productId muuttuu, päivitetään useEffect

    //Tuotetietojen haku id:llä tietokannasta
    function GetProductInfo() {
        let uri = 'https://northwindwebapi2021.azurewebsites.net/northwind/product/' + productId;
        fetch(uri)
            .then(response => response.json())
            .then((json: INWProductsResponse) => {
                setProduct(json); //Tuotteet kirjoitetaan productItems -array-muuttujaan
            })
    }

    //Sulje details-modaali
    function closeModal() {
        props.closeModal(true)
    }

    //Tulostetaan tiedoet

    return (
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
                <Image source={product.imageLink ? { uri: product.imageLink } : { uri: 'https://scontent.fqlf1-1.fna.fbcdn.net/v/t1.6435-9/174553569_10158502928428655_3102860319614201140_n.jpg?_nc_cat=104&ccb=1-3&_nc_sid=730e14&_nc_ohc=x5FRCk2MXy8AX8KVONq&_nc_ht=scontent.fqlf1-1.fna&oh=065f8e13b4536098e4b912b98a259deb&oe=60C47DA7' }} style={[styles.centerElement, { height: 60, width: 60, backgroundColor: '#eee', margin: 6, alignSelf: 'center' }]} />

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
    );
}

export default ProductDetails