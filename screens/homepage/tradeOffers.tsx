import {Dimensions, Modal, Pressable, Text, ToastAndroid, View} from "react-native";
import TradeOfferComponent from "../../components/tradeOfferComponent";
import React, {useContext, useEffect, useState} from "react";
import Styles from "../../Stylesheet";
import {AuthContext} from "../../contexts/authContext";
import TradeOfferDTO from "../../interfaces/tradeOfferDTO";
import {HttpContext} from "../../provider/httpProvider";

const TradeOffers = () => {

    const {token} = useContext(AuthContext)
    const axios = useContext(HttpContext)

    const [visible, setVisible] = useState(true);
    const [tradeOfferType, setTradeOfferType] = useState<boolean>()
    const [incomingOffers, setIncomingOffers] = useState<TradeOfferDTO[]>()
    const [offeredOffers, setOfferedOffers] = useState<TradeOfferDTO[]>()
    const [offerList, setOfferList] = useState<React.JSX.Element[] | undefined>()

    const config = {
        headers: {
            Authorization: 'Bearer ' + token?.token
        }
    }


    function getIncoming() {
        ///setOfferList(undefined)
        axios.get('tradeoffer/incoming')
            .then((response) => {
                setIncomingOffers(response.data)
                console.log(response.data)
                setTradeOfferType(true)
            })
            .catch((e) => console.log(e))
        setVisible(!visible)

        setOfferList(incomingOffers?.map((item, i) =>
            <TradeOfferComponent key={i} id={item.id} offeredItem={item.offeredItem} incomingItem={item.incomingItem}
                                 comment={item.comment} type={tradeOfferType}/>
        ))
    }

    function getOffered() {
        //setOfferList(undefined)
        axios.get('tradeoffer/offered')
            .then((response) => {
                setOfferedOffers(response.data)
                console.log(response.data)
                setTradeOfferType(false)
            })
            .catch((e) => console.log(e))
        setVisible(!visible)

        setOfferList(offeredOffers?.map((item, i) =>
            <TradeOfferComponent key={i} id={item.id} offeredItem={item.offeredItem} incomingItem={item.incomingItem}
                                 comment={item.comment} type={tradeOfferType}/>
        ))
    }

    useEffect(() => {
        setVisible(true)
    }, []);

    return (
        <View className="backdrop:bg-white">
            <View className="justify-items-center backdrop:bg-white">
            <Pressable onPress={() => setVisible(!visible)}>
                <Text style={Styles.pressButton}>Open</Text>
            </Pressable>
            {offerList}
                <Modal
                    animationType="slide"
                    transparent={true}
                    //presentationStyle={"overFullScreen"}
                    visible={visible}
                    onRequestClose={() => {
                        ToastAndroid.showWithGravity('You must choose the type of offers!', 2000, 1)
                    }}>
                        <View style={{height: "30%", backgroundColor: "#FFF", marginTop: "auto", borderRadius: 20}}>
                            <Pressable onPress={getOffered}>
                                <Text style={Styles.pressButton}>Sent Offers</Text>
                            </Pressable>
                            <Pressable onPress={getIncoming}>
                                <Text style={Styles.pressButton}>Incoming Offers</Text>
                            </Pressable>
                        </View>
                </Modal>
            </View>
        </View>
    )
}

export default TradeOffers;