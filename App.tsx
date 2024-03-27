import AuthContextProvider from "./provider/authContextProvider";
import Navigation from "./navigation/navigation";
import { NativeWindStyleSheet } from "nativewind";

NativeWindStyleSheet.setOutput({
    default: "native",
});

export default function App() {
    return (
        <AuthContextProvider>
            <Navigation />
        </AuthContextProvider>
    )
}
