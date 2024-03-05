import { StatusBar } from 'expo-status-bar';
import { Text, View, TextInput, Pressable} from 'react-native';
import Styles from "../../Stylesheet";
import axios from "axios";
import {useState} from "react";
import {red} from "react-native-reanimated/lib/typescript/reanimated2/Colors";

const baseUrl = 'http://192.168.11.70:8080'

const RegisterScreen = ({ navigation }) => {
    const styles = Styles;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [conPassword, setConPassword] = useState('')
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    function passwordCheck () {0
        return conPassword === password;
    }


    return (
        <View style={styles.container}>
            <StatusBar style="auto" />

            <Text style={styles.header}>Account creation</Text>
            <Text style={{fontSize: 18, paddingBottom: 8, color: '#444444',}}>Start trading today!</Text>

            {/*Username mező*/}
            <Text style={styles.text}>Username</Text>

            <View style={styles.textInput}>
                <TextInput placeholder='Monke' onChangeText={username => setUsername(username)} placeholderTextColor={'gray'}/>
            </View>

            {/*Email mező*/}
            <Text style={styles.text}>Email</Text>

            <View style={styles.textInput}>
                <TextInput placeholder='Monke@swap.com' placeholderTextColor={'gray'} onChangeText={email => setEmail(email)}/>
            </View>

            {/*Jelszó mező*/}
            <Text style={styles.text}>Password</Text>

            <View style={styles.textInput}>
                <TextInput placeholder='********' secureTextEntry={true} onChangeText={password => setPassword(password)} placeholderTextColor={'gray'}/>
            </View>

            {/*Jelszó megerősítése mező*/}
            <Text style={styles.text}>Confirm password</Text>

            <View style={styles.textInput}>
                <TextInput placeholder='********' secureTextEntry={true} onChangeText={password => setConPassword(password)} placeholderTextColor={'gray'}/>
            </View>

            <Text style={{padding: 12, textAlign: "center"}}>When you create you account you accept the EULA and Privacy Policy</Text>

            <Pressable onPress={() => {
                passwordCheck() ?
                axios({
                    method: 'post',
                    url: `${baseUrl}/auth/register`,
                    data: {
                        username: username,
                        email: email,
                        password: password,
                    }
                }).then((response) => {
                    console.log(response.data);
                }).catch(error => {console.log(error)}) :
                    setError('The confirmation must be the same as the password')
            }}>
                <Text style={styles.pressButton}>Create</Text>
            </Pressable>

            <Pressable onPress={() => {
                navigation.navigate('Login')
            }}>
                <Text style={styles.pressButton}>Back</Text>
            </Pressable>
            <Text style={{marginTop: 20, color:'#FF0000'}}>{error}</Text>
        </View>
    );


}
export default RegisterScreen;