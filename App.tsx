import LoginScreen from "./login/login";
import RegisterScreen from "./login/register";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen}/>
          <Stack.Screen name="Register" component={RegisterScreen}/>
        </Stack.Navigator>
      </NavigationContainer>

  )}
