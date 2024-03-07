import React, {ReactNode, useEffect, useState} from "react";
import authToken from "../interfaces/authToken";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from '../contexts/authContext';

interface authContextProviderProps {
    children: ReactNode;
}

const AuthContextProvider: React.FC<authContextProviderProps> = ({children,}: authContextProviderProps) => {

    const [token, setToken] = useState<authToken | null>(null);
    const [init, setInit] = useState<boolean>(false);

    useEffect(()=>{


        const setTokenIfExists= async ()=>{
            console.log('lefutott')

            // await new Promise(resolve=>setTimeout(resolve, 1000))
            const token = await AsyncStorage.getItem('token').catch((e)=>{console.log(e)});
            console.log('At start: '+token)
            if(token!=null){
                setToken({token: token});
            }
            setInit(true);
        }

        setTokenIfExists();
    },[])
        return (
    <AuthContext.Provider value={{ token, init}}>
    {children}
    </AuthContext.Provider>
);
}

export default AuthContextProvider;