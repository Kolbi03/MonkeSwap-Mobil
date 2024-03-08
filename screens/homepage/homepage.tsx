import React, {useContext, useEffect, useState} from "react";
import {Pressable, ScrollView, Text, View} from "react-native";
import Styles from "../../Stylesheet";
import axios from "axios";
import {baseURL} from "../../backendURL";
import {AuthContext} from "../../contexts/authContext";
import itemDataDTO from "../../interfaces/itemDataDTO";
import ItemCard from "../../components/itemCard";
import {Icon} from "react-native-paper";

const baseUrl = baseURL

// @ts-ignore
const Homepage = ({ navigation }) => {

    const {token} = useContext(AuthContext);

    const [itemList, setItemList] = useState<Array<itemDataDTO>>();

    const config = {
        headers: {
            Authorization: 'Bearer ' + token?.token
        }
    }

    async function loadCards() {
            await axios.get(baseUrl + '/items', config)
                .then((response) => {
                    setItemList(response.data);
                    console.log(response.data)
                })
                .catch((e) => console.log(e))

            itemList?.map((item) => {
                <ItemCard title={item.title} itemPicture={item.itemPicture} description={item.description}
                          category={item.category} priceTier={item.priceTier}/>

            })
    }

    useEffect(() => {
        //loadCards();
    }, []);

    const styles = Styles;
    return(
        <View style={styles.container}>
            <ScrollView>
                <View style={{flexDirection: "row"}}>
                    <Pressable onPress={loadCards}>
                        <Text style={styles.pressButton}>Register</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    )
}
export default Homepage;