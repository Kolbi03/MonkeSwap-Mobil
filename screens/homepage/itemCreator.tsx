import React, {useContext, useState} from "react";
import {
    Dimensions,
    Image,
    Pressable,
    StyleSheet,
    TextInput,
    ToastAndroid,
    View,
    Modal,
    TouchableOpacity
} from "react-native";
import {StatusBar} from "expo-status-bar";
import SelectDropdown from 'react-native-select-dropdown'
import Styles from "../../Stylesheet";
import { Provider, Text} from 'react-native-paper';
import {baseURL} from "../../backendURL";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {AuthContext} from "../../contexts/authContext";
import Animated, {FadeIn, FadeInUp} from "react-native-reanimated";
import * as ImagePicker from 'expo-image-picker';
import httpProvider, {HttpContext} from "../../provider/httpProvider";

const baseUrl = baseURL;

const categories = ["OTHER", "VEHICLE", "HOME", "HOUSEHOLD", "ELECTRONICS", "FREETIME", "SPORT", "FASHION", "COLLECTIBLES", "PETS" ]

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

// @ts-ignore
const ItemCreator = ({ navigation }) => {
    const styles = Styles;

    const {token} = useContext(AuthContext);
    const axios = useContext(HttpContext)

    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<Blob>();
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');

    interface newItemDataDTO {
        title: string,
        itemPicture: Blob | undefined,
        description: string,
        category: string,
        priceTier: string,
    }

    const data: newItemDataDTO = {
        title: title,
        itemPicture: image,
        description: description,
        category: category,
        priceTier: price,
    }

    const config = {
        headers: {
            Authorization: 'Bearer ' + token?.token
        }
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            base64: true,
            aspect: [1, 1],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            const response = await fetch(uri);
            const blob = await response.blob();
            setImage(blob)
            console.log(image)
        }
    };

    function handleSubmitEvent() {
        console.log('Pressed')
        const formData = new FormData();
        formData.append('title', title);
        if (image) {
            formData.append('itemPicture', image);
        }
        formData.append('description', description);
        formData.append('category', category as string);
        formData.append('priceTier', price.toString());

        axios.post('/item', formData)
            .then(() => {
                ToastAndroid.showWithGravity('Item created!', 2000, 1)
            }).catch((e) => {
                console.log(e)
            });
    }


        return(
        <Provider>
            <KeyboardAwareScrollView className="w-full h-full flex-1 backdrop:bg-white p-4 pt-16">
                <StatusBar style='auto' />

                <View className="space-y-4">


                    <Animated.View className="items-center pb-8" entering={FadeIn.delay(100).duration(800)}>
                        <Text className="text-black font-bold text-4xl tracking-wider">Item Creation</Text>
                        <Text className="text-gray-500 font-bold text-xl tracking-wider">You can upload your items here</Text>
                    </Animated.View>

                    <Animated.View className="w-full bg-black/5 rounded-2xl p-5 h-14" entering={FadeInUp.delay(200).duration(600).springify()}>
                        <TextInput placeholder='Title' placeholderTextColor={'gray'} onChangeText={(text) => setTitle(text)}/>
                    </Animated.View>

                    <Animated.View className="w-full bg-black/5 rounded-2xl p-5 h-14" entering={FadeInUp.delay(300).duration(600).springify()}>
                        <TextInput placeholder='Description' placeholderTextColor={'gray'} onChangeText={(text) => setDescription(text)}/>
                    </Animated.View>

                    <Animated.View className="w-full items-center" entering={FadeInUp.delay(400).duration(600).springify()}>
                        <TouchableOpacity className="w-full bg-amber-300 p-3 rounded-2xl" onPress={pickImage}>
                            <Text className="text-xl font-bold text-white text-center">Select image</Text>
                        </TouchableOpacity>
                        {/*{image ?
                        <Image source={image.} style={localStyles.categoryImage}></Image> : <></>}*/}
                    </Animated.View>

                    <Animated.View className="w-full items-center" entering={FadeInUp.delay(500).duration(600).springify()}>
                        <SelectDropdown buttonStyle={{borderRadius: 14, backgroundColor: 'rgb(252 211 77)'}} buttonTextStyle={{color: "#FFF", fontWeight: "bold"}} defaultButtonText={"Choose a category"} searchPlaceHolder={"Search"} data={categories} onSelect={(selectedItem) => {
                            setCategory(selectedItem);
                        }}/>
                    </Animated.View>

                <View style={{flexDirection: "row", padding: 10}}>

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
                            <Text style={styles.text}>Price categories placeholder</Text>
                            <Pressable
                                style={styles.pressButton}
                                onPress={() => setVisible(!visible)}>
                                <Text style={styles.text}>Back</Text>
                            </Pressable>
                            </View>
                        </View>
                    </Modal>

                    <Animated.View entering={FadeInUp.delay(550).duration(600).springify()}>
                        <Pressable onPress={() => setVisible(!visible)}>
                            <Image source={require('../../assets/monke.jpg')} style={localStyles.infoImage}/>
                        </Pressable>
                    </Animated.View>
                </View>
            </View>

            <View className="flex-row w-full">

                <Animated.View entering={FadeInUp.delay(600).duration(600).springify()}>
                    <Pressable onPress={() => {
                        setPrice('1')
                    }}>
                        <Image source={require('../../assets/monke.jpg')} style={localStyles.categoryImage}/>
                    </Pressable>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(640).duration(600).springify()}>
                    <Pressable onPress={() => {
                        setPrice('2')
                    }}>
                        <Image source={require('../../assets/monke.jpg')} style={localStyles.categoryImage}/>
                    </Pressable>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(680).duration(600).springify()}>
                    <Pressable onPress={() => {
                        setPrice('3')
                    }}>
                        <Image source={require('../../assets/monke.jpg')} style={localStyles.categoryImage}/>
                    </Pressable>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(720).duration(600).springify()}>
                    <Pressable onPress={() => {
                        setPrice('4')
                    }}>
                        <Image source={require('../../assets/monke.jpg')} style={localStyles.categoryImage}/>
                    </Pressable>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(760).duration(600).springify()}>
                    <Pressable onPress={() => {
                        setPrice('5')
                    }}>
                        <Image source={require('../../assets/monke.jpg')} style={localStyles.categoryImage}/>
                    </Pressable>
                </Animated.View>
            </View>

            <View className="space-y-4">
                <Animated.View className="w-full bg-amber-300 p-3 rounded-2xl" entering={FadeInUp.delay(800).duration(600).springify()}>
                    <TouchableOpacity onPress={handleSubmitEvent}>
                        <Text className="text-xl font-bold text-white text-center">Create</Text>
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View className="w-full bg-amber-300 p-3 rounded-2xl" entering={FadeInUp.delay(900).duration(600).springify()}>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('Homepage')
                    }}>
                        <Text className="text-xl font-bold text-white text-center">Back to homepage</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
            </KeyboardAwareScrollView>

        </Provider>
)}

export default ItemCreator;

const localStyles = StyleSheet.create({
    categoryImage: {
        height: screenHeight * 0.07,
        width: screenWidth * 0.14,
        margin: screenWidth * 0.02,
    },

    priceCategoryContainer: {
        flexDirection: "row",
    },

    infoImage: {
        height: screenHeight * 0.04,
        width: screenWidth * 0.08,
    }
})