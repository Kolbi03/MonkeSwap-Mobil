import {Image, Modal, Pressable, ScrollView, Text, View} from "react-native";
import TradeOfferDTO from "../interfaces/tradeOfferDTO";
import React, {useContext, useEffect, useState} from "react";
import {HttpContext} from "../provider/httpProvider";
import itemDataDTO from "../interfaces/itemDataDTO";
import Styles from "../Stylesheet";
import Animated, {FadeInLeft} from "react-native-reanimated";
import {Icon} from "react-native-paper";
import {AuthContext} from "../contexts/authContext";

const TradeOfferComponent = (item: TradeOfferDTO) => {

    const axios = useContext(HttpContext)

    const [incomingItemData, setIncomingItemData] = useState<itemDataDTO>()
    const [offeredItemData, setOfferedItemData] = useState<itemDataDTO>()
    const [offeredVisible, setOfferedVisible] = useState<boolean>(false)
    const [incomingVisible, setIncomingVisible] = useState(false)
    const [username, setUsername] = useState('');

    function getIncomingItemData() {
        axios.get('/item/' + item.incomingItem)
            .then((response) => {
                setIncomingItemData(response.data)
                //console.log(incomingItemData)
            })
            .catch((e) => console.log(e))
    }

    function onClickIncoming() {
        setIncomingVisible(!incomingVisible)
    }

    function onClickOffered() {
        setOfferedVisible(!offeredVisible)
    }

    function userData() {
        axios.get('/user')
            .then((response) => {
                setUsername(response.data.username)
            })
            .catch((e) => console.log(e))
    }

    useEffect(() => {
        userData()
    }, []);

    function getOfferedItemData() {
        axios.get('/item/' + item.offeredItem)
            .then((response) => {
                setOfferedItemData(response.data)
                //console.log(incomingItemData)
            })
            .catch((e) => console.log(e))
    }

    function acceptOffer() {
        axios.delete('/tradeoffer/accept/' + item.id)
            .then(() => setIncomingVisible(false))
            .catch((e) => console.log(e))

        axios.post('/notification',
            {
                message: `Your trade offer has been accepted: ${offeredItemData?.title} for ${incomingItemData?.title}`,
                type: 'NOTIFICATION',
                userId: offeredItemData?.userId,
            }).then(() => {
        });
    }

    function declineOffer() {
        axios.delete('/tradeoffer/decline/' + item.id)
            .then(() => setIncomingVisible(false))
            .catch((e) => console.log(e))

        axios.post('/notification',
            {
                message: `Your trade offer has been declined: ${offeredItemData?.title} for ${incomingItemData?.title}`,
                type: 'NOTIFICATION',
                userId: offeredItemData?.userId,
            }).then(() => {
        });
    }

    function deleteOffer() {
        axios.delete('tradeoffer/decline/' + item.id)
            .then(() => {
                axios.post('/notification',
                    {
                        message: `${username} deleted a trade offer: ${offeredItemData?.title} for ${incomingItemData?.title}`,
                        type: 'NOTIFICATION',
                        userId: incomingItemData?.userId,
                    }).then(() => {
                });
            });
        setOfferedVisible(false);
    }

    useEffect(() => {
        getIncomingItemData()
        getOfferedItemData()
    }, [axios]);

    return (
        <View className="h-34 w-full px-2">
            {!item.type ?
                <>
            <Pressable onPress={()=> onClickIncoming()}>
                <Animated.View className={` rounded-2xl p-4 mx-0.5 my-1.5 flex-row justify-start items-center h-32 bg-gray-300`}
                               entering={FadeInLeft.delay(item.counter *  50).duration(600).springify()}>
                        <View className="w-2/12">
                            <View className="content-center">
                                    <Icon size={60} source={"arrow-down"} color={"#080"} />
                            </View>
                        </View>
                        <View className={`ml-6 ${item.type ? 'text-red-700' : 'text-black'}`}>
                            <Text className={'text-lg font-bold text-justify'}>
                                Your {incomingItemData?.title} has an offer for a {offeredItemData?.title}
                            </Text>
                        </View>
                    </Animated.View>

                </Pressable>

                <Modal
                    animationType="slide"
                    transparent={true}
                    //presentationStyle={"overFullScreen"}
                    visible={incomingVisible}
                    onRequestClose={() => setIncomingVisible(!incomingVisible)}>
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
            </>

                    :
                <>
                    <Pressable onPress={()=> onClickOffered()}>
                        <Animated.View className='rounded-2xl p-4 mx-0.5 my-1.5 flex-row justify-start items-center h-32 backdrop:bg-gray-300'
                                       entering={FadeInLeft.delay(item.counter *  50).duration(600).springify()}>
                            <View className="w-2/12">
                                <View className="content-center">
                                        <Icon size={60} source={"arrow-up"} color={"#080"} />
                                </View>
                            </View>
                            <View className={'ml-6'}>
                                <Text className={`text-lg font-bold text-justify text-black`}>
                                    You offered a {offeredItemData?.title} for a {incomingItemData?.title}
                                </Text>
                            </View>
                        </Animated.View>

                    </Pressable>

                    <Modal
                        animationType="slide"
                        transparent={true}
                        //presentationStyle={"overFullScreen"}
                        visible={offeredVisible}
                        onRequestClose={() => setOfferedVisible(!offeredVisible)}>
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


                            <Pressable onPress={deleteOffer}>
                                <Text style={Styles.pressButton}>Delete Offer</Text>
                            </Pressable>
                        </ScrollView>
                    </Modal>
                </>
}
        </View>
    )
}

export default TradeOfferComponent