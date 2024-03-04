import { StatusBar } from 'expo-status-bar';
import { Text, View, TextInput, Pressable} from 'react-native';
import Styles from "../../Stylesheet";
import axios from "axios";
import {useState} from "react";

const baseUrl = 'http://192.168.11.70:8080'

const RegisterScreen = ({ navigation }) => {
    const styles = Styles;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');


    return (
        <View style={styles.container}>
            <StatusBar style="auto" />

            <Text style={styles.header}>Account creation</Text>

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
                <TextInput placeholder='********' onChangeText={password => setPassword(password)} placeholderTextColor={'gray'}/>
            </View>

            {/*Jelszó megerősítése mező*/}
            <Text style={styles.text}>Confirm password</Text>

            <View style={styles.textInput}>
                <TextInput placeholder='********' placeholderTextColor={'gray'}/>
            </View>

            <Text style={{padding: 12, textAlign: "center"}}>When you create you account you accept the EULA and Privacy Policy</Text>

            <Pressable onPress={() => {
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
                }).catch(error => {console.log(error)})
            }}>
                <Text style={styles.pressButton}>Create</Text>
            </Pressable>

            <Pressable onPress={() => {
                navigation.navigate('Login')
            }}>
                <Text style={styles.pressButton}>Back</Text>
            </Pressable>
        </View>
    );


}
export default RegisterScreen;