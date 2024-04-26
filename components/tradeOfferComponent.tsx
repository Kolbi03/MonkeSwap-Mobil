import {Image, Modal, Pressable, ScrollView, Text, TouchableOpacity, View} from "react-native";
import TradeOfferDTO from "../interfaces/tradeOfferDTO";
import React, {useContext, useEffect, useState} from "react";
import {HttpContext} from "../provider/httpProvider";
import itemDataDTO from "../interfaces/itemDataDTO";
import Animated, {FadeInLeft} from "react-native-reanimated";
import {Icon} from "react-native-paper";
import {Buffer} from "buffer";
import PriceTier from "./priceTier";

const TradeOfferComponent = (item: TradeOfferDTO) => {

    const axios = useContext(HttpContext)

    const [incomingItemData, setIncomingItemData] = useState<itemDataDTO>()
    const [offeredItemData, setOfferedItemData] = useState<itemDataDTO>()
    const [offeredVisible, setOfferedVisible] = useState(false)
    const [incomingVisible, setIncomingVisible] = useState(false)
    const [username, setUsername] = useState('');
    const [incomingImage, setIncomingImage] = useState('')
    const [outgoingImage, setOutgoingImage] = useState('')

    function getIncomingItemData() {
        axios.get('/item/' + item.incomingItem)
            .then((response) => {
                setIncomingItemData(response.data)
                setIncomingImage(response.data.itemPicture)
                //console.log(incomingItemData)
            })
            .catch((e) => console.log(e))
    }

    function getOfferedItemData() {
        axios.get('/item/' + item.offeredItem)
            .then((response) => {
                setOfferedItemData(response.data)
                setOutgoingImage(response.data.itemPicture)
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

    function getUserData() {
        axios.get('/user')
            .then((response) => {
                setUsername(response.data.username)
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
        getUserData()
    }, []);

    useEffect(() => {
        getIncomingItemData()
        getOfferedItemData()
    }, [axios]);

    return (
        <View className="h-34 w-full px-2">
            {item.type === "INCOMING" ?
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
                    <ScrollView className="backdrop:bg-white flex p-4">
                        <Text className="text-center font-bold text-3xl">Incoming item:</Text>
                        <Image style={{width: 150, height: 150}} className="self-center rounded-xl align-middle my-4" source={{uri: "data:image/png;base64," + Buffer.from(outgoingImage as string, 'base64').toString('ascii')}} />
                        <View className="backdrop:bg-gray-300 my-4 rounded-2xl p-1 space-y-2">
                            <Text className="text-2xl font-bold text-center">{offeredItemData?.title}</Text>
                            <Text className="text-xl text-center">{offeredItemData?.description}</Text>
                            <View className="flex-row pb-2 pl-4 w-full justify-between px-4">
                                <PriceTier tier={offeredItemData?.priceTier as number}/>
                                <Text className="text-lg text-gray-500 pt-2">{offeredItemData?.category}</Text>
                            </View>
                        </View>

                        <Text className="text-center font-bold text-3xl">Outgoing item:</Text>
                        <Image style={{width: 150, height: 150}} className="self-center rounded-xl align-middle my-4" source={{uri: "data:image/png;base64," + Buffer.from(incomingImage as string, 'base64').toString('ascii')}} />
                        <View className="backdrop:bg-gray-300 my-4 rounded-2xl p-1 space-y-2">
                            <Text className="text-2xl font-bold text-center">{incomingItemData?.title}</Text>
                            <Text className="text-xl text-center">{incomingItemData?.description}</Text>
                            <View className="flex-row pb-2 pl-4 w-full justify-between px-4">
                                <PriceTier tier={incomingItemData?.priceTier as number}/>
                                <Text className="text-lg text-gray-500 pt-2">{incomingItemData?.category}</Text>
                            </View>
                        </View>
                        <Text className="font-bold text-xl text-center pb-4">Sender's comment: {item.comment}</Text>

                        <View className="space-y-4">
                            <Animated.View className="w-full bg-amber-300 p-3 rounded-2xl">
                                <TouchableOpacity onPress={acceptOffer}>
                                    <Text className="text-xl font-bold text-white text-center">Accept offer</Text>
                                </TouchableOpacity>
                            </Animated.View>
                            <Animated.View className="w-full bg-amber-300 p-3 rounded-2xl mb-8">
                                <TouchableOpacity onPress={declineOffer}>
                                    <Text className="text-xl font-bold text-white text-center">Decline offer</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        </View>
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
                        <ScrollView className="backdrop:bg-white flex p-4">
                            <Text className="text-center font-bold text-3xl">Incoming item:</Text>
                            <Image style={{width: 150, height: 150}} className="self-center rounded-xl align-middle my-4" source={{uri: "data:image/png;base64," + Buffer.from(outgoingImage as string, 'base64').toString('ascii')}} />
                            <View className="backdrop:bg-gray-300 my-4 rounded-2xl p-1 space-y-2">
                                <Text className="text-2xl font-bold text-center">{offeredItemData?.title}</Text>
                                <Text className="text-xl text-center">{offeredItemData?.description}</Text>
                                <View className="flex-row pb-2 pl-4 w-full justify-between px-4">
                                    <PriceTier tier={offeredItemData?.priceTier as number}/>
                                    <Text className="text-lg text-gray-500 pt-2">{offeredItemData?.category}</Text>
                                </View>
                            </View>

                            <Text className="text-center font-bold text-3xl">Outgoing item:</Text>
                            <Image style={{width: 150, height: 150}} className="self-center rounded-xl align-middle my-4" source={{uri: "data:image/png;base64," + Buffer.from(incomingImage as string, 'base64').toString('ascii')}} />
                            <View className="backdrop:bg-gray-300 my-4 rounded-2xl p-1 space-y-2">
                                <Text className="text-2xl font-bold text-center">{incomingItemData?.title}</Text>
                                <Text className="text-xl text-center">{incomingItemData?.description}</Text>
                                <View className="flex-row pb-2 pl-4 w-full justify-between px-4">
                                    <PriceTier tier={incomingItemData?.priceTier as number}/>
                                    <Text className="text-lg text-gray-500 pt-2">{incomingItemData?.category}</Text>
                                </View>
                            </View>
                            <Text className="font-bold text-xl text-center pb-4">Your comment: {item.comment}</Text>

                            <View className="space-y-4">
                                <Animated.View className="w-full bg-amber-300 p-3 rounded-2xl mb-8">
                                    <TouchableOpacity onPress={deleteOffer}>
                                        <Text className="text-xl font-bold text-white text-center">Delete offer</Text>
                                    </TouchableOpacity>
                                </Animated.View>

                            </View>
                        </ScrollView>
                    </Modal>
                </>
            }
        </View>
    )
}

export default TradeOfferComponent