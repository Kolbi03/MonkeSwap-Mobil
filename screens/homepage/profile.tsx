import Styles from "../../Stylesheet";
import {Pressable, Text, TextInput, View} from "react-native";
import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../contexts/authContext";
import userDataDTO from "../../interfaces/userDataDTO";
import axios from "axios";
import {baseURL} from "../../backendURL";

const styles = Styles;

const baseUrl = baseURL;

// @ts-ignore
const Profile = ({navigation}) => {

    const {token} = useContext(AuthContext);
    const {logout} = useContext(AuthContext);

    const [userData, setUserData] = useState<userDataDTO>();

    const config = {
        headers: {
            Authorization: 'Bearer ' + token?.token
        }
    }

    useEffect(() => {
        let ignore = false;
        const getUserData  = async () => {
            axios.get(baseUrl + '/user', config)
                .then((response) => {
                    console.log(response.data);
                    setUserData(response.data)
                })
                .catch((e) => console.log(e))
        }

        getUserData();
        return () => {
            ignore = true;
        }
    }, []);

    return (
    <View style={styles.container}>
        <Text style={styles.header}>Profile</Text>

        <Text style={styles.text}>Full Name</Text>

        <View style={styles.textInput}>
            <TextInput value='' keyboardType="email-address" onChangeText={email => setEmail(email)} placeholderTextColor={'gray'}/>
        </View>

        <Text style={styles.text}>Email</Text>

        <View style={styles.textInput}>
            <TextInput placeholder='Bob@monke.com' keyboardType="email-address" onChangeText={email => setEmail(email)} placeholderTextColor={'gray'}/>
        </View>

        <Text style={styles.text}>Email</Text>

        <View style={styles.textInput}>
            <TextInput placeholder='Bob@monke.com' keyboardType="email-address" onChangeText={email => setEmail(email)} placeholderTextColor={'gray'}/>
        </View>

        <Text style={styles.text}>Email</Text>

        <View style={styles.textInput}>
            <TextInput placeholder='Bob@monke.com' keyboardType="email-address" onChangeText={email => setEmail(email)} placeholderTextColor={'gray'}/>
        </View>

        <Text>{userData?.dateOfRegistration}</Text>

    <Pressable onPress={logout}>
        <Text style={styles.pressButton}>Logout</Text>
    </Pressable>
    </View>
    )};

export default Profile;