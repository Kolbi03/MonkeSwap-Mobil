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
import * as ImagePicker from "expo-image-picker";

const styles = Styles;

const baseUrl = baseURL;

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

interface updateUserDTO {
    fullName: string | undefined,
    username: string | undefined,
    dateOfBirth: string |undefined,
    phoneNumber: string | undefined,
    profilePicture: string |undefined,
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
    const [dateOfBirth, setDateOfBirth] = useState(userData?.dateOfBirth)
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

    const [base64Icon, setBase64Icon] = useState('')

    const [banana2, setBanana2] = useState(false);
    const [banana3, setBanana3] = useState(false);
    const [banana4, setBanana4] = useState(false);
    const [banana5, setBanana5] = useState(false);

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
        getUserData()
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

    function handleEditEvent() {

        const formData = new FormData();
        formData.append('title', itemTitle as string);
        formData.append('itemPicture', itemPicture as string);
        formData.append('description', itemDescription as string);
        formData.append('category', itemCategory as string);
        formData.append('priceTier', itemPriceTier as string);

        //console.log(formData)

        axios.put('/item/' + selectedItem?.id, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: 'Bearer ' + token?.token
            },
            transformRequest: (data, headers) => {
                return formData;
            }},)
            .then(() => {
                ToastAndroid.showWithGravity('Item updated!', 2000, 1)
                setEditModalVisible(!editModalVisible)
            }).catch((e) => {
            console.log(e)
        });
    }

    const getUserData  = () => {
        axios.get(baseUrl + '/user', config)
            .then((response) => {
                //console.log(response.data);
                setUserData(response.data)
                setDateOfBirth(userData!.dateOfBirth)
                setUsername(userData?.username)
                setFullName(userData?.fullName)
                setPhoneNumber(userData?.phoneNumber)

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
        getUserData()
    }, []);

    function updateUser() {
        axios.put(baseUrl + '/user', updateUserData, config)
            .then(() => {
                ToastAndroid.showWithGravity('Profile data updated!', 2000, ToastAndroid.CENTER)
                getUserData()
            })
            .catch((e) => console.log(e.response.data))
        //console.log(updateUserData)
    }

    const pickImage = async () => {
            let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            base64: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if(result.canceled) {console.log('cancelled')} else {
            setItemPicture(result.assets![0].base64)
            setBase64Icon(result.assets![0].base64 as string)
            console.log(base64Icon)
            console.log(itemPicture)
        }
    };

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

    useEffect(() => {
        switch (itemPriceTier) {
            case '1':
                setBanana2(false);
                setBanana3(false);
                setBanana4(false);
                setBanana5(false);
                break;
            case '2':
                setBanana2(true);
                setBanana3(false);
                setBanana4(false);
                setBanana5(false);
                break;
            case '3':
                setBanana2(true);
                setBanana3(true);
                setBanana4(false);
                setBanana5(false);
                break;
            case '4':
                setBanana2(true);
                setBanana3(true);
                setBanana4(true);
                setBanana5(false);
                break;
            case '5':
                setBanana2(true);
                setBanana3(true);
                setBanana4(true);
                setBanana5(true);
                break;
        }
    }, [itemPriceTier]);

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

                                            <TextInput value={dateOfBirth} placeholder={'Date of birth'} editable={false} defaultValue={`${userData?.dateOfBirth === null ? "Date of birth" : userData?.dateOfBirth}`} placeholderTextColor={'gray'}/>

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
                                        setOpen(false)
                                        setDateOfBirth(date.toLocaleDateString())
                                    }}}/>}

                                    <Animated.View className="w-full bg-black/5 rounded-2xl p-5 h-14" entering={FadeInUp.delay(450).duration(600).springify()}>
                                        <TextInput  placeholder={'No phone number yet'} defaultValue={userData?.phoneNumber} keyboardType="phone-pad" onChangeText={num => setPhoneNumber(num)} placeholderTextColor={'gray'}/>
                                    </Animated.View>

                                    <Animated.View className="w-full bg-amber-300 p-3 rounded-2xl" entering={FadeInUp.delay(500).duration(600).springify()}>
                                        <TouchableOpacity onPress={handleUpdateUser}>
                                            <Text className="text-xl font-bold text-white text-center">Update user</Text>
                                        </TouchableOpacity>
                                    </Animated.View>

                                    <Animated.View className="w-full bg-amber-300 p-3 rounded-2xl" entering={FadeInUp.delay(550).duration(600).springify()}>
                                        <TouchableOpacity onPress={userDeleteHandler}>
                                            <Text className="text-xl font-bold text-white text-center">Delete user</Text>
                                        </TouchableOpacity>
                                    </Animated.View>

                                    <Animated.View className="w-full bg-amber-300 p-3 rounded-2xl" entering={FadeInUp.delay(600).duration(600).springify()}>

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
                                    <Text className="text-4xl text-center font-bold py-8">Edit item</Text>

                                    <View className="space-y-4">

                                        <Animated.View className="w-full bg-black/5 rounded-2xl p-5 h-14" entering={FadeInUp.delay(200).duration(600).springify()}>
                                            <TextInput placeholder={'Title'} defaultValue={selectedItem?.title} onChangeText={text => setItemTitle(text)} placeholderTextColor={'gray'}/>
                                        </Animated.View>

                                        <Animated.View className="w-full bg-black/5 rounded-2xl p-5 h-14" entering={FadeInUp.delay(250).duration(600).springify()}>
                                            <TextInput placeholder={'Description'} defaultValue={selectedItem?.description} onChangeText={text => setItemDescription(text)} placeholderTextColor={'gray'}/>
                                        </Animated.View>

                                        <Animated.View className="backdrop:bg-gray-200 w-full h-40 justify-center rounded-2xl" entering={FadeInUp.delay(150).duration(600).springify()}>
                                            <Pressable onPress={pickImage}>
                                                { itemPicture ? <Image style={{width: 150, height: 150}} className="self-center rounded-xl" source={{uri: "data:image/png;base64," + base64Icon}}/>
                                                    :
                                                    <View className="self-center">
                                                        <Icon size={100} source={"image"} color="#AAA"/>
                                                    </View>
                                                }
                                            </Pressable>
                                        </Animated.View>
                                        <Animated.View className="w-full items-center" entering={FadeInUp.delay(350).duration(600).springify()}>
                                            <SelectDropdown buttonStyle={{borderRadius: 14, backgroundColor: 'rgb(252 211 77)'}} buttonTextStyle={{color: "#FFF", fontWeight: "bold"}} defaultButtonText={"Choose a category"} searchPlaceHolder={"Search"} data={categories} defaultValue={selectedItem?.category} onSelect={(selectedItem) => {
                                                setItemCategory(selectedItem);
                                            }}/>
                                        </Animated.View>

                                        <View className="flex-row w-full h-24">

                                            <Animated.View entering={FadeInUp.delay(600).duration(600).springify()}>
                                                <Pressable onPress={() => {
                                                    setItemPriceTier('1')
                                                }}>
                                                    <Image source={require('../../assets/peeled_banana.png')} style={localStyles.categoryImage}/>
                                                </Pressable>
                                            </Animated.View>

                                            <Animated.View entering={FadeInUp.delay(640).duration(600).springify()}>
                                                <Pressable onPress={() => {
                                                    setItemPriceTier('2')
                                                }}>
                                                    <Image source={!banana2 ? require('../../assets/banana.png') : require('../../assets/peeled_banana.png')} style={localStyles.categoryImage}/>
                                                </Pressable>
                                            </Animated.View>

                                            <Animated.View entering={FadeInUp.delay(680).duration(600).springify()}>
                                                <Pressable onPress={() => {
                                                    setItemPriceTier('3')
                                                }}>
                                                    <Image source={!banana3 ? require('../../assets/banana.png') : require('../../assets/peeled_banana.png')} style={localStyles.categoryImage}/>
                                                </Pressable>
                                            </Animated.View>

                                            <Animated.View entering={FadeInUp.delay(720).duration(600).springify()}>
                                                <Pressable onPress={() => {
                                                    setItemPriceTier('4')
                                                }}>
                                                    <Image source={!banana4 ? require('../../assets/banana.png') : require('../../assets/peeled_banana.png')} style={localStyles.categoryImage}/>
                                                </Pressable>
                                            </Animated.View>

                                            <Animated.View entering={FadeInUp.delay(760).duration(600).springify()}>
                                                <Pressable onPress={() => {
                                                    setItemPriceTier('5')
                                                }}>
                                                    <Image source={!banana5 ? require('../../assets/banana.png') : require('../../assets/peeled_banana.png')} style={localStyles.categoryImage}/>
                                                </Pressable>
                                            </Animated.View>
                                        </View>

                                        <Animated.View className="w-full bg-amber-300 p-3 rounded-2xl" entering={FadeInUp.delay(600).duration(600).springify()}>
                                            <TouchableOpacity onPress={() => {
                                                handleEditEvent()
                                            }}>
                                                <Text className="text-xl font-bold text-white text-center">Save changes</Text>
                                            </TouchableOpacity>
                                        </Animated.View>

                                        <Animated.View className="w-full bg-red-500 p-3 rounded-2xl" entering={FadeInUp.delay(650).duration(600).springify()}>
                                            <TouchableOpacity onPress={() => {
                                                deleteItem()
                                            }}>
                                                <Text className="text-xl font-bold text-white text-center">Delete item</Text>
                                            </TouchableOpacity>
                                        </Animated.View>

                                        <Animated.View className="w-full bg-amber-300 p-3 rounded-2xl" entering={FadeInUp.delay(700).duration(600).springify()}>
                                            <TouchableOpacity onPress={() => {
                                                setEditModalVisible(!editModalVisible)
                                            }}>
                                                <Text className="text-xl font-bold text-white text-center">Close</Text>
                                            </TouchableOpacity>
                                        </Animated.View>
                                    </View>

                                </KeyboardAwareScrollView>
                            </View>
                        </View>
                    </Modal>
                    <View className="p-4">
                        <View className="flex-row flex-wrap">
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

})