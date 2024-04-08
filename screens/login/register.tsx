import { StatusBar } from 'expo-status-bar';
import {Text, View, TextInput, ToastAndroid, TouchableOpacity} from 'react-native';
import React, {useState} from "react";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import registerDataDTO from "../../interfaces/registerDataDTO";
import Animated, {FadeIn, FadeInUp} from "react-native-reanimated";
import axios from "../../axios";


// @ts-ignore
const RegisterScreen = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [conPassword, setConPassword] = useState('')
    const [username, setUsername] = useState('');

    const data: registerDataDTO = {
        email: email,
        username: username,
        password: password,
    }

    function passwordCheck () {
        return conPassword === password;
    }

    //-----------PAGE STARTS HERE--------------

    return (
        <KeyboardAwareScrollView className="bg-white h-full- w-full flex-1">
            <StatusBar style="auto" />

            <Animated.View className="pt-24" entering={FadeIn.delay(0).duration(800)}>
                <Text className="text-black font-bold text-3xl tracking-wider text-center pt-4">Account creation</Text>
                <Text className="text-gray-500 text-lg text-center pb-4">Start trading today!</Text>
            </Animated.View>

            <View className="flex items-center mx-4 space-y-4">

                <Animated.View className="w-full bg-black/5 rounded-2xl p-5 h-14" entering={FadeInUp.delay(0).duration(600)}>
                    <TextInput placeholder='Email' keyboardType="email-address" onChangeText={email => setEmail(email)} placeholderTextColor={'gray'}/>
                </Animated.View>

                <Animated.View className="w-full bg-black/5 rounded-2xl p-5 h-14" entering={FadeInUp.delay(100).duration(600)}>
                    <TextInput placeholder='Username' onChangeText={username => setUsername(username)} placeholderTextColor={'gray'}/>
                </Animated.View>

                <Animated.View className="w-full bg-black/5 rounded-2xl p-5 h-14" entering={FadeInUp.delay(200).duration(600)}>
                    <TextInput placeholder='Password' secureTextEntry={true} onChangeText={password => setPassword(password)} placeholderTextColor={'gray'}/>
                </Animated.View>

                <Animated.View className="w-full bg-black/5 rounded-2xl p-5 h-14" entering={FadeInUp.delay(300).duration(600)}>
                    <TextInput placeholder='Confirm Password' secureTextEntry={true} onChangeText={password => setConPassword(password)} placeholderTextColor={'gray'}/>
                </Animated.View>

                <Animated.Text className="pt-4 pb-2 text-center" entering={FadeInUp.delay(400).duration(600)}>When you create you account you accept the EULA and Privacy Policy</Animated.Text>

                <Animated.View className="w-full" entering={FadeInUp.delay(500).duration(600)}>
                    <TouchableOpacity className="w-full bg-amber-300 p-3 rounded-2xl" onPress={() => {
                        if(passwordCheck()) {
                        axios.post('/auth/register', data)
                            .then((response) => {
                                console.log(response.data)
                                ToastAndroid.showWithGravity('Account created!', 2000, 1)
                                navigation.push('Login')
                            }).catch(e => {
                                ToastAndroid.showWithGravity(e.response.data, 2000, 1)
                        })
                    } else {
                        ToastAndroid.showWithGravity('Passwords must match', 2000, 1)
                    }}}>
                        <Text  className="text-xl font-bold text-white text-center">Create</Text>
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View className="w-full bg-amber-300 p-3 rounded-2xl" entering={FadeInUp.delay(600).duration(600)}>
                    <TouchableOpacity onPress={() => {
                        navigation.push('Login')
                    }}>
                        <Text className="text-xl font-bold text-white text-center">Back to login</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </KeyboardAwareScrollView>
    );
}
export default RegisterScreen;