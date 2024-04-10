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
    ToastAndroid, TouchableOpacity,
    View
} from "react-native";
import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../contexts/authContext";
import userDataDTO from "../../interfaces/userDataDTO";
import {baseURL} from "../../backendURL";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import RNDateTimePicker from '@react-native-community/datetimepicker';
import itemDataDTO from "../../interfaces/itemDataDTO";
import ItemCard from "../../components/itemCard";
import SelectDropdown from "react-native-select-dropdown";
import {HttpContext} from "../../provider/httpProvider";
import {StatusBar} from "expo-status-bar";
import Animated, {FadeIn, FadeInUp} from "react-native-reanimated";
import {Icon} from "react-native-paper";

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
    const axios = useContext(HttpContext)
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

    function userDeleteHandler() {
        axios.delete('/user', config)
            .then(response => {
                console.log(response.data)
                logout();
            })
            .catch(e => console.log(e))
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

    function deleteItem() {
        axios.delete('/item/' + selectedItem?.id, config)
            .then(() => {
                setEditModalVisible(!editModalVisible)
                loadCards()
            })
            .catch((e) => console.log(e))
    }

    function profilePicChange() {

    }

    return (
        <View className="bg-white h-full- w-full flex-1 pt-12">
            <StatusBar style="auto"/>
            <ScrollView>
                <Animated.View entering={FadeIn.duration(600)} className="h-72 items-center m-4 rounded-2xl">
                    <Animated.View className="h-16 mt-4" entering={FadeInUp.delay(100).duration(600).springify()}>
                        <Text className="text-4xl font-bold align-middle">{userData?.username}</Text>
                    </Animated.View>
                    <Animated.View className="my-2" entering={FadeInUp.delay(200).duration(600).springify()}>
                        <Pressable onPress={profilePicChange}>
                            <Image source={require('../../assets/monke.jpg')} className="h-32 w-32 rounded-full"/>
                        </Pressable>
                    </Animated.View>
                    <View className="flex-row self-center space-x-1 mt-4">
                        <Animated.View entering={FadeInUp.delay(300).duration(600).springify()}>
                            <TouchableOpacity className="w-32 bg-amber-300 p-3 rounded-2xl" onPress={() => setVisible(true)}>
                                <Text className="text-l text-white text-center">Edit profile</Text>
                            </TouchableOpacity>
                        </Animated.View >
                        <Animated.View className="w-32 bg-amber-300 p-3 rounded-2xl" entering={FadeInUp.delay(250).duration(600).springify()}>
                            <Pressable onPress={logout}>
                                <Text className="text-l text-white text-center">Logout</Text>
                            </Pressable>
                        </Animated.View>
                    </View>
                </Animated.View>
                <View>
                    <Modal
                        animationType="slide"
                        transparent={false}
                        presentationStyle={"overFullScreen"}
                        visible={visible}
                        onRequestClose={() => {
                            setVisible(!visible);
                        }}>
                        <View className="flex-1 backdrop:bg-white p-4 justify-start h-full">

                            <View>
                                <KeyboardAwareScrollView className="space-y-4">
                                    <Animated.View entering={FadeInUp.delay(200).duration(600).springify()}>
                                        <Text className="text-3xl my-20 font-bold text-center">Edit profile</Text>
                                    </Animated.View>

                                    <Animated.View className="w-full bg-black/5 rounded-2xl p-5 h-14" entering={FadeInUp.delay(250).duration(600).springify()}>
                                        <TextInput placeholder={'Username'} defaultValue={userData?.username} onChangeText={text => setUsername(text)} placeholderTextColor={'gray'}/>
                                    </Animated.View>

                                    <Animated.View className="w-full bg-black/5 rounded-2xl p-5 h-14" entering={FadeInUp.delay(300).duration(600).springify()}>
                                        <TextInput placeholder={'Full name'} defaultValue={userData?.fullName} onChangeText={text => setFullName(text)} placeholderTextColor={'gray'}/>
                                    </Animated.View>


                                    <View className="flex-row space-x-2 content-center w-full">
                                        <Animated.View className="w-10/12 bg-black/5 rounded-2xl p-5 h-14 justify-start" entering={FadeInUp.delay(350).duration(600).springify()}>
                                            <TextInput placeholder={'Date of birth'} editable={false} defaultValue={userData?.dateOfBirth.toString()} onChangeText={text => setFullName(text)} placeholderTextColor={'gray'}/>
                                        </Animated.View>
                                        <Animated.View className="h-full bg-amber-300 p-3 rounded-2xl flex self-end align-middle" entering={FadeInUp.delay(400).duration(600).springify()}>
                                            <TouchableOpacity onPress={() => setOpen(!open)}>
                                                <Icon size={30} source={"calendar"} color={"#FFF"}/>
                                            </TouchableOpacity>
                                        </Animated.View>
                                    </View>

                                    {open && <RNDateTimePicker value={new Date()} onChange={(_event, date) =>
                                    {if(date === undefined) {
                                        setOpen(false)
                                    } else {
                                        setDateOfBirth(date)
                                        setOpen(false)
                                    }}}/>}

                                    <Animated.View className="w-full bg-black/5 rounded-2xl p-5 h-14" entering={FadeInUp.delay(450).duration(600).springify()}>
                                        <TextInput  placeholder={'No phone number yet'} defaultValue={userData?.phoneNumber} keyboardType="phone-pad" onChangeText={num => setPhoneNumber(num)} placeholderTextColor={'gray'}/>
                                    </Animated.View>

                                    <Animated.View className="w-full bg-amber-300 p-3 rounded-2xl" entering={FadeInUp.delay(500).duration(600).springify()}>
                                        <TouchableOpacity onPress={handleUpdateUser}>
                                            <Text className="text-xl font-bold text-white text-center">Update user</Text>
                                        </TouchableOpacity>
                                    </Animated.View>

                                    <Animated.View className="w-full bg-amber-300 p-3 rounded-2xl" entering={FadeInUp.delay(600).duration(600).springify()}>
                                        <TouchableOpacity onPress={userDeleteHandler}>
                                            <Text className="text-xl font-bold text-white text-center">Delete user</Text>
                                        </TouchableOpacity>
                                    </Animated.View>

                                    <Animated.View className="w-full bg-amber-300 p-3 rounded-2xl" entering={FadeInUp.delay(550).duration(600).springify()}>
                                        <TouchableOpacity onPress={() => {
                                            setVisible(!visible)
                                        }}>
                                            <Text className="text-xl font-bold text-white text-center">Close</Text>
                                        </TouchableOpacity>
                                    </Animated.View>

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

                                    <Pressable onPress={deleteItem}>
                                        <Text style={styles.pressButton}>Delete Item</Text>
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