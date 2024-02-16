import LoginScreen from "./login/login";
import RegisterScreen from "./login/register";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import { createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Homepage from "./homepage/homepage";
import ItemCreator from "./homepage/itemCreator";

const Stack = createNativeStackNavigator();

const BottomNav = createBottomTabNavigator();

function MainPage() {
    return(
        <BottomNav.Navigator screenOptions={{
            headerShown: false,
        }}>
            <BottomNav.Screen name="Homepage" component={Homepage}/>
            <BottomNav.Screen name="ItemCreator" component={ItemCreator}/>
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
