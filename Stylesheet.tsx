import {Dimensions, StyleSheet} from "react-native";

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const Styles = StyleSheet.create ({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        alignItems: "flex-start",
        padding: 20,
    },

    textInput: {
        height: 45,
        width: '100%',
        borderColor: '#cccccc',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        fontSize: 20,
    },

    header: {
        fontSize: 26,
        padding: 8,
        paddingLeft: 0,
        textAlignVertical: "top",
    },

    text: {
        fontSize: 18,
        padding: 10,
        color: '#444444',
        paddingLeft: 0,
    },

    pressButton: {
        fontSize: 20,
        borderWidth: 10,
        borderColor: '#ffda39',
        backgroundColor: '#ffda39',
        borderRadius: 14,
        textAlign: "center",
        textAlignVertical: "center",
        color: 'black',
        marginTop: 15,
        width: screenWidth * 0.9,
    },

    card: {
        width: screenWidth * 0.432,
        height: screenHeight * 0.384,
        margin: screenWidth * 0.01
    }
});

export default Styles;