import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({

	//********************************************
	//Inventory.tsx tyylit sekä popup, että edit
	//********************************************
	mainWrapper: {
		flex: 1, 
		backgroundColor: '#f6f6f6',
	},
	topSection: {
		flexDirection: 'row', 
		justifyContent:'space-between',
        backgroundColor: '#fff', 
		padding: 10,
    },
    centerSection: {
        justifyContent: 'center',
		alignItems: 'center',
    },
	centerElement: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	addProductContainer: {
		flex: 1,
		flexDirection: 'row-reverse',
	},
	addProductButton: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	printButton: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		height: 32,
		paddingRight: 20,
		alignItems: 'center',
	},
	totalSum: {
		flexDirection: 'row',
		flexGrow: 1,
		flexShrink: 1,
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	selectAll: {
		flexDirection: 'row',
		paddingRight: 20,
		alignItems: 'center',
	},
	inventoryBottom: {
		backgroundColor: '#fff',
		borderTopWidth: 2,
		borderColor: '#f6f6f6',
		paddingVertical: 5,
	},
	productContainer: {
		flexDirection: 'row',
		flexGrow: 1,
		flexShrink: 1,
		alignSelf: 'center',
		paddingLeft: 12,
	},
	productsContainer: {
		flexDirection: 'row',
		marginBottom: 2,
		height: 120,
		borderTopWidth: 1,
		borderTopColor: '#ccc'
	},
		//*****************************************
		//AddProduct.tsx tyylimääritykset
		//*****************************************

	addProductInputContainer: {
		paddingTop: 23
	},
	input: {
		margin: 15,
		height: 40,
		borderColor: '#7a42f4',
		borderWidth: 1
	},
	submitButton: {
		backgroundColor: '#7a42f4',
		padding: 10,
		margin: 15,
		height: 40,
	},
	submitButtonText: {
		color: 'white'
	},

	//*****************************************
	//EditProduct.tsx tyylimääritykset
	//*****************************************

	editProductContainer: {
		paddingTop: 23
	},
	inputEditTitle: {
		margin: 15,
		fontWeight: 'bold',
		fontSize: 24,
	},
	inputTitle: {
		marginLeft: 15,
		fontWeight: 'bold',
	},
	editInput: {
		margin: 15,
		height: 40,
		borderColor: '#7a42f4',
		borderWidth: 1
	},

	//******************************************
	//MODAL
	//******************************************
	centeredView: {
		flex: 1,
		justifyContent: "space-between",
		marginTop: 22,
	},
	modalView: {
		margin: 20,
		backgroundColor: "white",
		borderRadius: 20,
		padding: 35,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	openButton: {
		backgroundColor: "#F194FF",
		borderRadius: 20,
		padding: 10,
		elevation: 2
	},
	textStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center"
	},
	modalContainer: {
		display: Platform.OS === 'web' ? 'none' : undefined,
		position: Platform.OS === 'web' ? 'absolute' : undefined,
		width: Platform.OS === 'web' ? '100%' : undefined,
		height: Platform.OS === 'web' ? '100%' : undefined,
		left: Platform.OS === 'web' ? 0 : undefined,
		top: Platform.OS === 'web' ? 0 : undefined,
		zIndex: Platform.OS === 'web' ? 1 : undefined,
    },
	modalTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		padding: 8,
		textAlign: 'center',
    },
	modalText: {
		marginBottom: 15,
	},
	modalTextTitle: {
		marginBottom: 15,
		fontWeight: 'bold',
	},
	modalInfo: {
		flexDirection: 'row',
		justifyContent: "space-between",
    }


});

export default styles;