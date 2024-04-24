import React, {ReactNode, useEffect, useState} from "react";
import authToken from "../interfaces/authToken";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AuthContext} from '../contexts/authContext';
import {ToastAndroid} from "react-native";
import loginDataDTO from '../interfaces/loginDataDTO'
import userDataDTO from "../interfaces/userDataDTO";
import axios from "../axios";

interface authContextProviderProps {
    children: ReactNode;
}

const AuthContextProvider: React.FC<authContextProviderProps> = ({children}: authContextProviderProps) => {

    const [token, setToken] = useState<authToken | null>(null);
    const [userData, setUserData] = useState<userDataDTO>();
    const [init, setInit] = useState<boolean>(false);

    const config = {
        headers: {
            Authorization: 'Bearer ' + token?.token
        }
    }

    const setTokenIfExists = async ()=> {

        const token = await AsyncStorage.getItem('token').catch((e)=>{console.log(e)});
        //console.log('At start: ' + token)
        if(token!=null){
            setToken({token: token});
            //console.log('finished: ' + token)
        }
        setInit(true);
    }

    useEffect(()=> {
        setTokenIfExists().then()
    },[])


    const login = (user: loginDataDTO) => {

        axios.post('/auth/login', {email: user.email, password: user.password})
            .then((response) => {
                setToken({token: response.data.token})
                //console.log('received token: ' + response.data.token)
                ToastAndroid.showWithGravity('Logged in!', 2000, ToastAndroid.CENTER)
                AsyncStorage.setItem('token', response.data.token).catch((e) => {
                    console.log(e)
                });
            })
            .catch((e) => {
                //console.log(e + user.email, user.password);
                ToastAndroid.showWithGravity(e.response.data, 2000, ToastAndroid.CENTER)
            })
    };

    const getUserData = () => {
        axios.get('/user', config)
            .then((response) => {
                //console.log(response.data)
                setUserData(response.data)
            })
            .catch((e) => console.log(e));

        return userData;
    }

    const logout = async () => {
        setToken(null);
        await AsyncStorage.removeItem('token');
        //console.log(token)
    }
        return (
    <AuthContext.Provider value={{ token, login, logout, getUserData, init}}>
    {children}
    </AuthContext.Provider>
);
}

export default AuthContextProvider;