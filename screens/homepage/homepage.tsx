import React, {useContext, useEffect, useState} from "react";
import {Image, Modal, ScrollView, Text, TextInput, ToastAndroid, TouchableOpacity, View} from "react-native";
import {AuthContext} from "../../contexts/authContext";
import itemDataDTO from "../../interfaces/itemDataDTO";
import ItemCard from "../../components/itemCard";
import SelectDropdown from "react-native-select-dropdown";
import {HttpContext} from "../../provider/httpProvider";
import {StatusBar} from "expo-status-bar";
import Animated from "react-native-reanimated";
import {Buffer} from "buffer";
import {Icon} from "react-native-paper";

const Homepage = () => {

    const categories = ["ALL", "OTHER", "VEHICLE", "HOME", "HOUSEHOLD", "ELECTRONICS", "FREETIME", "SPORT", "FASHION", "COLLECTIBLES", "PETS" ]

    const {token} = useContext(AuthContext);
    const axios = useContext(HttpContext);

    const [itemList, setItemList] = useState<itemDataDTO[]>();
    const [ownItemList, setOwnItemList] = useState<itemDataDTO[]>();
    const [visible, setVisible] = useState(false);
    const [incomingItemId, setIncomingItemId] = useState<number>(0)
    const [incomingItem, setIncomingItem] = useState<itemDataDTO>()
    const [username, setUsername] = useState('');
    const [tradeOfferComment, setTradeOfferComment] = useState('')

    const config = {
        headers: {
            Authorization: 'Bearer ' + token?.token
        }
    }

    /*Pulls the user's data*/
    const getUserData  = () => {
        axios.get('/user', config)
            .then((response) => {
                setUsername(response.data.username)
            })
            .catch((e) => console.log(e))
    }

    /*Loads the cards for viewing, the user's own cards are not loaded here*/
    function loadCards() {
        axios.get('/items')
            .then((response) => {
                setItemList(response.data);
            })
            .catch((e) => console.log(e))
    }

    /*Loads the user's own cards for sending trade offers*/
    const loadOwnCards = () => {
        axios.get('/user/items')
            .then((response) => {
                setOwnItemList(response.data)
            })
            .catch((e) => console.log(e))
    }

    /*Sends a trade offer, when it is successful sends a notification to the receiver*/
    function sendOffer(offeredItemId: number) {
        setVisible(() => !visible)
        if(offeredItemId === null) {
            ToastAndroid.showWithGravity('NO ITEM SELECTED', 2000, 1)
        } else {
            axios.post('/tradeoffer', {
                offeredItem: offeredItemId,
                incomingItem: incomingItemId,
                comment: tradeOfferComment
            }, config)
                .then(() => {
                    ToastAndroid.showWithGravity('Trade offer sent!', 2000, 1)
                    setTradeOfferComment('');
                    axios.post('/notification', {
                        message: username + ' sent you a trade request!',
                        type: 'NOTIFICATION',
                        userId: incomingItem?.userId
                    }, config)
                        .catch((e) => console.log('Notification error: ' + e.response.data))


                })
                .catch((e) => ToastAndroid.showWithGravity(e.response.data, 2000, 1))
        }
    }

    /*Opens the modal of the item with the given parameters, also adds a view to the viewed item*/
    function modalHandler(item: itemDataDTO) {
        if(item.id === null) {
            ToastAndroid.showWithGravity('NO ITEM SELECTED', 2000, 1)
        } else {
            setVisible(() => !visible)
            setIncomingItem(item)
            setIncomingItemId(item.id)
            axios.put('/item/views/' + item.id, {})
                .then((response) => console.log(response.data))
                .catch((e) => console.log('Incoming item error:' + e))
        }

    }

    /*Searches items by category, only the items with the searched category will show up*/
    const searchByCategory = (category: string) => {
        if(category === '') {
            ToastAndroid.showWithGravity('You have to chose a category!', 2000, 1)
        } else if (category === 'ALL') {
            loadCards()
        } else {
            axios.get('/items/' + category, config)
                .then((response) => {
                    setItemList(response.data)
                })
                .catch((e) => console.log(e.response.data))
        }
    }

    /*Reports an item*/
    function reportHandler(itemId: number) {
        axios.put('/item/reports/' + itemId, {})
            .then(() =>ToastAndroid.showWithGravity('Item successfully reported', 2000, 1))
            .catch((e) => ToastAndroid.showWithGravity(e.response.data, 2000, 1))
    }

    /*Opens/closes the modal*/
    function cardFlipHandler() {
        setVisible(!visible);
    }

    useEffect(() => {
        loadCards()
        getUserData()
        loadOwnCards()
    }, [axios]);

    return(
        <View className="bg-white h-full- w-full flex-1 px-4 pt-16">
            <StatusBar style="auto"/>
            <ScrollView>
                <View className="flex-column">
                    <Animated.View className="flex-row pb-4">
                        <Text className="text-xl p-2 text-gray-800 pl-0 pr-20">Search: </Text>
                        <SelectDropdown buttonStyle={{borderRadius: 20}} defaultButtonText={"Choose a category"} searchPlaceHolder={"Search"} data={categories}
                                        onSelect={(selectedItem) => {searchByCategory(selectedItem) }}/>
                    </Animated.View>
                    <Modal
                        animationType="slide"
                        transparent={false}
                        presentationStyle={"overFullScreen"}
                        visible={visible}
                        onShow={loadOwnCards}
                        onRequestClose={cardFlipHandler}>
                        <View className="flex-1 backdrop:bg-white px-2 items-center w-full">
                            <ScrollView className="w-full">
                                <View className="pb-8">
                                    <Animated.Text className="text-4xl font-bold text-center py-6 pt-12">{incomingItem?.title}</Animated.Text>
                                    {incomingItem?.itemPicture ?
                                        <Image className="rounded-xl w-10/12 h-80 self-center"
                                                                        source={{uri: "data:image/png;base64," + Buffer.from(incomingItem.itemPicture as string, 'base64').toString('ascii')}}/>
                                        :
                                        <View className="self-center">
                                            <Icon size={100} source={"image"} color="#AAA"/>
                                        </View>
                                    }
                                </View>
                                <View className="flex-col w-full backdrop:bg-gray-200 rounded-2xl p-4">
                                    <Text className="text-xl py-2">Description: {incomingItem?.description}</Text>
                                    <Text className="text-xl py-2">Category: {incomingItem?.category}</Text>
                                    <Text className="text-xl py-2">Price Tier: {incomingItem?.priceTier}</Text>

                                    <View>
                                        <Animated.View className="w-full bg-black/5 rounded-2xl p-5 h-14">
                                            <TextInput placeholder='Comment' onChangeText={text => setTradeOfferComment(text)} placeholderTextColor={'gray'}/>
                                        </Animated.View>
                                    </View>
                                </View>

                                <Animated.View className="w-80 self-center bg-red-500 p-3 rounded-2xl my-4">
                                    <TouchableOpacity onPress={() => reportHandler(incomingItemId)}>
                                        <Text className="text-xl font-bold text-white text-center">Report</Text>
                                    </TouchableOpacity>
                                </Animated.View>

                                <View className="flex-row flex-wrap backdrop:bg-gray-200 rounded-2xl">
                                    {ownItemList?.sort((itemA, itemB) => itemB.id - itemA.id)
                                        .map((item, i ) =>
                                        <ItemCard key={i} views={item.views} state={item.state} userId={item.userId} buttonPressFunction={() => sendOffer(item.id)} id={item.id} title={item.title} itemPicture={item.itemPicture} description={item.description}
                                                  category={item.category} priceTier={item.priceTier} buttonText={'Send Offer'}/>)}
                                </View>

                            </ScrollView>
                        </View>
                    </Modal>
                </View>
                <View className="flex-row flex-wrap">
                    {itemList?.sort((itemA, itemB) => itemB.id - itemA.id)
                        .map((item, i) =>
                        <ItemCard key={i} views={item.views} state={item.state} buttonPressFunction={() => modalHandler(item)} id={item.id} userId={item.userId} title={item.title} itemPicture={item.itemPicture} description={item.description}
                                  category={item.category} priceTier={item.priceTier} buttonText={'Details'}/>)}
                </View>
            </ScrollView>
        </View>
    )
}
export default Homepage;