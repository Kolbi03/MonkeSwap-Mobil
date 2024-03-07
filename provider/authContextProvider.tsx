import React, {ReactNode, useEffect, useState} from "react";
import authToken from "../interfaces/authToken";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from '../contexts/authContext';
import axios, {constructor} from "axios";
import {ToastAndroid} from "react-native";
import loginDataDTO from '../interfaces/loginDataDTO'
import {baseURL} from'../backendURL'
import userDataDTO from "../interfaces/userDataDTO";

interface authContextProviderProps {
    children: ReactNode;
}

const AuthContextProvider: React.FC<authContextProviderProps> = ({children}: authContextProviderProps) => {

    const [token, setToken] = useState<authToken | null>(null);
    const [init, setInit] = useState<boolean>(false);

    const config = {
        headers: {
            Authorization: 'Bearer ' + token?.token
        }
    }

    useEffect(()=>{


        const setTokenIfExists= async ()=>{

            const token = await AsyncStorage.getItem('token').catch((e)=>{console.log(e)});
            console.log('At start: ' + token)
            if(token!=null){
                setToken({token: token});
                console.log('finished: ' + token)
            }
            setInit(true);
        }

        setTokenIfExists();
    },[])

    const login = async (user: loginDataDTO) => {

        await axios.post(baseURL + '/auth/login', {email: user.email, password: user.password})
            .then(async (response) => {
                setToken({token: response.data.token})
                //console.log('received token: ' + response.data.token)
                ToastAndroid.showWithGravity('Logged in!', 2000, ToastAndroid.CENTER)
                await AsyncStorage.setItem('token', response.data.token).catch((e) => {
                    console.log(e)
                });
            })
            .catch((e) => {
                console.log(e + user.email, user.password);
                ToastAndroid.showWithGravity('Wrong credentials!', 2000, ToastAndroid.CENTER)
            })
    };

    const getUserData = async () => {
        await axios.get(baseURL + '/user', config)
            .then(async(response) => {
                console.log(response.data)
            })
            .catch((e) => console.log(e))
    }

    const logout = async () => {
        setToken(null);
        await AsyncStorage.removeItem('token');
        console.log(token)
    }
        return (
    <AuthContext.Provider value={{ token, login, logout, getUserData, init}}>
    {children}
    </AuthContext.Provider>
);
}

export default AuthContextProvider;