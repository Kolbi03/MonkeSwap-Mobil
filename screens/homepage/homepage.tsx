import React, {useContext, useEffect, useState} from "react";
import {Image, Modal, Pressable, ScrollView, Text, TextInput, ToastAndroid, View} from "react-native";
import Styles from "../../Stylesheet";
import {AuthContext} from "../../contexts/authContext";
import itemDataDTO from "../../interfaces/itemDataDTO";
import ItemCard from "../../components/itemCard";
import SelectDropdown from "react-native-select-dropdown";
import {HttpContext} from "../../provider/httpProvider";

const Homepage = () => {

    const categories = ["OTHER", "VEHICLE", "HOME", "HOUSEHOLD", "ELECTRONICS", "FREETIME", "SPORT", "FASHION", "COLLECTIBLES", "PETS" ]

    const {token} = useContext(AuthContext);
    const axios = useContext(HttpContext)

    const [itemList, setItemList] = useState<itemDataDTO[]>();
    const [ownItemList, setOwnItemList] = useState<itemDataDTO[]>();
    const [visible, setVisible] = useState(false);
    const [incomingItemId, setIncomingItemId] = useState<string>('')
    const [incomingItem, setIncomingItem] = useState<itemDataDTO>()
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState('');
    const [tradeOfferComment, setTradeOfferComment] = useState('')
    const [category, setCategory] = useState('');

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

        axios.post('/notification', {message: username + ' sent you a trade request!', type: 'NOTIFICATION', userId: userId}, config)
            .then((response) => {
                console.log(response.data)
                console.log(username + ' ' + userId)
            })
            .catch((e) => console.log('Notification error: ' + e.response.data))
    }

    function modalHandler(item: itemDataDTO) {
        console.log(item)
        if(item.id === null) {
            ToastAndroid.showWithGravity('NO ITEM SELECTED', 2000, 1)
        } else {
            setVisible(() => !visible)
            setIncomingItem(item)
            setIncomingItemId(item.id)
            /*incomingItemComponent = <ItemCard id={item.id} title={item.title} itemPicture={item.itemPicture} description={item.description}
                                              category={item.category} priceTier={item.priceTier} userId={item.userId}
                                              buttonPressFunction={placeholderFunc}/>*/
            setUserId(item.userId)
            axios.put('/item/views/' + item.id, {})
                .then((response) => console.log(response.data))
                .catch((e) => console.log('Incoming item error:' + e))
            console.log('incoming item id: ' + item.id)
        }
    }

    const searchByCategory = () => {
        if(category === '') {
            ToastAndroid.showWithGravity('You have to chose a category!', 2000, 1)
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
        <View style={styles.container}>
            <ScrollView>
                <View style={{flexDirection: "column"}}>
                    {/*<Pressable onPress={loadCards}>
                        <Text style={styles.pressButtonSmall}>Load Cards</Text>
                    </Pressable>*/}
                    <Pressable onPress={searchByCategory}>
                        <Text style={styles.pressButtonSmall}>Search</Text>
                    </Pressable>
                    <Text style={styles.text}>Categories</Text>
                    <SelectDropdown defaultButtonText={"Choose a category"} searchPlaceHolder={"Search"} data={categories} onSelect={(selectedItem) => {
                        setCategory(selectedItem);
                    }}/>
                    <Modal
                        animationType="slide"
                        transparent={false}
                        presentationStyle={"overFullScreen"}
                        visible={visible}
                        onShow={loadOwnCards}
                        onRequestClose={cardFlipHandler}>
                        <View style={styles.container}>
                            <ScrollView>

                                <View>
                                    <Image style={{width: 370, borderRadius: 10}} source={require('../../assets/placeholderMonkeicon.jpg')} />
                                    <Text className="text-xl p-1">Title: {incomingItem?.title}</Text>
                                    <Text className="text-xl p-1">Category: {incomingItem?.category}</Text>
                                    <Text className="text-xl p-1">Price Tier: {incomingItem?.priceTier}</Text>
                                    <Text className="text-xl p-1">Description: {incomingItem?.description}</Text>
                                </View>

                                <View>
                                    <View className="m" style={styles.textInput}>
                                        <TextInput placeholder={'You can write a comment for your offer'} onChangeText={text => setTradeOfferComment(text)} placeholderTextColor={'gray'}/>
                                    </View>
                                </View>

                                <Pressable onPress={() => reportHandler(incomingItemId)}>
                                    <Text style={styles.pressButtonSmall}>Report</Text>
                                </Pressable>

                                <View className="flex-row flex-wrap">
                                    {ownItemList?.map((item, i ) =>
                                        <ItemCard key={i} userId={item.userId} buttonPressFunction={() => sendOffer(item.id)} id={item.id} title={item.title} itemPicture={item.itemPicture} description={item.description}
                                                  category={item.category} priceTier={item.priceTier} buttonText={'Send Offer'}/>)}
                                </View>

                            </ScrollView>
                        </View>
                    </Modal>
                </View>
                <View style={{flexDirection: "row", flexWrap: "wrap"}}>
                    {itemList?.map((item, i) =>

                        <ItemCard key={i} buttonPressFunction={() => modalHandler(item)} id={item.id} userId={item.userId} title={item.title} itemPicture={item.itemPicture} description={item.description}
                                  category={item.category} priceTier={item.priceTier} buttonText={'Details'}/>)}
                </View>
            </ScrollView>
        </View>
    )
}
export default Homepage;