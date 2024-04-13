import {Card} from "react-native-paper";
import {Pressable, ScrollView, Text, TouchableOpacity, View} from "react-native";
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
                    <Card.Title className="text-l font-bold" title={item.title}/>
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
                        <Text className="p-2 text-gray-800 pl-0 text-justify">
                            {item.description}
                        </Text>
                        <View className="w-full pt-6">
                            <TouchableOpacity className="bg-amber-300 p-2 rounded-2xl" onPress={() => {
                                item.buttonPressFunction()
                            }}>
                                <Text className="text-xl font-bold text-white text-center">Details</Text>
                            </TouchableOpacity>
                        </View>

                    </Card.Content>
                    </ScrollView>
                </Animated.View>
            }
        </Card>
    )
}

export default ItemCard;