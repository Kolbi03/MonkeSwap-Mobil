import {StyleSheet} from "react-native";

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

    login: {
        fontSize: 40,
        padding: 8,
        textAlignVertical: "top",
        marginTop: 10,
    },

    text: {
        fontSize: 24,
        padding: 14,
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
});

export default Styles;