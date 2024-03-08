import {Card} from "react-native-paper";
import {Text} from "react-native";
import React from "react";
import Styles from '../Stylesheet';
import itemDataDTO from "../interfaces/itemDataDTO";

const styles = Styles;

function ItemCard(item: itemDataDTO) {
    return (
        <Card mode={"elevated"} style={styles.card}>
            <Card.Title title={item.title}/>
            <Card.Cover source={require('../assets/placeholderMonkeicon.jpg')}/>
            <Card.Content>
                <Text>{item.priceTier}</Text>
                <Text>{item.category}</Text>
                <Text>{item.description}</Text>
            </Card.Content>
        </Card>
    )
}

export default ItemCard;