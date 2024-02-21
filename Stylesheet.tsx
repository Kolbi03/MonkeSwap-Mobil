import {Dimensions, StyleSheet} from "react-native";

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const Styles = StyleSheet.create ({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        alignItems: "center",
    },

    textInput: {
        height: 50,
        minWidth:300,
        borderColor: '#cccccc',
        borderWidth: 1,
        borderRadius: 20,
        padding: 10,
        fontSize: 20,
    },

    header: {
        fontSize: 40,
        padding: 8,
        textAlignVertical: "top",
    },

    text: {
        fontSize: 24,
        padding: 10,
    },

    pressButton: {
        fontSize: 20,
        borderWidth: 10,
        borderColor: '#ffda39',
        backgroundColor: '#ffda39',
        borderRadius: 20,
        textAlign: "center",
        textAlignVertical: "center",
        color: 'black',
        marginTop: 15,
        minWidth: 200,
    },

    card: {
        width: screenWidth * 0.45,
        height: screenHeight * 0.384,
        margin: screenWidth * 0.01,
    }
});

export default Styles;