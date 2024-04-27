import React, {useContext, useEffect, useState} from "react";
import {
    Dimensions,
    Image,
    Pressable,
    StyleSheet,
    TextInput,
    ToastAndroid,
    View,
    Modal,
    TouchableOpacity, ScrollView
} from "react-native";
import {StatusBar} from "expo-status-bar";
import SelectDropdown from 'react-native-select-dropdown'
import {Icon, Provider, Text} from 'react-native-paper';
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {AuthContext} from "../../contexts/authContext";
import Animated, {FadeIn, FadeInUp} from "react-native-reanimated";
import * as ImagePicker from 'expo-image-picker';
import axios from "../../axios";

const categories = ["OTHER", "VEHICLE", "HOME", "HOUSEHOLD", "ELECTRONICS", "FREETIME", "SPORT", "FASHION", "COLLECTIBLES", "PETS" ]

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

// @ts-ignore
const ItemCreator = () => {

    const {token} = useContext(AuthContext);

    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<string | null |undefined>('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');

    const [banana2, setBanana2] = useState(false);
    const [banana3, setBanana3] = useState(false);
    const [banana4, setBanana4] = useState(false);
    const [banana5, setBanana5] = useState(false);

    /*interface newItemDataDTO {
        title: string,
        itemPicture: string | undefined | null,
        description: string,
        category: string,
        priceTier: string,
    }*/

    /*const data: newItemDataDTO = {
        title: title,
        itemPicture: image,
        description: description,
        category: category,
        priceTier: price,
    }*/

    const pickImage = async () => {
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
            setImage(result.assets![0].base64)
        }
            /*console.log(base64Icon)
            console.log(itemPicture)*/
    };

    const body = {
        title: title,
        itemPicture: image as string,
        description: description,
        category: category as string,
        priceTier: price.toString(),
    }


    function handleSubmitEvent() {

        const formData = new FormData();
        formData.append('title', title);
        formData.append('itemPicture', image as string);
        formData.append('description', description);
        formData.append('category', category as string);
        formData.append('priceTier', price.toString());

        //console.log(formData)

        axios.post('/item', body, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: 'Bearer ' + token?.token
            },
            transformRequest: (data, headers) => {
                return formData;
            }},)
            .then(() => {
                ToastAndroid.showWithGravity('Item created!', 2000, 1)
            }).catch((e) => {
                ToastAndroid.showWithGravity(e, 2000, 1)
            });
    }

    useEffect(() => {
        switch (price) {
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
    }, [price]);

    const banana = <Image source={require('../../assets/peeled_banana.png')} className="h-8 w-8 m-0 p-0"/>

        return(
        <Provider>
            <KeyboardAwareScrollView className="w-full h-full flex-1 backdrop:bg-white p-4 pt-16">
                <StatusBar style='auto' />

                <View className="space-y-4">

                    <Animated.View className="items-center pb-4" entering={FadeIn.delay(100).duration(800)}>
                        <Text className="text-black font-bold text-4xl tracking-wider">Item Creation</Text>
                        <Text className="text-gray-500 font-bold text-xl tracking-wider">You can upload your items here</Text>
                    </Animated.View>

                    <Animated.View className="backdrop:bg-gray-200 w-full h-40 justify-center rounded-2xl" entering={FadeInUp.delay(150).duration(600).springify()}>
                        <Pressable onPress={pickImage}>
                            { image ? <Image style={{width: 150, height: 150}} className="self-center rounded-xl" source={{uri: "data:image/png;base64," + image}}/>
                                :
                                <View className="self-center">
                                    <Icon size={100} source={"image"} color="#AAA"/>
                                </View>
                            }
                        </Pressable>
                    </Animated.View>

                    <Animated.View className="w-full bg-black/5 rounded-2xl p-5 h-14" entering={FadeInUp.delay(200).duration(600).springify()}>
                        <TextInput placeholder='Title' placeholderTextColor={'gray'} onChangeText={(text) => setTitle(text)}/>
                    </Animated.View>

                    <Animated.View className="w-full bg-black/5 rounded-2xl p-5 h-14" entering={FadeInUp.delay(300).duration(600).springify()}>
                        <TextInput placeholder='Description' placeholderTextColor={'gray'} onChangeText={(text) => setDescription(text)}/>
                    </Animated.View>

                    <Animated.View className="w-full items-center" entering={FadeInUp.delay(500).duration(600).springify()}>
                        <SelectDropdown buttonStyle={{borderRadius: 14, backgroundColor: 'rgb(252 211 77)'}} buttonTextStyle={{color: "#FFF", fontWeight: "bold"}} defaultButtonText={"Choose a category"} searchPlaceHolder={"Search"} data={categories} onSelect={(selectedItem) => {
                            setCategory(selectedItem);
                        }}/>
                    </Animated.View>

                <View className="flex-row p-2.5">

                    <Modal
                        animationType="slide"
                        transparent={false}
                        presentationStyle={"overFullScreen"}
                        visible={visible}
                        onRequestClose={() => {
                            setVisible(!visible);
                        }}>
                        <View className="h-full w-full p-3">
                            <ScrollView className="space-y-3">
                                <Text className="font-bold text-3xl text-center pt-2">
                                    Price Tier Guide
                                </Text>
                                <Text className="p-2 pl-0 text-lg text-justify">Price tiers are purely indicational.
                                    On creation you select a price category and it will show up on the card.
                                </Text>
                                <Text className="p-2 pl-0 text-xl font-bold">
                                    The price tiers are as follows:
                                </Text>
                                <Text className="text-lg text-justify backdrop:bg-gray-300 rounded-2xl p-2">
                                    {banana} Cheaper items, such as books, household items and bananas
                                </Text>
                                <Text className="text-lg text-justify backdrop:bg-gray-300 rounded-2xl p-2">
                                    {banana} {banana} Medium-low value items, such as chargers, headphones and cologne/perfume
                                </Text>
                                <Text className="text-lg text-justify backdrop:bg-gray-300 rounded-2xl p-2">
                                    {banana} {banana} {banana} Medium value items, such as wristwatches, television and suits
                                </Text>
                                <Text className="text-lg text-justify backdrop:bg-gray-300 rounded-2xl p-2">
                                    {banana} {banana} {banana} {banana} Medium-high value items, such as furniture and old cars
                                </Text>
                                <Text className="text-lg text-justify backdrop:bg-gray-300 rounded-2xl p-2">
                                    {banana} {banana} {banana} {banana} {banana} Expensive items, such as new cars, high-end watches and everything above
                                </Text>
                                <View className="w-full bg-amber-300 p-3 rounded-2xl">
                                    <TouchableOpacity onPress={() => {
                                        setVisible(!visible)
                                    }}>
                                        <Text className="text-xl font-bold text-white text-center">Close</Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        </View>
                    </Modal>

                    <Animated.View entering={FadeInUp.delay(550).duration(600).springify()}>
                        <Pressable onPress={() => setVisible(!visible)}>
                            <Icon size={20} source={"information-outline"}/>
                        </Pressable>
                    </Animated.View>
                </View>
            </View>

            <View className="flex-row w-full h-24">

                <Animated.View entering={FadeInUp.delay(600).duration(600).springify()}>
                    <Pressable onPress={() => {
                        setPrice('1')
                    }}>
                        <Image source={require('../../assets/peeled_banana.png')} style={localStyles.categoryImage}/>
                    </Pressable>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(640).duration(600).springify()}>
                    <Pressable onPress={() => {
                        setPrice('2')
                    }}>
                        <Image source={!banana2 ? require('../../assets/banana.png') : require('../../assets/peeled_banana.png')} style={localStyles.categoryImage}/>
                    </Pressable>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(680).duration(600).springify()}>
                    <Pressable onPress={() => {
                        setPrice('3')
                    }}>
                        <Image source={!banana3 ? require('../../assets/banana.png') : require('../../assets/peeled_banana.png')} style={localStyles.categoryImage}/>
                    </Pressable>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(720).duration(600).springify()}>
                    <Pressable onPress={() => {
                        setPrice('4')
                    }}>
                        <Image source={!banana4 ? require('../../assets/banana.png') : require('../../assets/peeled_banana.png')} style={localStyles.categoryImage}/>
                    </Pressable>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(760).duration(600).springify()}>
                    <Pressable onPress={() => {
                        setPrice('5')
                    }}>
                        <Image source={!banana5 ? require('../../assets/banana.png') : require('../../assets/peeled_banana.png')} style={localStyles.categoryImage}/>
                    </Pressable>
                </Animated.View>
            </View>

            <View className="space-y-4">
                <Animated.View className="w-full bg-amber-300 p-3 rounded-2xl" entering={FadeInUp.delay(800).duration(600).springify()}>
                    <TouchableOpacity onPress={handleSubmitEvent}>
                        <Text className="text-xl font-bold text-white text-center">Create</Text>
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