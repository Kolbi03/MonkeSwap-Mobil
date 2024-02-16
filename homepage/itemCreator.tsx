import React from "react";
import {Pressable, StyleSheet, Text, TextInput, View} from "react-native";
import {StatusBar} from "expo-status-bar";
import SelectDropdown from 'react-native-select-dropdown'


const categories = ["1", "2", "3", "4", "5", "6"]
const ItemCreator = ({ navigation }) => {
    return(
        <View style={styles.container}>
            <StatusBar style='auto' />

            <Text style={styles.login}>Tárgy létrehozása</Text>

            <Text style={styles.text}>Tárgy neve</Text>
            <TextInput style={styles.textInput}/>

            <Text style={styles.text}>Leírás</Text>
            <TextInput style={styles.textInput}/>

            <Text style={styles.text}>Kategória</Text>
            <SelectDropdown defaultButtonText={"Válassz egy kategóriát"} searchPlaceHolder={"Válaszd"} data={categories} onSelect={(selectedItem, index) => {
                console.log(selectedItem, index)
            }}/>

            <Pressable onPress={() => {
                navigation.navigate('MainPage')
                //Ide jön a létrehozás
            }}>
                <Text style={styles.pressButton}>Tárgy létrehozása</Text>
            </Pressable>

            <Pressable onPress={() => {
                navigation.navigate('Homepage')
            }}>
                <Text style={styles.pressButton}>Vissza a főoldalra</Text>
            </Pressable>
        </View>
)}

export default ItemCreator;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        alignItems: "center",
    },

    textInput: {
        height: 50,
        minWidth:300,
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 20,
        padding: 10,
        fontSize: 20,

    },

    login: {
        fontSize: 34,
        padding: 4,
        textAlignVertical: "top",
        marginTop: 10,
    },

    text: {
        fontSize: 24,
        padding: 14,
    },

    pressButton: {
        fontSize: 20,
        borderWidth: 10,
        borderColor: '#ffda39',
        backgroundColor: '#ffda39',
        borderRadius: 20,
        textAlign: "center",
        textAlignVertical: "center",
        color: 'black',
        marginTop: 15,
    }
});