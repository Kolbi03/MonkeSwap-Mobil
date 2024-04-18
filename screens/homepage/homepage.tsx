import React, {useContext, useEffect, useState} from "react";
import {Modal, Pressable, ScrollView, Text, TextInput, ToastAndroid, View} from "react-native";
import Styles from "../../Stylesheet";
import {AuthContext} from "../../contexts/authContext";
import itemDataDTO from "../../interfaces/itemDataDTO";
import ItemCard from "../../components/itemCard";
import SelectDropdown from "react-native-select-dropdown";
import {HttpContext} from "../../provider/httpProvider";
import {StatusBar} from "expo-status-bar";
import Animated, {FadeInUp} from "react-native-reanimated";

const Homepage = () => {

    const categories = ["ALL", "OTHER", "VEHICLE", "HOME", "HOUSEHOLD", "ELECTRONICS", "FREETIME", "SPORT", "FASHION", "COLLECTIBLES", "PETS" ]

    const {token} = useContext(AuthContext);
    const axios = useContext(HttpContext);

    const [itemList, setItemList] = useState<itemDataDTO[]>();
    const [ownItemList, setOwnItemList] = useState<itemDataDTO[]>();
    const [visible, setVisible] = useState(false);
    const [incomingItemId, setIncomingItemId] = useState<string>('')
    const [incomingItem, setIncomingItem] = useState<itemDataDTO>()
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState('');
    const [tradeOfferComment, setTradeOfferComment] = useState('')
    //const image = Buffer.from(incomingItem?.itemPicture as string, 'base64').toString('ascii')

    const config = {
        headers: {
            Authorization: 'Bearer ' + token?.token
        }
    }

    const getUserData  = () => {
        axios.get('/user', config)
            .then((response) => {
                //console.log('username: ' + response.data.username);
                setUsername(response.data.username)
            })
            .catch((e) => console.log(e))
    }

    function loadCards() {
        //console.log(token)
        axios.get('/items')
            .then((response) => {
                setItemList(response.data);
            })
            .catch((e) => console.log(e))
    }

    const loadOwnCards = () => {
        axios.get('/user/items')
            .then((response) => {
                setOwnItemList(response.data)
            })
            .catch((e) => console.log(e))
    }

    function sendOffer(offeredItemId: string) {
        setVisible(() => !visible)
        if(offeredItemId === null) {
            ToastAndroid.showWithGravity('NO ITEM SELECTED', 2000, 1)
        } else {
            console.log('Offered item id: ' + offeredItemId)
            console.log('Incoming item id: ' + incomingItemId)
        }

        axios.post('/tradeoffer', {offeredItem: offeredItemId, incomingItem: incomingItemId, comment: tradeOfferComment} , config)
            .then(() => {
                console.log('offeredItem: '  + offeredItemId + 'incomingItem: ' + incomingItemId)
                ToastAndroid.showWithGravity('Trade offer sent!', 2000, 1)
                setTradeOfferComment('');
                axios.post('/notification', {message: username + ' sent you a trade request!', type: 'NOTIFICATION', userId: userId}, config)
                    /*.then((response) => {
                        console.log(response.data)
                        console.log(username + ' ' + userId)
                    })*/
                    .catch((e) => console.log('Notification error: ' + e.response.data))
            })
            .catch((e) => ToastAndroid.showWithGravity(e.response.data, 2000, 1))
    }

    function modalHandler(item: itemDataDTO) {
        console.log(item)
        if(item.id === null) {
            ToastAndroid.showWithGravity('NO ITEM SELECTED', 2000, 1)
        } else {
            setVisible(() => !visible)
            setIncomingItem(item)
            setIncomingItemId(item.id)
            setUserId(item.userId)
            axios.put('/item/views/' + item.id, {})
                .then((response) => console.log(response.data))
                .catch((e) => console.log('Incoming item error:' + e))
            console.log('incoming item id: ' + item.id)
        }

    }

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

    function reportHandler(itemId: string) {
        axios.put('/item/reports/' + itemId, {})
            .then()
            .catch((e) => ToastAndroid.showWithGravity(e.response.data, 2000, 1))
    }

    function cardFlipHandler() {
        setVisible(!visible);
    }

    useEffect(() => {
        loadCards()
        getUserData()
        loadOwnCards()
    }, [axios]);

    const styles = Styles;

    return(
        <View className="bg-white h-full- w-full flex-1 px-4 pt-16">
            <StatusBar style="auto"/>
            <ScrollView>
                <View style={{flexDirection: "column"}}>
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
                                    {/*<Image className="rounded-xl w-10/12 h-80 self-center" source={{uri: "data:image/png;base64," + image}} />*/}
                                </View>
                                <View className="flex-col w-full backdrop:bg-gray-200 rounded-2xl p-4">
                                    <Text className="text-xl py-2">Description: {incomingItem?.description}</Text>
                                    <Text className="text-xl py-2">Category: {incomingItem?.category}</Text>
                                    <Text className="text-xl py-2">Price Tier: {incomingItem?.priceTier}</Text>

                                    <View>
                                        <Animated.View className="w-full bg-black/5 rounded-2xl p-5 h-14" entering={FadeInUp.delay(100).duration(600)}>
                                            <TextInput placeholder='Comment' onChangeText={text => setTradeOfferComment(text)} placeholderTextColor={'gray'}/>
                                        </Animated.View>
                                    </View>
                                </View>

                                <Pressable onPress={() => reportHandler(incomingItemId)}>
                                    <Text style={styles.pressButtonSmall}>Report</Text>
                                </Pressable>

                                {/*.sort((itemA, itemB) => itemB.id - itemA.id)*/}

                                <View className="flex-row flex-wrap backdrop:bg-gray-200 rounded-2xl">
                                    {ownItemList?.map((item, i ) =>
                                        <ItemCard key={i} userId={item.userId} buttonPressFunction={() => sendOffer(item.id)} id={item.id} title={item.title} itemPicture={item.itemPicture} description={item.description}
                                                  category={item.category} priceTier={item.priceTier} buttonText={'Send Offer'}/>)}
                                </View>

                            </ScrollView>
                        </View>
                    </Modal>
                </View>
                <View className="flex-row flex-wrap">
                    {itemList?.map((item, i) =>

                        <ItemCard key={i} buttonPressFunction={() => modalHandler(item)} id={item.id} userId={item.userId} title={item.title} itemPicture={item.itemPicture} description={item.description}
                                  category={item.category} priceTier={item.priceTier} buttonText={'Details'}/>)}
                </View>
            </ScrollView>
        </View>
    )
}
export default Homepage;