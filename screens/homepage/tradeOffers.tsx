import {Modal, Pressable, Text, View} from "react-native";
import TradeOfferComponent from "../../components/tradeOfferComponent";
import React, {useContext, useEffect, useState} from "react";
import Styles from "../../Stylesheet";
import axios from "../../axios";
import {AuthContext} from "../../contexts/authContext";
import TradeOfferDTO from "../../interfaces/tradeOfferDTO";

const TradeOffers = () => {

    const {token} = useContext(AuthContext)

    const [visible, setVisible] = useState(true);
    const [incomingOffers, setIncomingOffers] = useState<TradeOfferDTO[]>()

    const config = {
        headers: {
            Authorization: 'Bearer ' + token?.token
        }
    }


    function getIncoming() {
        axios.get('/incoming', config)
            .then((response) => {
                setIncomingOffers(response.data)
            })
            .catch((e) => console.log(e.response.data))
    }

    useEffect(() => {
        getIncoming()
    }, []);

    return (
        <View className="backdrop:accent-white flex-1 flex-col">
            <Pressable onPress={() => setVisible(!visible)}>
                <Text style={Styles.pressButton}>Open</Text>
            </Pressable>
            <Modal
                animationType="slide"
                transparent={false}
                presentationStyle={"overFullScreen"}
                visible={visible}
                onRequestClose={() => {
                    setVisible(!visible);
                }}>
                <Pressable onPress={() => setVisible(!visible)}>
                    <Text style={Styles.pressButton}>Sent Offers</Text>
                </Pressable>
                <Pressable onPress={() => setVisible(!visible)}>
                    <Text style={Styles.pressButton}>Incoming Offers</Text>
                </Pressable>
            </Modal>
            <TradeOfferComponent id={'1'} offeredItem={'asd'} incomingItem={'asd'} comment={'asd'} />
            <TradeOfferComponent id={'2'} offeredItem={'asd'} incomingItem={'asd'} comment={'asd'} />
            <TradeOfferComponent id={'3'} offeredItem={'asd'} incomingItem={'asd'} comment={'asd'} />
        </View>
    )
}

export default TradeOffers;