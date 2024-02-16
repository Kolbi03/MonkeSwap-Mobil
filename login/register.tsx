import { StatusBar } from 'expo-status-bar';
import {StyleSheet, Text, View, TextInput, Button, Pressable} from 'react-native';
import React, {useState} from "react";
import{NavigationContainer} from "@react-navigation/native";

const RegisterScreen = ({ navigation }) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false)

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />

            <Text style={styles.header}>Regisztráció</Text>

            {/*Bejelentkezés mező*/}
            <Text style={styles.text}>Felhasználónév</Text>
            <TextInput style={styles.textInput}/>

            {/*Email mező*/}
            <Text style={styles.text}>Email</Text>
            <TextInput style={styles.textInput}/>

            {/*Jelszó mező*/}
            <Text style={styles.text}>Jelszó</Text>
            <TextInput style={styles.textInput}/>

            {/*Jelszó megerősítése mező*/}
            <Text style={styles.text}>Jelszó megerősítése</Text>
            <TextInput style={styles.textInput}/>

            <Pressable onPress={() => {
                //Ide jön a redirect
            }}>
                <Text style={styles.pressButton}>Bejelentkezés</Text>
            </Pressable>

            <Pressable onPress={() => {
                navigation.navigate('Login')
            }}>
                <Text style={styles.pressButton}>Vissza</Text>
            </Pressable>

        </View>
    );


}
export default RegisterScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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

    header: {
        fontSize: 40,
        padding: 8,
        textAlignVertical: "top",
        marginTop: 10,
    },

    text: {
        fontSize: 24,
        padding: 14,
    },

    button: {
        padding:10,
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