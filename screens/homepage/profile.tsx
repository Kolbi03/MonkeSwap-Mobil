import Styles from "../../Stylesheet";
import {Pressable, Text, TextInput, ToastAndroid, View} from "react-native";
import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../contexts/authContext";
import userDataDTO from "../../interfaces/userDataDTO";
import axios from "axios";
import {baseURL} from "../../backendURL";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import RNDateTimePicker from '@react-native-community/datetimepicker';

const styles = Styles;

const baseUrl = baseURL;

interface updateUserDTO {
    fullName: string | undefined,
    username: string | undefined,
    dateOfBirth: any,
    phoneNumber: string | undefined,
    profilePicture: string |undefined,
}

// @ts-ignore
const Profile = ({navigation}) => {

    const {token} = useContext(AuthContext);
    const {logout} = useContext(AuthContext);

    const [userData, setUserData] = useState<userDataDTO>();
    const [fullName, setFullName] = useState(userData?.fullName)
    const [username, setUsername] = useState(userData?.username)
    const [dateOfBirth, setDateOfBirth] = useState(new Date())
    const [phoneNumber, setPhoneNumber] = useState(userData?.phoneNumber)
    const [profilePicture, setProfilePicture] = useState(userData?.profilePicture);
    const [open, setOpen] = useState(false);

    const config = {
        headers: {
            Authorization: 'Bearer ' + token?.token
        }
    }

    const updateUserData: updateUserDTO = {
        fullName: fullName,
        username: username,
        dateOfBirth: dateOfBirth,
        phoneNumber: phoneNumber,
        profilePicture: profilePicture,
    }

    const getUserData  = async () => {
        axios.get(baseUrl + '/user', config)
            .then((response) => {
                //console.log(response.data);
                setUserData(response.data)
            })
            .catch((e) => console.log(e))
    }

    useEffect(() => {

        getUserData().then();

    }, []);

    function updateUser() {
        if(phoneNumber === undefined) {

        }
        axios.put(baseUrl + '/user', updateUserData, config)
            .then((response) =>
                ToastAndroid.showWithGravity('Profile data updated!', 2000, ToastAndroid.CENTER))
            .catch((e) => console.log(e))
        console.log(updateUserData)
    }

    return (
    <View style={styles.container}>
        <KeyboardAwareScrollView>
        <Text style={styles.header}>Profile</Text>

        <Text style={styles.text}>PROFILE PIC PLACEHOLDER</Text>

        <View style={styles.textInput}>
            <TextInput defaultValue={'PROFILE PIC PLACEHOLDER'} placeholderTextColor={'gray'} onChangeText={text => setProfilePicture(text)}/>
        </View>

        <Text style={styles.text}>Full Name</Text>

        <View style={styles.textInput}>
            <TextInput placeholder={'No full name yet'} defaultValue={userData?.fullName} onChangeText={text => setFullName(text)} placeholderTextColor={'gray'}/>
        </View>

        <Text style={styles.text}>Username</Text>

        <View style={styles.textInput}>
            <TextInput defaultValue={userData?.username} onChangeText={text => setUsername(text)} placeholderTextColor={'gray'}/>
        </View>

        <Text style={styles.text}>Date Of Birth</Text>

        {/*<View style={styles.textInput}>
            <TextInput defaultValue={'DATE PLACEHOLDER'}  onChangeText={date => setDateOfBirth()} placeholderTextColor={'gray'}/>
        </View>*/}

            <Pressable onPress={() => setOpen(true)}>
                <Text style={styles.pressButton}>Edit date of birth</Text>
            </Pressable>

            {open && <RNDateTimePicker value={new Date()} onChange={(event, date) =>
            {if(date === undefined) {
                setOpen(false)
            } else {
                setDateOfBirth(date)
                setOpen(false)
            }}}/>}

        <Text style={styles.text}>Phone Number</Text>

        <View style={styles.textInput}>
            <TextInput placeholder={'No phone number yet'} defaultValue={userData?.phoneNumber} keyboardType="phone-pad" onChangeText={num => setPhoneNumber(num)} placeholderTextColor={'gray'}/>
        </View>

        <Pressable onPress={updateUser}>
            <Text style={styles.pressButton}>Update Profile</Text>
        </Pressable>

        <Pressable onPress={logout}>
            <Text style={styles.pressButton}>Logout</Text>
        </Pressable>
        </KeyboardAwareScrollView>
    </View>
    )};

export default Profile;