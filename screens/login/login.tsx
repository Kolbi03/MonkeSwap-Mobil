import { StatusBar } from 'expo-status-bar';
import {Text, View, TextInput, TouchableOpacity} from 'react-native';
import React, {useContext, useState} from "react";
import loginDataDTO from '../../interfaces/loginDataDTO';
import {AuthContext} from "../../contexts/authContext";
import Animated, {FadeIn, FadeInUp} from "react-native-reanimated";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";

// @ts-ignore
const LoginScreen = ({ navigation }) => {

    const {login} = useContext(AuthContext)

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const data: loginDataDTO = {
        email: email,
        password: password,
    }

    return (
        <KeyboardAwareScrollView className="bg-white h-full- w-full flex-1">
            <StatusBar style='auto'/>

                <Animated.View className="items-center pt-40 content-evenly pb-40" entering={FadeIn.delay(0).duration(800)}>
                    <Text className="text-black font-bold text-4xl tracking-wider">Welcome to</Text>
                    <Text className="text-black font-bold text-4xl tracking-wider">MonkeSwap™</Text>
                </Animated.View>

                <View className="flex items-center mx-4 space-y-4">
                    <Animated.View className="w-full bg-black/5 rounded-2xl p-5 h-14" entering={FadeInUp.delay(200).duration(600).springify()}>
                        <TextInput placeholder='Email' keyboardType="email-address" onChangeText={email => setEmail(email)} placeholderTextColor={'gray'}/>
                    </Animated.View>

                        <Animated.View className="w-full bg-black/5 rounded-2xl p-5 h-14" entering={FadeInUp.delay(300).duration(600).springify()}>
                            <TextInput placeholder='Password' autoCapitalize="none" secureTextEntry={true} onChangeText={password => setPassword(password)} placeholderTextColor={'gray'}/>
                        </Animated.View>

                    <Animated.View className="w-full pt-6" entering={FadeInUp.delay(400).duration(600).springify()}>
                        <TouchableOpacity className="w-full bg-amber-300 p-3 rounded-2xl" onPress={() => {
                            login({email: data.email, password: data.password})
                        }}>
                            <Text className="text-xl font-bold text-white text-center">Login</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View className="w-full flex-row justify-center" entering={FadeInUp.delay(500).duration(600).springify()}>
                        <Text>Don't have an account?</Text>
                        <TouchableOpacity onPress={() => {
                            navigation.push('Register')
                        }}>
                            <Text className="text-blue-700"> Sign Up</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
        </KeyboardAwareScrollView>
    );
}

export default LoginScreen;