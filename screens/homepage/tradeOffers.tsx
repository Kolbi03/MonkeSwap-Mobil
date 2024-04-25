import {Modal, ScrollView, Text, ToastAndroid, TouchableOpacity, View} from "react-native";
import TradeOfferComponent from "../../components/tradeOfferComponent";
import React, {useContext, useEffect, useState} from "react";
import TradeOfferDTO from "../../interfaces/tradeOfferDTO";
import {HttpContext} from "../../provider/httpProvider";
import {StatusBar} from "expo-status-bar";
import Animated, {FadeInUp} from "react-native-reanimated";
import TradeOfferEnum from "../../Enums/tradeOfferEnum";

const TradeOffers = () => {

    const axios = useContext(HttpContext)

    const [visible, setVisible] = useState(true);
    const [tradeOfferType, setTradeOfferType] = useState<TradeOfferEnum>(TradeOfferEnum.Incoming)
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
        setTradeOfferType(TradeOfferEnum.Incoming)
        setVisible(!visible)
        /*console.log(tradeOfferType)
        console.log(incomingOffers)*/
    }

    function sentOffersButton() {
        getOffered()
        setTradeOfferType(TradeOfferEnum.Outgoing)
        setVisible(!visible)
        console.log(tradeOfferType)
        console.log(offeredOffers)
    }

    useEffect(() => {
        //setVisible(true)
        getOffered()
        getIncoming()
    }, [axios]);


    return (
        <View className="bg-white items-center h-full- w-full flex-1 p-2 pt-16">
            <StatusBar style="auto"/>
            <Animated.View className="w-full bg-amber-300 p-3 rounded-2xl mb-4" entering={FadeInUp.delay(150).duration(600).springify()}>
                <TouchableOpacity onPress={ () =>
                     setVisible(!visible)
                }>
                    <Text className="text-xl font-bold text-white text-center">Select offer type</Text>
                </TouchableOpacity>
            </Animated.View>
                <ScrollView className="h-full w-full">
                    {tradeOfferType === "OUTGOING" ?
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
                        <View className="h-1/6 backdrop: bg-white mt-auto rounded-2xl w-full flex-row items-center space-x-4 justify-center">
                            <Animated.View className="w-2/5 bg-amber-300 p-3 rounded-2xl" entering={FadeInUp.delay(150).duration(600).springify()}>
                                <TouchableOpacity onPress={() => {
                                    sentOffersButton()
                                }}>
                                    <Text className="text-xl font-bold text-white text-center">Outgoing</Text>
                                </TouchableOpacity>
                            </Animated.View>
                            <Animated.View className="w-2/5 bg-amber-300 p-3 rounded-2xl" entering={FadeInUp.delay(200).duration(600).springify()}>
                                <TouchableOpacity onPress={() => {
                                    incomingOffersButton()
                                }}>
                                    <Text className="text-xl font-bold text-white text-center">Incoming</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        </View>
                </Modal>
        </View>
    )
}

export default TradeOffers;