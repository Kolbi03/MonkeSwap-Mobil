import { StatusBar } from 'expo-status-bar';
import { Text, View, TextInput } from 'react-native';
import React, {useState} from "react";
import { Pressable } from "react-native";
import Styles from "../../Stylesheet";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import loginDataDTO from '../../interfaces/loginDataDTO';
import {baseURL} from "../../backendURL";

const LoginScreen = ({ navigation }) => {

    const styles = Styles;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const data: loginDataDTO = {
        email: email,
        password: password,
    }

    const baseUrl = baseURL;

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

            <Text>{error}</Text>

            <Pressable onPress={() => {
                 axios.post(baseUrl + '/auth/login', data)
                    .then(async(response) => {
                        await AsyncStorage.setItem('token', response.data.token).catch((e)=>{console.log(e)});
                    navigation.navigate('MainPage')
                }).catch(error => console.log(error));
                navigation.navigate('MainPage');
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