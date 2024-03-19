import LoginScreen from "../screens/login/login";
import RegisterScreen from "../screens/login/register";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import { createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Homepage from "../screens/homepage/homepage";
import ItemCreator from "../screens/homepage/itemCreator";
import Profile from "../screens/homepage/profile";
import {ActivityIndicator, Icon} from "react-native-paper";
import {useContext} from "react";
import {AuthContext} from "../contexts/authContext";
import {View} from "react-native";

const Stack = createNativeStackNavigator();
const BottomNav = createBottomTabNavigator();

function MainPage() {
    return(
            <BottomNav.Navigator screenOptions={{
                headerShown: false,
            }}>
                <BottomNav.Screen options={{tabBarLabel: 'Home', tabBarIcon: ({ color, size }) => (
                        <Icon source="home" color={color} size={size} />)}} name="Homepage" component={Homepage}/>
                <BottomNav.Screen options={{tabBarLabel: 'Item Creation', tabBarIcon: ({ color, size }) => (
                        <Icon source="plus" color={color} size={size} />)}} name="ItemCreator" component={ItemCreator} />
                <BottomNav.Screen options={{tabBarLabel: 'Profile', tabBarIcon: ({ color, size }) => (
                        <Icon source="star" color={color} size={size} />)}} name={"Profile"} component={Profile}/>
            </BottomNav.Navigator>
    )}
const Login = () => (
    <Stack.Navigator screenOptions={{ headerStyle: {
            backgroundColor: '#B5651D',
        },
    }}>
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="Register" component={RegisterScreen}/>
    </Stack.Navigator>
)

export default function Navigation() {

    const {token, init} = useContext(AuthContext);
    return (
        <>
            {init ?
                <NavigationContainer>
                    {!token ? <Login/> : (
                        <Stack.Navigator screenOptions={{
                            headerStyle: {
                                backgroundColor: '#B5651D',
                            },
                            //tabBarStyle: {backgroundColor: '#B5651D'}
                        }}>
                            <Stack.Screen name="MainPage" component={MainPage}/>
                        </Stack.Navigator>
                    )
                    }


                </NavigationContainer> :
                <View style={{flex:1,justifyContent:'center',alignItems:'center', backgroundColor: '#121212'}}>
                    <ActivityIndicator color='#999999' size="large"/>
                </View>
            }
        </>
    )
}