import { StatusBar } from 'expo-status-bar';
import {Text, View, TextInput, Image} from 'react-native';
import React, {useContext, useState} from "react";
import { Pressable } from "react-native";
import Styles from "../../Stylesheet";
import loginDataDTO from '../../interfaces/loginDataDTO';
import {AuthContext} from "../../contexts/authContext";
import Animated, {FadeIn, FadeInUp, useSharedValue} from "react-native-reanimated";

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
        <Animated.View className="bg-white h-full- w-full flex-1">
            <StatusBar style='auto' />
            <Image className="h-full w-full absolute"/>

            <View className="h-full w-full flex justify-center">
                <Animated.View className="items-center" entering={FadeInUp.delay(100).duration(600)}>
                    <Text style={styles.header}>Login</Text>
                </Animated.View>

                {/*Email mező*/}
                <View className="flex items-center mx-4 space-y-4">
                    <Animated.View className="w-full bg-black/5 rounded-2xl p-5 h-14" entering={FadeInUp.delay(200).duration(600)}>
                        <TextInput placeholder='Email' keyboardType="email-address" onChangeText={email => setEmail(email)} placeholderTextColor={'gray'}/>
                    </Animated.View>

                    {/*Jelszó mező*/}
                    <Animated.View className="w-full" entering={FadeInUp.delay(300).duration(600)} >
                        <Animated.View className="w-full bg-black/5 rounded-2xl p-5 h-14" entering={FadeInUp.delay(200).duration(600)}>
                            <TextInput placeholder='Password' secureTextEntry={true} onChangeText={password => setPassword(password)} placeholderTextColor={'gray'}/>
                        </Animated.View>
                    </Animated.View>

                    <Animated.View className="w-full" entering={FadeInUp.delay(400).duration(600)}>
                        <Pressable onPress={() => {
                            login({email: data.email, password: data.password})
                        }}>
                            <Text style={styles.pressButton}>Login</Text>
                        </Pressable>
                    </Animated.View>

                    <Animated.View className="w-full" entering={FadeInUp.delay(500).duration(600)}>
                        <Pressable onPress={() => {
                            navigation.navigate('Register')
                        }}>
                            <Text style={styles.pressButton}>Register</Text>
                        </Pressable>
                    </Animated.View>
                </View>
            </View>
        </Animated.View>
    );
}

export default LoginScreen;