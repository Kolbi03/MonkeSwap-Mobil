import Styles from "../../Stylesheet";
import {
    Dimensions,
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    ToastAndroid,
    View
} from "react-native";
import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../contexts/authContext";
import userDataDTO from "../../interfaces/userDataDTO";
import axios from "../../axios";
import {baseURL} from "../../backendURL";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import RNDateTimePicker from '@react-native-community/datetimepicker';
import itemDataDTO from "../../interfaces/itemDataDTO";
import ItemCard from "../../components/itemCard";
import SelectDropdown from "react-native-select-dropdown";

const styles = Styles;

const baseUrl = baseURL;

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

interface updateUserDTO {
    fullName: string | undefined,
    username: string | undefined,
    dateOfBirth: any,
    phoneNumber: string | undefined,
    profilePicture: string |undefined,
}

interface updateItemDTO {
    title: string | undefined,
    description: string | undefined,
    priceTier: string | undefined,
    category: string | undefined,
    itemPicture: string | undefined,
}

const Profile = () => {

    const categories = ["OTHER", "VEHICLE", "HOME", "HOUSEHOLD", "ELECTRONICS", "FREETIME", "SPORT", "FASHION", "COLLECTIBLES", "PETS" ]

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
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<itemDataDTO>();
    const [itemTitle, setItemTitle] = useState(selectedItem?.title);
    const [itemDescription, setItemDescription] = useState(selectedItem?.description);
    const [itemPriceTier, setItemPriceTier] = useState(selectedItem?.priceTier);
    const [itemCategory, setItemCategory] = useState(selectedItem?.category);
    const [itemPicture, setItemPicture] = useState(selectedItem?.itemPicture);

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
                //console.log(response.data);
                setItemList(response.data);
                //console.log('itemList: ' + itemList)
            })
            .catch((e) => console.log(e.response.data))
    }

    function editOpenHandler(item: itemDataDTO) {
        setEditModalVisible(!editModalVisible)
        axios.get('/item/' + item.id, config)
            .then((response) => {
                console.log(response.data)
                setSelectedItem(response.data)
                setItemPriceTier(selectedItem?.priceTier)
                setItemTitle(selectedItem?.title)
                setItemDescription(selectedItem?.description)
                setItemPicture(selectedItem?.itemPicture)
                setItemCategory(selectedItem?.category)
            })
            .catch((e) => console.log(e))
    }

    function editItem() {
        const updateItem: updateItemDTO = {
            title:itemTitle,
            description:itemDescription,
            category: itemCategory,
            priceTier: itemPriceTier,
            itemPicture: itemPicture
        }
        axios.put('/item/' + selectedItem?.id, updateItem, config)
            .then((response) => {
                console.log(response.data)
            })
            .catch((e) => console.log(e))
        setEditModalVisible(!editModalVisible)
    }

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
        //console.log(updateUserData)
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

                        {/*<Pressable onPress={loadCards}>
                            <Text style={styles.pressButtonSmall}>Load Cards</Text>
                        </Pressable>*/}
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

                    {/*Item Edit Modal starts here*/}

                    <Modal
                        animationType="slide"
                        transparent={false}
                        presentationStyle={"overFullScreen"}
                        visible={editModalVisible}
                        onRequestClose={() => {
                            setVisible(!visible);
                        }}>
                        <View style={styles.container}>

                            <View>
                                <KeyboardAwareScrollView>
                                    <Text style={styles.header}>{selectedItem?.title}</Text>

                                    <Text style={styles.text}>Title</Text>

                                    <View style={styles.textInput}>
                                        <TextInput defaultValue={selectedItem?.title} onChangeText={text => setItemTitle(text)}/>
                                    </View>

                                    <Text style={styles.text}>Description</Text>

                                    <View style={styles.textInput}>
                                        <TextInput defaultValue={selectedItem?.description} onChangeText={text => setItemDescription(text)}/>
                                    </View>

                                    <Text style={styles.text}>Item Picture</Text>

                                    <View style={styles.textInput}>
                                        <TextInput defaultValue={'Picture picker placeholder'}/>
                                    </View>

                                    <Text style={styles.text}>Categories</Text>
                                    <SelectDropdown defaultButtonText={selectedItem?.category} searchPlaceHolder={"Search"} data={categories} onSelect={(selectedCategory) => {
                                        setItemCategory(selectedCategory);
                                    }}/>

                                    <View style={localStyles.priceCategoryContainer}>
                                        <Pressable onPress={() => {
                                            setItemPriceTier('1')
                                        }}>
                                            <Image source={require('../../assets/monke.jpg')} style={localStyles.categoryImage}/>
                                        </Pressable>

                                        <Pressable onPress={() => {
                                            setItemPriceTier('2')
                                        }}>
                                            <Image source={require('../../assets/monke.jpg')} style={localStyles.categoryImage}/>
                                        </Pressable>

                                        <Pressable onPress={() => {
                                            setItemPriceTier('3')
                                        }}>
                                            <Image source={require('../../assets/monke.jpg')} style={localStyles.categoryImage}/>
                                        </Pressable>

                                        <Pressable onPress={() => {
                                            setItemPriceTier('4')
                                        }}>
                                            <Image source={require('../../assets/monke.jpg')} style={localStyles.categoryImage}/>
                                        </Pressable>

                                        <Pressable onPress={() => {
                                            setItemPriceTier('5')
                                        }}>
                                            <Image source={require('../../assets/monke.jpg')} style={localStyles.categoryImage}/>
                                        </Pressable>
                                    </View>

                                    <Pressable onPress={editItem}>
                                        <Text style={styles.pressButton}>Update Item</Text>
                                    </Pressable>

                                    <Pressable onPress={() => setEditModalVisible(!editModalVisible)}>
                                        <Text style={styles.pressButton}>Close</Text>
                                    </Pressable>

                                </KeyboardAwareScrollView>
                            </View>
                        </View>
                    </Modal>
                    <View style={{padding: 20, backgroundColor: '#FFF'}}>
                        <View style={{flexDirection: "row", flexWrap: "wrap"}}>
                            {itemList?.map((item, i) =>

                                <ItemCard key={i} id={item.id} userId={item.userId} title={item.title} itemPicture={item.itemPicture} description={item.description}
                                          category={item.category} priceTier={item.priceTier} buttonPressFunction={() => editOpenHandler(item)} buttonText={'Edit'}/>)}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    )};

export default Profile;

const localStyles = StyleSheet.create({
    categoryImage: {
        height: height * 0.07,
        width: width * 0.14,
        margin: width * 0.02,
    },

    priceCategoryContainer: {
        flexDirection: "row",
    },

    infoImage: {
        height: height * 0.04,
        width: height * 0.08,
    }
})