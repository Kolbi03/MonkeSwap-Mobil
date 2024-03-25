import {Card} from "react-native-paper";
import {Pressable, Text, View} from "react-native";
import React, {useState} from "react";
import Styles from '../Stylesheet';
import itemDataDTO from "../interfaces/itemDataDTO";
import axios from "../axios";

const styles = Styles;

function ItemCard(item: itemDataDTO) {

    const [pressed, setPressed] = useState(true);
    return (
        <Card onPress={() => setPressed(!pressed)} mode={"elevated"} style={styles.card}>
            {pressed ?
                <View>
                    <Card.Title title={item.title}/>
                    <Card.Cover source={require('../assets/placeholderMonkeicon.jpg')}/>
                    <Card.Content>
                            <Text>{item.priceTier}</Text>
                    </Card.Content>
                </View>
                :
                <View>
                    <Card.Title style={{alignSelf: "center"}} title={'Details'}/>
                    <Card.Content>
                        <Text style={styles.text}>{item.description}</Text>
                        <Pressable>
                            <Text style={styles.pressButtonSmall}>PRESS ME</Text>
                        </Pressable>
                    </Card.Content>
                </View>}
        </Card>
    )
}

export default ItemCard;