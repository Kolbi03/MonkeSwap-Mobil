import { StatusBar } from 'expo-status-bar';
import { Text, View, TextInput } from 'react-native';
import React, {useContext, useState} from "react";
import { Pressable } from "react-native";
import Styles from "../../Stylesheet";
import loginDataDTO from '../../interfaces/loginDataDTO';
import {AuthContext} from "../../contexts/authContext";

// @ts-ignore
const LoginScreen = ({ navigation }) => {

    const styles = Styles;

    const {login} = useContext(AuthContext)

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const data: loginDataDTO = {
        email: email,
        password: password,
    }

    return (
        <View style={styles.container}>
            <StatusBar style='auto' />

            <Text style={styles.header}>Login</Text>

            {/*Email mező*/}
            <Text style={styles.text}>Email</Text>

            <View style={styles.textInput}>
                <TextInput placeholder='Bob@monke.com' keyboardType="email-address" onChangeText={email => setEmail(email)} placeholderTextColor={'gray'}/>
            </View>

            {/*Jelszó mező*/}
            <Text style={styles.text}>Password</Text>

            <View style={styles.textInput}>
                <TextInput placeholder='********' secureTextEntry={true} onChangeText={password => setPassword(password)} placeholderTextColor={'gray'}/>
            </View>

            <Pressable onPress={() => {
                login({email: data.email, password: data.password})
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