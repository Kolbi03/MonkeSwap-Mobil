import React, {ReactNode, useContext, useMemo} from "react";
import axios, {AxiosInstance} from "axios";
import { AuthContext } from "../contexts/authContext";
import authToken from "../interfaces/authToken";
import BaseUrl from "../baseURL/baseURL";

interface HttpContextProviderProps {
    children: ReactNode;
}

export const HttpContext = React.createContext<AxiosInstance>(axios);

function createAxios(token: authToken | null){
    if (token?.token) {
        return axios.create({
            baseURL: BaseUrl,
            headers: {
                Authorization: 'Bearer ' + token?.token
            }
        });
    } else {
        return axios.create();
    }
}

function HttpProvider({children}: HttpContextProviderProps) {
    const {token} = useContext(AuthContext);

    const axios = useMemo(() => {
        return createAxios(token);
    },[token?.token]);

    return (
        <HttpContext.Provider value={axios}>
            {children}
        </HttpContext.Provider>
    );
}

export default HttpProvider;