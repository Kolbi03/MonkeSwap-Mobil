import {Modal, Pressable, ScrollView, Text, ToastAndroid, View} from "react-native";
import TradeOfferComponent from "../../components/tradeOfferComponent";
import React, {useContext, useEffect, useState} from "react";
import Styles from "../../Stylesheet";
import TradeOfferDTO from "../../interfaces/tradeOfferDTO";
import {HttpContext} from "../../provider/httpProvider";

const TradeOffers = () => {

    const axios = useContext(HttpContext)

    const [visible, setVisible] = useState(true);
    const [tradeOfferType, setTradeOfferType] = useState<boolean>()
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
        setTradeOfferType(false)
        setVisible(!visible)
    }

    function sentOffersButton() {
        setTradeOfferType(true)
        setVisible(!visible)

    }

    useEffect(() => {
        setVisible(true)
        getOffered()
        getIncoming()
    }, []);


    return (
        <View className="backdrop:bg-white">
            <View className="justify-items-center backdrop:bg-white">
            <Pressable onPress={() => setVisible(!visible)}>
                <Text style={Styles.pressButton}>Open</Text>
            </Pressable>
                <ScrollView>
                    {   tradeOfferType ? offeredOffers?.map((item, i) =>
                            <TradeOfferComponent key={i} id={item.id} offeredItem={item.offeredItem} incomingItem={item.incomingItem}
                                                comment={item.comment} type={tradeOfferType}/>) :
                        incomingOffers?.map((item, i) =>
                            <TradeOfferComponent key={i} id={item.id} offeredItem={item.offeredItem} incomingItem={item.incomingItem}
                                                 comment={item.comment} type={tradeOfferType}/>)}
                </ScrollView>
                <Modal
                    animationType="slide"
                    transparent={true}
                    //presentationStyle={"overFullScreen"}
                    visible={visible}
                    onRequestClose={() => {
                        ToastAndroid.showWithGravity('You must choose the type of offers!', 2000, 1)
                    }}>
                        <View style={{height: "30%", backgroundColor: "#FFF", marginTop: "auto", borderRadius: 20}}>
                            <Pressable onPress={incomingOffersButton}>
                                <Text style={Styles.pressButton}>Sent Offers</Text>
                            </Pressable>
                            <Pressable onPress={sentOffersButton}>
                                <Text style={Styles.pressButton}>Incoming Offers</Text>
                            </Pressable>
                        </View>
                </Modal>
            </View>
        </View>
    )
}

export default TradeOffers;