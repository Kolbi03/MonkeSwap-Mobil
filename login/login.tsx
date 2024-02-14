import { StatusBar } from 'expo-status-bar';
import {StyleSheet, Text, View, TextInput, Button} from 'react-native';
import React, {useState} from "react";

export default function LoginScreen() {

    const [isLoggedIn, setIsLoggedIn] = useState(false)

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />

            <Text style={styles.login}>Bejelentkezés</Text>

            {/*Bejelentkezés mező*/}
            <Text style={styles.text}>Felhasználónév</Text>
            <TextInput style={styles.textInput}/>

            {/*Jelszó mező*/}
            <Text style={styles.text}>Jelszó</Text>
            <TextInput style={styles.textInput}/>


            <Button onPress={() => {
                //Ide jön majd a redirect
                setIsLoggedIn(true);
            }}
            disabled={isLoggedIn}
            title={isLoggedIn ? 'Folyamatban' : 'Bejelentkezés'}
            />

            <Button onPress={() => {
                //Ide jön majd a redirect
                setIsLoggedIn(true);
            }}
                    disabled={isLoggedIn}
                    title={'Regisztráció'}
            />

        </View>
    );
}

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
    },


    login: {
        fontSize: 40,
        padding: 8,
        textAlignVertical: "top",
        marginTop: 50,
    },

    text: {
        fontSize: 24,
        padding: 14,
    },

    button: {
        padding:10,
    }
});
