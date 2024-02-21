import { StatusBar } from 'expo-status-bar';
import {StyleSheet, Text, View, TextInput, Button, Pressable} from 'react-native';
import React, {useState} from "react";
import{NavigationContainer} from "@react-navigation/native";
import Styles from "../../Stylesheet";
import {Modal, Portal, Provider} from "react-native-paper";

const RegisterScreen = ({ navigation }) => {
    const styles = Styles;

    const [isLoggedIn, setIsLoggedIn] = useState(false)

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />

            <Text style={styles.header}>Account creation</Text>

            {/*Username mező*/}
            <Text style={styles.text}>Username</Text>

            <View style={styles.textInput}>
                <TextInput placeholder='Monke' placeholderTextColor={'gray'}/>
            </View>

            {/*Email mező*/}
            <Text style={styles.text}>Email</Text>

            <View style={styles.textInput}>
                <TextInput placeholder='Monke@swap.com' placeholderTextColor={'gray'}/>
            </View>

            {/*Jelszó mező*/}
            <Text style={styles.text}>Password</Text>

            <View style={styles.textInput}>
                <TextInput placeholder='********' placeholderTextColor={'gray'}/>
            </View>

            {/*Jelszó megerősítése mező*/}
            <Text style={styles.text}>Confirm password</Text>

            <View style={styles.textInput}>
                <TextInput placeholder='********' placeholderTextColor={'gray'}/>
            </View>

            <Text style={{padding: 12, textAlign: "center"}}>When you create you account you accept the EULA and Privacy Policy</Text>

            <Pressable onPress={() => {
                //Ide jön a redirect
            }}>
                <Text style={styles.pressButton}>Create</Text>
            </Pressable>

            <Pressable onPress={() => {
                navigation.navigate('Login')
            }}>
                <Text style={styles.pressButton}>Back</Text>
            </Pressable>
        </View>
    );


}
export default RegisterScreen;