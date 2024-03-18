import AuthContextProvider from "./provider/authContextProvider";
import Navigation from "./navigation/navigation";

export default function App() {
    return (
        <AuthContextProvider>
            <Navigation />
        </AuthContextProvider>
    )
}
