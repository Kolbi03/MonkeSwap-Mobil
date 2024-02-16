import React from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";


const Homepage = ({ navigation }) => {
    return(
        <View style={styles.container}>
        <Text>Homepage</Text>

    <Pressable onPress={() => {
        navigation.navigate('Login')
        //Ide jön a redirect
    }}>
        <Text style={styles.pressButton}>Bejelentkezés</Text>
    </Pressable>
        </View>
    )
}
export default Homepage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        alignItems: "center",
    },

    textInput: {
        height: 50,
        minWidth:300,
        borderColor: 'grey',
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
    }
});