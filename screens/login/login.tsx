import { StatusBar } from 'expo-status-bar';
import { Text, View, TextInput } from 'react-native';
import React from "react";
import { Pressable } from "react-native";

import Styles from "../../Stylesheet";

const LoginScreen = ({ navigation }) => {
    const styles = Styles;

    return (
        <View style={styles.container}>
            <StatusBar style='auto' />

            <Text style={styles.header}>Login</Text>

            {/*Username mező*/}
            <Text style={styles.text}>Username</Text>

            <View style={styles.textInput}>
                <TextInput placeholder='Bob' placeholderTextColor={'gray'}/>
            </View>

            {/*Jelszó mező*/}
            <Text style={styles.text}>Password</Text>

            <View style={styles.textInput}>
                <TextInput placeholder='********' placeholderTextColor={'gray'}/>
            </View>


            <Pressable onPress={() => {
                navigation.navigate('MainPage')
                //Ide jön a redirect
            }}>
                <Text style={styles.pressButton}>Login</Text>
            </Pressable>

            <Pressable onPress={() => {
                navigation.navigate('Register')
            }}>
                <Text style={styles.pressButton}>Register</Text>
            </Pressable>
        </View>
    );
}

export default LoginScreen;
