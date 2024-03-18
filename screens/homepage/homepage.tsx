import React, {useContext, useEffect, useState} from "react";
import {Pressable, ScrollView, Text, View} from "react-native";
import Styles from "../../Stylesheet";
import axios from "axios";
import {baseURL} from "../../backendURL";
import {AuthContext} from "../../contexts/authContext";
import itemDataDTO from "../../interfaces/itemDataDTO";
import ItemCard from "../../components/itemCard";

const baseUrl = baseURL

let itemCards: React.JSX.Element[] | undefined;

// @ts-ignore
const Homepage = ({ navigation }) => {

    const {token} = useContext(AuthContext);
    const [itemList, setItemList] = useState<itemDataDTO[]>();

    const config = {
        headers: {
            Authorization: 'Bearer ' + token?.token
        }
    }

    function loadCards() {
        axios.get(baseUrl + '/items', config)
            .then((response) => {
                console.log(response.data);
                setItemList(response.data);
                console.log('itemList: ' + itemList)
            })
            .catch((e) => console.log(e))

        if(itemList === undefined) {} else {

            itemCards = itemList.map((item, i) =>

                <ItemCard key={i} title={item.title} itemPicture={item.itemPicture} description={item.description}
                          category={item.category} priceTier={item.priceTier}/>);

            console.log('itemCards: ' + itemCards)
        }
    }


    useEffect(() => {
        loadCards()
        loadCards()
    }, []);

    const styles = Styles;
    return(
        <View style={styles.container}>
            <ScrollView>
                <View style={{flexDirection: "row"}}>
                    <Pressable onPress={loadCards}>
                        <Text style={styles.pressButton}>Load Cards</Text>
                    </Pressable>
                </View>
                <View style={{flexDirection: "row"}}>
                {itemCards}
                </View>
            </ScrollView>
        </View>
    )
}
export default Homepage;