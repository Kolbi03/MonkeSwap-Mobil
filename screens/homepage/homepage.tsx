import React, {useContext, useEffect, useState} from "react";
import {Image, Modal, Pressable, ScrollView, Text, TextInput, ToastAndroid, View} from "react-native";
import Styles from "../../Stylesheet";
import {AuthContext} from "../../contexts/authContext";
import itemDataDTO from "../../interfaces/itemDataDTO";
import ItemCard from "../../components/itemCard";
import axios from "../../axios";
import SelectDropdown from "react-native-select-dropdown";

let itemCards: React.JSX.Element[] | undefined;
let ownCards: React.JSX.Element[] | undefined;
let incomingItemComponent: React.JSX.Element | undefined;

const Homepage = () => {

    const categories = ["OTHER", "VEHICLE", "HOME", "HOUSEHOLD", "ELECTRONICS", "FREETIME", "SPORT", "FASHION", "COLLECTIBLES", "PETS" ]

    const {token} = useContext(AuthContext);

    const [itemList, setItemList] = useState<itemDataDTO[]>();
    const [ownItemList, setOwnItemList] = useState<itemDataDTO[]>();
    const [visible, setVisible] = useState(false);
    const [offeredItemId, setOfferedItemId] = useState<string>('')
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

    const getUserData  = async () => {
        await axios.get('/user', config)
            .then((response) => {
                //console.log('username: ' + response.data.username);
                setUsername(response.data.username)
            })
            .catch((e) => console.log(e))
    }

    const loadCards = () => {
        axios.get('/items', config)
            .then((response) => {
                setItemList(response.data);
            })
            .catch((e) => console.log(e))

        if(itemList === undefined) {} else {

            itemCards = itemList.map((item, i) =>

                <ItemCard key={i} buttonPressFunction={() => modalHandler(item)} id={item.id} userId={item.userId} title={item.title} itemPicture={item.itemPicture} description={item.description}
                          category={item.category} priceTier={item.priceTier}/>);

            //console.log('itemCards: ' + itemCards)
        }
    }

    const loadOwnCards = () => {
        axios.get('/user/items', config)
            .then((response) => {
                setOwnItemList(response.data)
            })
            .catch((e) => console.log(e))

        if (ownItemList === undefined) {} else {
            ownCards = ownItemList.map((item, i ) =>
                <ItemCard key={i} userId={item.userId} buttonPressFunction={() => sendOffer(item.id)} id={item.id} title={item.title} itemPicture={item.itemPicture} description={item.description}
                          category={item.category} priceTier={item.priceTier}/>);
            //console.log('OwnCards: ' + ownCards)
        }
    }

    function sendOffer(id: string) {
        setVisible(() => !visible)
        if(id === null) {
            ToastAndroid.showWithGravity('NO ITEM SELECTED', 2000, 1)
        } else {
            setOfferedItemId(id)
            console.log(offeredItemId)
            ToastAndroid.showWithGravity('Trade offer sent!', 2000, 1)
        }

        console.log('offeredItem: '  + offeredItemId + 'incomingItem: ' + incomingItemId)

        axios.post('/tradeoffer', {offeredItem: offeredItemId, incomingItem: incomingItemId, comment: tradeOfferComment} , config)
            .then((response) => {
                console.log('offeredItem: '  + offeredItemId + 'incomingItem: ' + incomingItemId)
                console.log(response.data)
            })
            .catch((e) => console.log(e.response.data))

        axios.post('/notification', {message: username + ' sent you a trade request!', type: 'NOTIFICATION', userId: userId}, config)
            .then((response) => {
                console.log(response.data)
                console.log(username + ' ' + userId)
            })
            .catch((e) => console.log(e.response.data))
    }

    function modalHandler(item: itemDataDTO) {
        setVisible(() => !visible)
        if(item.id === null) {
            ToastAndroid.showWithGravity('NO ITEM SELECTED', 2000, 1)
        } else {
            setIncomingItemId(item.id)
            setIncomingItem(item)
            incomingItemComponent = <ItemCard id={item.id} title={item.title} itemPicture={item.itemPicture} description={item.description}
                                              category={item.category} priceTier={item.priceTier} userId={item.userId}
                                              buttonPressFunction={placeholderFunc}/>
            setUserId(userId)
            axios.put('/item/views/' + incomingItemId, {} , config)
                .then((response) => console.log(response.data))
                .catch((e) => console.log(e.response.data))
            console.log(incomingItemId)
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

            if(itemList === undefined) {} else {

                itemCards = itemList.map((item, i) =>

                    <ItemCard key={i} buttonPressFunction={() => modalHandler(item)} id={item.id} userId={item.userId} title={item.title} itemPicture={item.itemPicture} description={item.description}
                              category={item.category} priceTier={item.priceTier}/>);

                //console.log('itemCards: ' + itemCards)
            }

        }
    }

    function placeholderFunc() {    }

    function cardFlipHandler() {
        setVisible(!visible);
    }

    useEffect(() => {
        loadCards()
        getUserData().then()
        loadOwnCards()
    }, []);

    const styles = Styles;

    return(
        <View style={styles.container}>
            <ScrollView>
                <View style={{flexDirection: "column"}}>
                    <Pressable onPress={loadCards}>
                        <Text style={styles.pressButtonSmall}>Load Cards</Text>
                    </Pressable>
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

                                <View className="flex-row flex-wrap">
                                    {ownCards}
                                </View>
                            </ScrollView>
                        </View>
                    </Modal>
                </View>
                <View style={{flexDirection: "row", flexWrap: "wrap"}}>
                    {itemCards}
                </View>
            </ScrollView>
        </View>
    )
}
export default Homepage;