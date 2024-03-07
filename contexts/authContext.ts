import authToken from "../interfaces/authToken";
import {createContext, useContext} from "react";

interface authContextProps {
    token: authToken | null
    init: boolean
}

export const AuthContext = createContext<authContextProps>({
    token: null,
    init: false
})