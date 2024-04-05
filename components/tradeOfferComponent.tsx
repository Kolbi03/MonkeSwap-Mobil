import {Image, Modal, Pressable, ScrollView, Text, View} from "react-native";
import TradeOfferDTO from "../interfaces/tradeOfferDTO";
import React, {useContext, useEffect, useState} from "react";
import {HttpContext} from "../provider/httpProvider";
import itemDataDTO from "../interfaces/itemDataDTO";
import Styles from "../Stylesheet";

const TradeOfferComponent = (item: TradeOfferDTO) => {

    const axios = useContext(HttpContext)

    const [incomingItemData, setIncomingItemData] = useState<itemDataDTO>()
    const [offeredItemData, setOfferedItemData] = useState<itemDataDTO>()
    const [visible, setVisible] = useState<boolean>(false)
    const [type] = useState(item.type)

    function getIncomingItemData() {
        axios.get('/item/' + item.incomingItem)
            .then((response) => {
                setIncomingItemData(response.data)
                console.log(incomingItemData)
            })
            .catch((e) => console.log(e))
    }

    function getOfferedItemData() {
        axios.get('/item/' + item.offeredItem)
            .then((response) => {
                setOfferedItemData(response.data)
                console.log(incomingItemData)
            })
            .catch((e) => console.log(e))
    }

    function acceptOffer() {
        axios.delete('/tradeoffer/accept/' + item.id)
            .then(() => setVisible(false))
            .catch((e) => console.log(e))
    }

    function declineOffer() {
        axios.delete('/tradeoffer/decline/' + item.id)
            .then(() => setVisible(false))
            .catch((e) => console.log(e))
    }

    useEffect(() => {
        getIncomingItemData()
        getOfferedItemData()
    }, []);

    return (
        <View className="h-20 border-b-2 border-amber-400">
            <Pressable onPress={()=> setVisible(!visible)}>
                {!type ?
                <View>
                    <Text className="text-xl">
                        Your {offeredItemData?.title} has a pending trade for {incomingItemData?.title}!
                    </Text>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        //presentationStyle={"overFullScreen"}
                        visible={visible}
                        onRequestClose={() => setVisible(!visible)}>
                        <ScrollView style={{backgroundColor: "#FFF", borderRadius: 0, flex: 1}}>
                            <Image style={{width: "70%", borderRadius: 10}} source={require('../assets/placeholderMonkeicon.jpg')} />
                            <Text className="text-xl"> Name: {incomingItemData?.title}</Text>
                            <Text className="text-xl"> Description: {incomingItemData?.description}</Text>
                            <Text className="text-xl"> Category: {incomingItemData?.category}</Text>
                            <Text className="text-xl"> Price Tier: {incomingItemData?.priceTier}</Text>

                            <Image style={{width: "70%", borderRadius: 10}} source={require('../assets/placeholderMonkeicon.jpg')} />
                            <Text className="text-xl"> Name: {offeredItemData?.title}</Text>
                            <Text className="text-xl"> Description: {offeredItemData?.description}</Text>
                            <Text className="text-xl"> Category: {offeredItemData?.category}</Text>
                            <Text className="text-xl"> Price Tier: {offeredItemData?.priceTier}</Text>


                            <Pressable onPress={acceptOffer}>
                                <Text style={Styles.pressButton}>Accept Offer</Text>
                            </Pressable>
                            <Pressable onPress={declineOffer}>
                                <Text style={Styles.pressButton}>Decline Offer</Text>
                            </Pressable>
                        </ScrollView>
                    </Modal>
                </View>
                    :
                    <View>
                        <Text className={"text-xl"}>
                            You have offered a {incomingItemData?.title} for a {offeredItemData?.title}!
                        </Text>
                    </View>
                }
            </Pressable>
        </View>
    )
}

export default TradeOfferComponent