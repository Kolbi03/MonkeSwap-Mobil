import React from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";
import Styles from "../../Stylesheet";


const Homepage = ({ navigation }) => {
    const styles = Styles;
    return(
        <View style={styles.container}>
        <Text>Homepage</Text>

    <Pressable onPress={() => {
        navigation.navigate('Login')
        //Ide jön a redirect
    }}>
        <Text style={styles.pressButton}>Login</Text>
    </Pressable>
        </View>
    )
}
export default Homepage;