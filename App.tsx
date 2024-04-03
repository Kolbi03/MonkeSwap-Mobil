import AuthContextProvider from "./provider/authContextProvider";
import Navigation from "./navigation/navigation";
import { NativeWindStyleSheet } from "nativewind";
import HttpProvider from "./provider/httpProvider";

NativeWindStyleSheet.setOutput({
    default: "native",
});

export default function App() {
    return (
        <AuthContextProvider>
            <HttpProvider>
                <Navigation />
            </HttpProvider>
        </AuthContextProvider>
    )
}
