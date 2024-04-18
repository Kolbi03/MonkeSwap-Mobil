import {Modal, Pressable, ScrollView, Text, ToastAndroid, TouchableOpacity, View} from "react-native";
import TradeOfferComponent from "../../components/tradeOfferComponent";
import React, {useContext, useEffect, useState} from "react";
import Styles from "../../Stylesheet";
import TradeOfferDTO from "../../interfaces/tradeOfferDTO";
import {HttpContext} from "../../provider/httpProvider";
import {StatusBar} from "expo-status-bar";
import Animated, {FadeInUp} from "react-native-reanimated";

const TradeOffers = () => {

    const axios = useContext(HttpContext)

    const [visible, setVisible] = useState(true);
    const [tradeOfferType, setTradeOfferType] = useState<boolean>(true)
    const [incomingOffers, setIncomingOffers] = useState<TradeOfferDTO[]>()
    const [offeredOffers, setOfferedOffers] = useState<TradeOfferDTO[]>()

    function getIncoming() {
        axios.get('tradeoffer/incoming')
            .then((response) => {
                setIncomingOffers(response.data)
                //console.log(response.data)
            })
            .catch((e) => console.log(e))
    }

    function getOffered() {
        axios.get('tradeoffer/offered')
            .then((response) => {
                setOfferedOffers(response.data)
                //console.log(response.data)
            })
            .catch((e) => console.log(e))
    }

    function incomingOffersButton() {
        getIncoming()
        setTradeOfferType(false)
        setVisible(!visible)
        console.log(tradeOfferType)
        console.log(incomingOffers)
    }

    function sentOffersButton() {
        getOffered()
        setTradeOfferType(true)
        setVisible(!visible)
        console.log(tradeOfferType)
        console.log(offeredOffers)
    }

    useEffect(() => {
        setVisible(true)
        getOffered()
        getIncoming()
    }, [axios]);


    return (
        <View className="bg-white items-center h-full- w-full flex-1 p-2 pt-16">
            <StatusBar style="auto"/>
            <Animated.View className="w-full bg-amber-300 p-3 rounded-2xl" entering={FadeInUp.delay(150).duration(600).springify()}>
                <TouchableOpacity onPress={() => {
                    setVisible(!visible)
                }}>
                    <Text className="text-xl font-bold text-white text-center">Open</Text>
                </TouchableOpacity>
            </Animated.View>
                <ScrollView className="h-full w-full">
                    {tradeOfferType ?
                        offeredOffers?.sort((itemA, itemB) => itemB.id - itemA.id)
                            .map((item, i) =>
                            <TradeOfferComponent key={i} counter={i} id={item.id} offeredItem={item.offeredItem} incomingItem={item.incomingItem}
                                                comment={item.comment} type={tradeOfferType}/>) :
                        incomingOffers?.sort((itemA, itemB) => itemB.id - itemA.id)
                            .map((item, i) =>
                            <TradeOfferComponent key={i} counter={i} id={item.id} offeredItem={item.offeredItem} incomingItem={item.incomingItem}
                                                 comment={item.comment} type={tradeOfferType}/>)
                    }
                </ScrollView>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={visible}
                    onRequestClose={() => {
                        ToastAndroid.showWithGravity('You must choose the type of offers!', 2000, 1)
                    }}>
                        <View className="h-1/4 backdrop: bg-white mt-auto rounded-2xl space-y-8 px-4">
                            <Animated.View className="w-full bg-amber-300 p-3 rounded-2xl" entering={FadeInUp.delay(100).duration(600).springify()}>
                                <TouchableOpacity onPress={() => {
                                    sentOffersButton()
                                }}>
                                    <Text className="text-xl font-bold text-white text-center">Outgoing offers</Text>
                                </TouchableOpacity>
                            </Animated.View>
                            <Animated.View className="w-full bg-amber-300 p-3 rounded-2xl" entering={FadeInUp.delay(150).duration(600).springify()}>
                                <TouchableOpacity onPress={() => {
                                    incomingOffersButton()
                                }}>
                                    <Text className="text-xl font-bold text-white text-center">Incoming offers</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        </View>
                </Modal>
        </View>
    )
}

export default TradeOffers;