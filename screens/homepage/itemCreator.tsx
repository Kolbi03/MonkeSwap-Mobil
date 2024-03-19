import React, {useContext, useState} from "react";
import {Dimensions, Image, Pressable, StyleSheet, TextInput, ToastAndroid, View, Modal} from "react-native";
import {StatusBar} from "expo-status-bar";
import SelectDropdown from 'react-native-select-dropdown'
import Styles from "../../Stylesheet";
import { Provider, Text} from 'react-native-paper';
import {baseURL} from "../../backendURL";
import axios from "axios";
import itemDataDTO from "../../interfaces/itemDataDTO";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {AuthContext} from "../../contexts/authContext";

const baseUrl = baseURL;

const categories = ["OTHER", "2", "3", "4", "5", "6"]

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

// @ts-ignore
const ItemCreator = ({ navigation }) => {
    const styles = Styles;

    const {token} = useContext(AuthContext);

    const [visible, setVisible] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');

    const data: itemDataDTO = {
        title: name,
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

    return(
        <Provider>
            <KeyboardAwareScrollView style={{backgroundColor: '#FFFFFF'}}>
            <View style={styles.container}>
            <StatusBar style='auto' />

            <Text style={styles.header}>Item creation</Text>
                <Text style={{fontSize: 14, color:'#777'}}>You can create new items for trade</Text>

            <Text style={styles.text}>Title</Text>

            <View style={styles.textInput}>
                <TextInput placeholder='Rubber duckie' placeholderTextColor={'gray'} onChangeText={(text) => setName(text)}/>
            </View>

            <Text style={styles.text}>Description</Text>

            <View style={styles.textInput}>
                <TextInput placeholder='It floats' placeholderTextColor={'gray'} onChangeText={(text) => setDescription(text)}/>
            </View>

            <Text style={styles.text}>Image (placeholder)</Text>

            <View style={styles.textInput}>
                <TextInput placeholder='Placeholder for opening gallery' placeholderTextColor={'gray'} onChangeText={(text) => setImage(text)}/>
            </View>

            <Text style={styles.text}>Categories</Text>
            <SelectDropdown defaultButtonText={"Choose a category"} searchPlaceHolder={"Search"} data={categories} onSelect={(selectedItem) => {
                setCategory(selectedItem);
            }}/>

            <View style={{flexDirection: "row", padding: 10}}>
                <Text style={{fontSize: 24, textAlignVertical: "top"}}>Price category</Text>

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
                            style={[styles.pressButton, styles.pressButton]}
                            onPress={() => setVisible(!visible)}>
                            <Text style={styles.text}>Back</Text>
                        </Pressable>
                        </View>
                    </View>
                </Modal>

                <Pressable onPress={() => setVisible(!visible)}>
                    <Image source={require('../../assets/placeholderMonkeicon.jpg')} style={localStyles.infoImage}/>
                </Pressable>
            </View>

            <View style={localStyles.priceCategoryContainer}>
                <Pressable onPress={() => {
                    setPrice('1')
                }}>
                    <Image source={require('../../assets/monke.jpg')} style={localStyles.categoryImage}/>
                </Pressable>

                <Pressable onPress={() => {
                    setPrice('2')
                }}>
                    <Image source={require('../../assets/monke.jpg')} style={localStyles.categoryImage}/>
                </Pressable>

                <Pressable onPress={() => {
                    setPrice('3')
                }}>
                    <Image source={require('../../assets/monke.jpg')} style={localStyles.categoryImage}/>
                </Pressable>

                <Pressable onPress={() => {
                    setPrice('4')
                }}>
                    <Image source={require('../../assets/monke.jpg')} style={localStyles.categoryImage}/>
                </Pressable>

                <Pressable onPress={() => {
                    setPrice('5')
                }}>
                    <Image source={require('../../assets/monke.jpg')} style={localStyles.categoryImage}/>
                </Pressable>
            </View>


            <Pressable onPress={() => {
                axios.post(baseUrl + '/item', data, config)
                    .then(() =>
                    ToastAndroid.showWithGravity('Item created!', 2000, ToastAndroid.CENTER))
                    .catch(error => console.log(error))
            }}>
                <Text style={styles.pressButton}>Create</Text>
            </Pressable>

            <Pressable onPress={() => {
                navigation.navigate('Homepage')
            }}>
                <Text style={styles.pressButton}>Back to homepage</Text>
            </Pressable>
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