import authToken from "../interfaces/authToken";
import {createContext} from "react";
import loginDataDTO from '../interfaces/loginDataDTO'
import userDataDTO from "../interfaces/userDataDTO";

interface authContextProps {
    token: authToken | null,
    login: (user: loginDataDTO) => void,
    logout: () => void,
    getUserData: () => void,
    init: boolean
}

export const AuthContext = createContext<authContextProps>(
    null as any
)