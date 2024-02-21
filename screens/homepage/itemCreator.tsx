import React from "react";
import {Image, Pressable, StyleSheet, Text, TextInput, View} from "react-native";
import {StatusBar} from "expo-status-bar";
import SelectDropdown from 'react-native-select-dropdown'
import Styles from "../../Stylesheet";
import { Dimensions } from "react-native";


const categories = ["1", "2", "3", "4", "5", "6"]

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const ItemCreator = ({ navigation }) => {
    const styles = Styles;

    return(

        <View style={styles.container}>
            <StatusBar style='auto' />

            <Text style={styles.login}>Item creation</Text>

            <Text style={styles.text}>Title</Text>
            <View style={styles.textInput}>
                <TextInput placeholder='Rubber duckie' placeholderTextColor={'gray'}/>
            </View>

            <Text style={styles.text}>Description</Text>
            <View style={styles.textInput}>
                <TextInput placeholder='It floats' placeholderTextColor={'gray'}/>
            </View>

            <Text style={styles.text}>Categories</Text>
            <SelectDropdown defaultButtonText={"Choose a category"} searchPlaceHolder={"Search"} data={categories} onSelect={(selectedItem, index) => {
                console.log(selectedItem, index)
            }}/>

            <Text style={styles.text}>Price category</Text>
            <View style={localStyles.priceCategoryContainer}>
                <Pressable onPress={() => {
                    console.log('image 1 pressed')
                }}>
                    <Image source={require('../../assets/monke.jpg')} style={localStyles.categoryImage}/>
                </Pressable>

                <Pressable onPress={() => {
                    console.log('image 1 pressed')
                }}>
                    <Image source={require('../../assets/monke.jpg')} style={localStyles.categoryImage}/>
                </Pressable>

                <Pressable onPress={() => {
                    console.log('image 1 pressed')
                }}>
                    <Image source={require('../../assets/monke.jpg')} style={localStyles.categoryImage}/>
                </Pressable>

                <Pressable onPress={() => {
                    console.log('image 1 pressed')
                }}>
                    <Image source={require('../../assets/monke.jpg')} style={localStyles.categoryImage}/>
                </Pressable>

                <Pressable onPress={() => {
                    console.log('image 1 pressed')
                }}>
                    <Image source={require('../../assets/monke.jpg')} style={localStyles.categoryImage}/>
                </Pressable>
            </View>

            <Pressable onPress={() => {
                navigation.navigate('MainPage')
                //Ide jön a létrehozás
            }}>
                <Text style={styles.pressButton}>Create</Text>
            </Pressable>

            <Pressable onPress={() => {
                navigation.navigate('Homepage')
            }}>
                <Text style={styles.pressButton}>Back to homepage</Text>
            </Pressable>

        </View>


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
    }

})