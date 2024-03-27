import Styles from "../../Stylesheet";
import {Dimensions, Image, Modal, Pressable, ScrollView, Text, TextInput, ToastAndroid, View} from "react-native";
import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../contexts/authContext";
import userDataDTO from "../../interfaces/userDataDTO";
import axios from "../../axios";
import {baseURL} from "../../backendURL";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import RNDateTimePicker from '@react-native-community/datetimepicker';
import itemDataDTO from "../../interfaces/itemDataDTO";
import ItemCard from "../../components/itemCard";

const styles = Styles;

const baseUrl = baseURL;
let itemCards: React.JSX.Element[] | undefined;

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

interface updateUserDTO {
    fullName: string | undefined,
    username: string | undefined,
    dateOfBirth: any,
    phoneNumber: string | undefined,
    profilePicture: string |undefined,
}

const Profile = () => {

    const {token} = useContext(AuthContext);
    const {logout} = useContext(AuthContext);
    const [itemList, setItemList] = useState<itemDataDTO[]>();

    const [userData, setUserData] = useState<userDataDTO>();
    const [fullName, setFullName] = useState(userData?.fullName)
    const [username, setUsername] = useState(userData?.username)
    const [dateOfBirth, setDateOfBirth] = useState(new Date())
    const [phoneNumber, setPhoneNumber] = useState(userData?.phoneNumber)
    const [profilePicture, setProfilePicture] = useState(userData?.profilePicture);
    const [open, setOpen] = useState(false);
    const [visible, setVisible]= useState(false);

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

    function handleUpdateUser() {
        updateUser();
        setVisible(!visible);
    }

    function loadCards() {
        axios.get('/user/items', config)
            .then((response) => {
                console.log(response.data);
                setItemList(response.data);
                console.log('itemList: ' + itemList)
            })
            .catch((e) => console.log(e.response.data))

        if(itemList === undefined) {} else {

            itemCards = itemList.map((item, i) =>

                <ItemCard key={i} id={item.id} userId={item.userId} title={item.title} itemPicture={item.itemPicture} description={item.description}
                          category={item.category} priceTier={item.priceTier} buttonPressFunction={placeholderFunc}/>);

            console.log('itemCards: ' + itemCards)
        }
    }

    function placeholderFunc() {}

    const getUserData  = async () => {
        await axios.get(baseUrl + '/user', config)
            .then((response) => {
                //console.log(response.data);
                setUserData(response.data)
            })
            .catch((e) => console.log(e))
    }

    useEffect(() => {
        loadCards();
        getUserData().then();

    }, []);

    function updateUser() {
        axios.put(baseUrl + '/user', updateUserData, config)
            .then(() =>
                ToastAndroid.showWithGravity('Profile data updated!', 2000, ToastAndroid.CENTER))
            .catch((e) => console.log(e))
        console.log(updateUserData)
    }

    return (
        <View style={{backgroundColor: '#FFF'}}>
            <ScrollView>
                <View style={{height: height * 0.3}}>
                    <Text style={{fontSize: 22, alignSelf: "center", marginTop: 10}}>{userData?.username}</Text>
                    <Image source={require('../../assets/monke.jpg')} style={{alignSelf: "center", height: height * 0.14, width: width * 0.28, margin: width * 0.02, borderRadius: 100}}/>
                    <View style={{flex: 1, flexDirection: "row", alignSelf: "center"}}>
                        <Pressable onPress={() => setVisible(true)}>
                            <Text style={styles.pressButtonSmall}>Edit profile</Text>
                        </Pressable>
                        <Pressable onPress={logout}>
                            <Text style={styles.pressButtonSmall}>Logout</Text>
                        </Pressable>

                        <Pressable onPress={loadCards}>
                            <Text style={styles.pressButtonSmall}>Load Cards</Text>
                        </Pressable>
                    </View>
                </View>
                <View>
                    <Modal
                        animationType="slide"
                        transparent={false}
                        presentationStyle={"overFullScreen"}
                        visible={visible}
                        onRequestClose={() => {
                            setVisible(!visible);
                        }}>
                        <View style={styles.container}>

                            <View>
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

                                    <View style={{flex: 1, flexDirection: "row"}}>
                                        <Text style={{ verticalAlign: "middle", fontSize: 18}}>Date Of Birth</Text>

                                        <Pressable onPress={() => setOpen(true)}>
                                            <Text style={styles.pressButtonSmall}>Edit</Text>
                                        </Pressable>
                                    </View>

                                    {open && <RNDateTimePicker value={new Date()} onChange={(_event, date) =>
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

                                    <Pressable onPress={handleUpdateUser}>
                                        <Text style={styles.pressButton}>Update Profile</Text>
                                    </Pressable>

                                    <Pressable onPress={() => setVisible(!visible)}>
                                        <Text style={styles.pressButton}>Close</Text>
                                    </Pressable>

                                </KeyboardAwareScrollView>
                            </View>
                        </View>
                    </Modal>
                    <View style={{padding: 20, backgroundColor: '#FFF'}}>
                        <View style={{flexDirection: "row", flexWrap: "wrap"}}>
                            {itemCards}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    )};

export default Profile;