import LoginScreen from "./login/login";
import RegisterScreen from "./login/register";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import { createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Homepage from "./homepage/homepage";

const Stack = createNativeStackNavigator();

const BottomNav = createBottomTabNavigator();

function Register() {
    return(
        <Stack.Navigator screenOptions={{
            headerStyle: {
                backgroundColor: '#B5651D',
            },
            headerShown: false,
        }}>
            <Stack.Screen name="LoginScreen" component={LoginScreen}/>
            <Stack.Screen name="Register" component={RegisterScreen}/>
        </Stack.Navigator>
    )}


export default function App() {
  return (
      <NavigationContainer>
        <BottomNav.Navigator screenOptions={{ headerStyle: {
                backgroundColor: '#B5651D',
            }}}>
          <BottomNav.Screen name="Login" component={Register}/>
          <BottomNav.Screen name="Homepage" component={Homepage}/>
        </BottomNav.Navigator>
      </NavigationContainer>
  )}
