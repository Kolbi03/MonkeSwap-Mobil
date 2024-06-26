import {
    Image,
    Modal,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    ToastAndroid, TouchableOpacity,
    View
} from "react-native";
import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../contexts/authContext";
import userDataDTO from "../../interfaces/userDataDTO";
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
import updateUserDTO from "../../interfaces/updateUserDTO";
import {Buffer} from "buffer";

const Profile = () => {

    const categories = ["OTHER", "VEHICLE", "HOME", "HOUSEHOLD", "ELECTRONICS", "FREETIME", "SPORT", "FASHION", "COLLECTIBLES", "PETS" ]

    const {token} = useContext(AuthContext);
    const {logout} = useContext(AuthContext);
    const axios = useContext(HttpContext);

    const [itemList, setItemList] = useState<itemDataDTO[]>();
    const [userData, setUserData] = useState<userDataDTO>();

    const [fullName, setFullName] = useState(userData?.fullName)
    const [username, setUsername] = useState(userData?.username)
    const [dateOfBirth, setDateOfBirth] = useState(userData?.dateOfBirth)
    const [phoneNumber, setPhoneNumber] = useState(userData?.phoneNumber)
    const [profilePicture, setProfilePicture] = useState(userData?.profilePicture);
    const [password, setPassword] = useState('')
    const [passwordAgain, setPasswordAgain] = useState('')

    const [open, setOpen] = useState(false);
    const [visible, setVisible]= useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editPasswordModal, setEditPasswordModal] = useState(false);
    const [editMenuModal, setEditMenuModal] = useState(false);

    const [selectedItem, setSelectedItem] = useState<itemDataDTO>();

    const [itemTitle, setItemTitle] = useState('');
    const [itemDescription, setItemDescription] = useState('');
    const [itemPriceTier, setItemPriceTier] = useState('');
    const [itemCategory, setItemCategory] = useState('');
    const [itemPicture, setItemPicture] = useState('');

    const [banana2, setBanana2] = useState(false);
    const [banana3, setBanana3] = useState(false);
    const [banana4, setBanana4] = useState(false);
    const [banana5, setBanana5] = useState(false);

    function handleUpdateUser() {
        updateUser();
        setVisible(!visible);
        getUserData();
    }

    /*Loads the user's own items*/
    function loadCards() {
        axios.get('/user/items')
            .then((response) => {
                setItemList(response.data);
            })
            .catch((e) => console.log(e.response.data))
    }

    /*Opens the user edit modal and sets its text input values to the user's data*/
    function editOpenHandler(item: itemDataDTO) {
        setSelectedItem(item)
        setEditModalVisible(!editModalVisible)
        axios.get('/item/' + item.id)
            .then((response) => {
                setItemPriceTier(response.data.priceTier.toString())
                setItemTitle(response.data.title)
                setItemDescription(response.data.description)
                setItemPicture(Buffer.from(response.data.itemPicture as string, 'base64').toString('ascii'))
                setItemCategory(response.data.category)
            })
            .catch((e) => console.log(e))
    }

    /*Sends an update request for an item*/
    function handleEditEvent() {

        const formData = new FormData();
        formData.append('title', itemTitle as string);
        formData.append('itemPicture', itemPicture as string);
        formData.append('description', itemDescription as string);
        formData.append('category', itemCategory as string);
        formData.append('priceTier', itemPriceTier?.toString());

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
            console.log(e.response.data)
        });
    }

    /*Loads the user's data*/
    const getUserData  = () => {
        axios.get('/user')
            .then((response) => {
                setUserData(response.data)
                setDateOfBirth(userData?.dateOfBirth)
                setUsername(userData?.username)
                setFullName(userData?.fullName)
                setPhoneNumber(userData?.phoneNumber)
                setProfilePicture(response.data.profilePicture as string)
            })
            .catch((e) => console.log(e))
    }

    /*Sends a delete request for the current user*/
    function userDeleteHandler() {
        axios.delete('/user')
            .then(response => {
                console.log(response.data)
                logout();
            })
            .catch(e => console.log(e))
    }

    /*Updates the current user's data with the given parameters*/
    function updateUser() {

        const updateUserData: updateUserDTO = {
            fullName: fullName,
            username: username,
            dateOfBirth: dateOfBirth,
            phoneNumber: phoneNumber,
            profilePicture: profilePicture,
        }

        axios.put('/user', updateUserData)
            .then(() => {
                ToastAndroid.showWithGravity('Profile data updated!', 2000, ToastAndroid.CENTER)
                getUserData()
            })
            .catch((e) => ToastAndroid.showWithGravity(e, 2000, 1))
    }

    /*Changes the current user's password*/
    function changePassword() {
        if(password.trim() === '' || passwordAgain.trim() === '') {
            ToastAndroid.showWithGravity('Password field can not be empty', 2000, 1)
        } else {
            console.log(password)
            if (password === passwordAgain) {
                const body = {
                    password: password
                }
                axios.put('/user/password', body)
                    .then(() => {
                        ToastAndroid.showWithGravity('Password changed succesfully', 2000, 1)
                        setEditPasswordModal(false)
                    })
                    .catch((e) => console.log(e))
            } else {
                ToastAndroid.showWithGravity('Passwords must match', 2000, 1)
            }
        }
    }

    /*Opens the built in image picker, then changes the useState to the selected image*/
    const pickImage = async (type: string) => {
            let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            base64: true,
            aspect: [1, 1],
            quality: 0.6,
        });

        if(result.canceled) {
            console.log('cancelled')
        } else {
            if(type === 'item') {
                setItemPicture(result.assets![0].base64 as string)
            } else if(type === 'profile') {
                setProfilePicture(result.assets![0].base64 as string)

                const body = {
                    profilePicture: result.assets![0].base64 as string
                }

                axios.put('/user/profilepicture', body, {headers: {
                        "Content-Type": "multipart/form-data"
                    }})
                    .then(() => {
                        ToastAndroid.showWithGravity('Profile picture updated', 2000, 1)
                    }).catch((e) => {
                    console.log(e)
                });
            }
        }
    };

    /*Deletes the selected item*/
    function deleteItem() {
        axios.delete('/item/' + selectedItem?.id)
            .then(() => {
                setEditModalVisible(!editModalVisible)
                ToastAndroid.showWithGravity('Item deleted', 2000, 1)
                loadCards()
            })
            .catch((e) => console.log(e))
    }

    useEffect(() => {
        loadCards();
    }, [editModalVisible]);

    useEffect(() => {
        getUserData()
    }, [profilePicture]);

    /*Sets the price tier to default, and when it is changed updates it to the new value*/
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
                        <Pressable onPress={() => pickImage('profile')}>
                            { profilePicture ? <Image style={{width: 120, height: 120}} className="self-center rounded-full" source={{uri: "data:image/png;base64," + Buffer.from(profilePicture as string, 'base64').toString('ascii')}}/>
                                :
                                <View className="self-center">
                                    <Icon size={120} source={"image"} color="#AAA"/>
                                </View>
                            }
                        </Pressable>
                    </Animated.View>
                    <View className="flex-row self-center space-x-1 mt-4">
                        <Animated.View entering={FadeInUp.delay(300).duration(600).springify()}>
                            <TouchableOpacity className="w-32 bg-amber-300 p-3 rounded-2xl" onPress={() => setEditMenuModal(true)}>
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
                                        <Text className="text-4xl my-20 font-bold text-center">Edit profile</Text>
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

                                    <Animated.View className="w-full bg-red-500 p-3 rounded-2xl" entering={FadeInUp.delay(550).duration(600).springify()}>
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
                        <View className="flex backdrop:bg-white p-2 items-center">

                            <View>
                                <KeyboardAwareScrollView>
                                    <Text className="text-4xl text-center font-bold py-8">Edit item</Text>

                                    <View className="space-y-4">

                                        <Animated.View className="w-full bg-black/5 rounded-2xl p-5 h-14" entering={FadeInUp.delay(200).duration(600).springify()}>
                                            <TextInput placeholder={'Title'} defaultValue={itemTitle} onChangeText={text => setItemTitle(text)} placeholderTextColor={'gray'}/>
                                        </Animated.View>

                                        <Animated.View className="w-full bg-black/5 rounded-2xl p-5 h-14" entering={FadeInUp.delay(250).duration(600).springify()}>
                                            <TextInput placeholder={'Description'} defaultValue={itemDescription} onChangeText={text => setItemDescription(text)} placeholderTextColor={'gray'}/>
                                        </Animated.View>

                                        <Animated.View className="backdrop:bg-gray-200 w-full h-40 justify-center rounded-2xl" entering={FadeInUp.delay(300).duration(600).springify()}>
                                            <Pressable onPress={() => pickImage('item')}>
                                                { itemPicture ? <Image style={{width: 150, height: 150}} className="self-center rounded-xl" source={{uri: "data:image/png;base64," + itemPicture}}/>
                                                    :
                                                    <View className="self-center">
                                                        <Icon size={100} source={"image"} color="#AAA"/>
                                                    </View>
                                                }
                                            </Pressable>
                                        </Animated.View>
                                        <Animated.View className="w-full items-center" entering={FadeInUp.delay(350).duration(600).springify()}>
                                            <SelectDropdown buttonStyle={{borderRadius: 14, backgroundColor: 'rgb(252 211 77)'}} buttonTextStyle={{color: "#FFF", fontWeight: "bold"}} defaultButtonText={"Choose a category"} searchPlaceHolder={"Search"} data={categories} defaultValue={itemCategory} onSelect={(selectedItem) => {
                                                setItemCategory(selectedItem);
                                            }}/>
                                        </Animated.View>

                                        <View className="flex-row w-full h-24 space-x-8 items-center justify-center mb-2">

                                            <Animated.View entering={FadeInUp.delay(600).duration(600).springify()}>
                                                <Pressable onPress={() => {
                                                    setItemPriceTier('1')
                                                }}>
                                                    <Image source={require('../../assets/peeled_banana.png')} className="w-9 h-14 m-0 p-0 my-2"/>
                                                </Pressable>
                                            </Animated.View>

                                            <Animated.View entering={FadeInUp.delay(640).duration(600).springify()}>
                                                <Pressable onPress={() => {
                                                    setItemPriceTier('2')
                                                }}>
                                                    <Image source={!banana2 ? require('../../assets/banana.png') : require('../../assets/peeled_banana.png')} className="w-9 h-14 m-0 p-0 my-2"/>
                                                </Pressable>
                                            </Animated.View>

                                            <Animated.View entering={FadeInUp.delay(680).duration(600).springify()}>
                                                <Pressable onPress={() => {
                                                    setItemPriceTier('3')
                                                }}>
                                                    <Image source={!banana3 ? require('../../assets/banana.png') : require('../../assets/peeled_banana.png')} className="w-9 h-14 m-0 p-0 my-2"/>
                                                </Pressable>
                                            </Animated.View>

                                            <Animated.View entering={FadeInUp.delay(720).duration(600).springify()}>
                                                <Pressable onPress={() => {
                                                    setItemPriceTier('4')
                                                }}>
                                                    <Image source={!banana4 ? require('../../assets/banana.png') : require('../../assets/peeled_banana.png')} className="w-9 h-14 m-0 p-0 my-2"/>
                                                </Pressable>
                                            </Animated.View>

                                            <Animated.View entering={FadeInUp.delay(760).duration(600).springify()}>
                                                <Pressable onPress={() => {
                                                    setItemPriceTier('5')
                                                }}>
                                                    <Image source={!banana5 ? require('../../assets/banana.png') : require('../../assets/peeled_banana.png')} className="w-9 h-14 m-0 p-0 my-2"/>
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
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={editMenuModal}
                        onRequestClose={() => {
                            setEditMenuModal(false)
                        }}>
                        <View className="h-1/6 backdrop: bg-white mt-auto rounded-2xl w-full flex-row items-center space-x-4 justify-center">
                            <Animated.View className="w-2/5 bg-amber-300 p-3 rounded-2xl" entering={FadeInUp.delay(0).duration(600).springify()}>
                                <TouchableOpacity onPress={() => {
                                    setVisible(true)
                                    setEditMenuModal(false)
                                }}>
                                    <Text className="text-lg font-bold text-white text-center">Edit Profile</Text>
                                </TouchableOpacity>
                            </Animated.View>
                            <Animated.View className="w-2/5 bg-amber-300 p-3 rounded-2xl" entering={FadeInUp.delay(0).duration(600).springify()}>
                                <TouchableOpacity onPress={() => {
                                    setEditPasswordModal(true)
                                    setEditMenuModal(false)
                                }}>
                                    <Text className="text-lg font-bold text-white text-center">Edit Password</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        </View>
                    </Modal>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={editPasswordModal}
                        onRequestClose={() => {
                            setEditMenuModal(false)
                        }}>
                        <View className="h-full backdrop: bg-white mt-auto rounded-2xl w-full flex space-y-4 px-4 items-center justify-center">
                            <Text className="font-bold text-4xl text-center my-20">
                                Change password
                            </Text>
                            <Animated.View className="w-full bg-black/5 rounded-2xl p-5 h-14" entering={FadeInUp.delay(200).duration(600).springify()}>
                                <TextInput placeholder='Password' placeholderTextColor={'gray'} secureTextEntry={true} autoCapitalize={"none"} onChangeText={(text) => setPassword(text)}/>
                            </Animated.View>
                            <Animated.View className="w-full bg-black/5 rounded-2xl p-5 h-14" entering={FadeInUp.delay(250).duration(600).springify()}>
                                <TextInput placeholder='Password again' placeholderTextColor={'gray'} secureTextEntry={true} autoCapitalize={"none"} onChangeText={(text) => setPasswordAgain(text)}/>
                            </Animated.View>
                            <Animated.View className="w-full bg-amber-300 p-3 rounded-2xl" entering={FadeInUp.delay(300).duration(600).springify()}>
                                <TouchableOpacity onPress={changePassword}>
                                    <Text className="text-xl font-bold text-white text-center">Change password</Text>
                                </TouchableOpacity>
                            </Animated.View>
                            <Animated.View className="w-full bg-amber-300 p-3 rounded-2xl" entering={FadeInUp.delay(350).duration(600).springify()}>
                                <TouchableOpacity onPress={() => setEditPasswordModal(false)}>
                                    <Text className="text-xl font-bold text-white text-center">Close</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        </View>
                    </Modal>
                    <View className="p-4">
                        <View className="flex-row flex-wrap">
                            {itemList?.sort((itemA, itemB) => {
                                if (itemA.state === 'DISABLED' && itemB.state !== 'DISABLED') {
                                    return 1; // itemA comes after itemB
                                } else if (itemA.state !== 'DISABLED' && itemB.state === 'DISABLED') {
                                    return -1; // itemA comes before itemB
                                } else {
                                    return itemB.id - itemA.id; // default sorting by id
                                }
                            })
                                .map((item, i) =>
                                    <ItemCard key={i} id={item.id} views={item.views} state={item.state} userId={item.userId} title={item.title} itemPicture={item.itemPicture} description={item.description}
                                          category={item.category} priceTier={item.priceTier} buttonPressFunction={() => editOpenHandler(item)} buttonText={'Edit'}/>)}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    )};

export default Profile;