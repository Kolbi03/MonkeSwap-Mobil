import LoginScreen from "./screens/login/login";
import RegisterScreen from "./screens/login/register";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import { createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Homepage from "./screens/homepage/homepage";
import ItemCreator from "./screens/homepage/itemCreator";
import Profile from "./screens/homepage/profile";

const Stack = createNativeStackNavigator();

const BottomNav = createBottomTabNavigator();

function MainPage() {
    return(
        <BottomNav.Navigator screenOptions={{
            headerShown: false,
        }}>
            <BottomNav.Screen name="Homepage" component={Homepage}/>
            <BottomNav.Screen name="ItemCreator" component={ItemCreator}/>
            <BottomNav.Screen name={"Profile"} component={Profile}/>
        </BottomNav.Navigator>
    )}


export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerStyle: {
                backgroundColor: '#B5651D',
            },
            //tabBarStyle: {backgroundColor: '#B5651D'}
            }}>
          <Stack.Screen name="Login" component={LoginScreen}/>
          <Stack.Screen name="Register" component={RegisterScreen}/>
          <Stack.Screen name="MainPage" component={MainPage}/>
        </Stack.Navigator>
      </NavigationContainer>
  )}
