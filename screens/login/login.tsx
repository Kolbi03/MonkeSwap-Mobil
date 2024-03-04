import { StatusBar } from 'expo-status-bar';
import { Text, View, TextInput } from 'react-native';
import React, {useState} from "react";
import { Pressable } from "react-native";
import Styles from "../../Stylesheet";
import axios from "axios";

const baseUrl = 'http://192.168.11.70:8080'

const LoginScreen = ({ navigation }) => {

    const styles = Styles;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const data = {
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
                <TextInput placeholder='Bob@monke.com' onChangeText={email => setEmail(email)} placeholderTextColor={'gray'}/>
            </View>

            {/*Jelszó mező*/}
            <Text style={styles.text}>Password</Text>

            <View style={styles.textInput}>
                <TextInput placeholder='********' onChangeText={password => setPassword(password)} placeholderTextColor={'gray'}/>
            </View>


            <Pressable onPress={() => {
                 axios.post(baseUrl + '/auth/login', data)
                    .then((response) => {
                    console.log(response.data);
                }).catch(error => console.log(error));
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