import {Modal, Pressable, ScrollView, Text, ToastAndroid, View} from "react-native";
import TradeOfferComponent from "../../components/tradeOfferComponent";
import React, {useContext, useEffect, useState} from "react";
import Styles from "../../Stylesheet";
import TradeOfferDTO from "../../interfaces/tradeOfferDTO";
import {HttpContext} from "../../provider/httpProvider";
import {StatusBar} from "expo-status-bar";

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
            <Pressable onPress={() => setVisible(!visible)}>
                <Text style={Styles.pressButton}>Open</Text>
            </Pressable>
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
                        <View style={{height: "30%", backgroundColor: "#FFF", marginTop: "auto", borderRadius: 20}}>
                            <Pressable onPress={sentOffersButton}>
                                <Text style={Styles.pressButton}>Sent Offers</Text>
                            </Pressable>
                            <Pressable onPress={incomingOffersButton}>
                                <Text style={Styles.pressButton}>Incoming Offers</Text>
                            </Pressable>
                        </View>
                </Modal>
        </View>
    )
}

export default TradeOffers;