import Styles from "../../Stylesheet";
import {Pressable, Text, View} from "react-native";
import React, {useContext} from "react";
import {AuthContext} from "../../contexts/authContext";

const styles = Styles;

const Profile = ({navigation}) => {

    const {getUserData} = useContext(AuthContext);
    const {logout} = useContext(AuthContext);

    return (
    <View style={styles.container}>
        <Text style={styles.header}>Profile</Text>
        <Pressable onPress={() => {getUserData()}}>
        <Text style={styles.pressButton}>DEBUG LOG DATA</Text>
    </Pressable>

    <Pressable onPress={() => {logout()}}>
        <Text style={styles.pressButton}>Logout</Text>
    </Pressable>
    </View>
    )};

export default Profile;