import {Card} from "react-native-paper";
import {Pressable, ScrollView, Text, View} from "react-native";
import React, {useState} from "react";
import Styles from '../Stylesheet';
import itemDataDTO from "../interfaces/itemDataDTO";
import Animated, {FadeIn, FadeInUp} from "react-native-reanimated";

const styles = Styles;

function ItemCard(item: itemDataDTO) {

    const [pressed, setPressed] = useState(true);

    return (
        <Card onPress={() => setPressed(!pressed)} mode={"elevated"} style={styles.card}>
            {pressed ?
                <Animated.View entering={FadeIn.duration(250)}>
                    <Card.Title title={item.title}/>
                    <Card.Cover source={require('../assets/placeholderMonkeicon.jpg')}/>
                    <Card.Content>
                            <Text>{item.priceTier}</Text>
                    </Card.Content>
                </Animated.View>
                :
                <Animated.View entering={FadeIn.duration(250)}>
                    <Card.Title style={{alignSelf: "center"}} title={'Details'}/>
                    <ScrollView>
                    <Card.Content>
                        <Text style={{fontSize: 14,
                            padding: 10,
                            color: '#444444',
                            paddingLeft: 0,
                            textAlign: "justify"}}>
                            {item.description}
                        </Text>
                        <Pressable style={{alignSelf: "baseline"}}>
                            <Text style={styles.pressButtonSmall} onPress={() => item.buttonPressFunction()}>{item.buttonText}</Text>
                        </Pressable>
                    </Card.Content>
                    </ScrollView>
                </Animated.View>
            }
        </Card>
    )
}

export default ItemCard;