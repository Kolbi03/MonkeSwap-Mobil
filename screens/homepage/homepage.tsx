import React, {useContext, useEffect, useState} from "react";
import {Modal, Pressable, ScrollView, Text, ToastAndroid, View} from "react-native";
import Styles from "../../Stylesheet";
import {AuthContext} from "../../contexts/authContext";
import itemDataDTO from "../../interfaces/itemDataDTO";
import ItemCard from "../../components/itemCard";
import axios from "../../axios";

let itemCards: React.JSX.Element[] | undefined;
let ownCards: React.JSX.Element[] | undefined;

const Homepage = () => {

    const {token} = useContext(AuthContext);

    const [itemList, setItemList] = useState<itemDataDTO[]>();
    const [ownItemList, setOwnItemList] = useState<itemDataDTO[]>();
    const [visible, setVisible] = useState(false);
    const [offeredItemId, setOfferedItemId] = useState<string>('')
    const [incomingItemId, setIncomingItemId] = useState<string>('')
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState('');

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

    const loadCards = () => {
        axios.get('/items', config)
            .then((response) => {
                setItemList(response.data);
            })
            .catch((e) => console.log(e))

        if(itemList === undefined) {} else {

            itemCards = itemList.map((item, i) =>

                <ItemCard key={i} buttonPressFunction={() => modalHandler(item.id, item.userId)} id={item.id} userId={item.userId} title={item.title} itemPicture={item.itemPicture} description={item.description}
                          category={item.category} priceTier={item.priceTier}/>);

            console.log('itemCards: ' + itemCards)
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
            console.log('OwnCards: ' + ownCards)
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

        axios.post('/tradeoffer', {offeredItem: offeredItemId, incomingItem: incomingItemId} , config)
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

    function modalHandler(id : string, userId: string) {
        setVisible(() => !visible)
        if(id === null) {
            ToastAndroid.showWithGravity('NO ITEM SELECTED', 2000, 1)
        } else {
            setIncomingItemId(id)
            setUserId(userId)
            console.log(incomingItemId)
        }
    }

    useEffect(() => {
        loadCards()
        getUserData()
        loadOwnCards()
    }, []);

    const styles = Styles;
    return(
        <View style={styles.container}>
            <ScrollView>
                <View style={{flexDirection: "row"}}>
                    <Pressable onPress={loadCards}>
                        <Text style={styles.pressButton}>Load Cards</Text>
                    </Pressable>
                    <Modal
                        animationType="slide"
                        transparent={false}
                        presentationStyle={"overFullScreen"}
                        visible={visible}
                        onShow={loadOwnCards}
                        onRequestClose={() => {
                            setVisible(!visible);
                        }}>
                        <View style={styles.container}>
                            <View style={{flexDirection: "row", flexWrap: "wrap"}}>
                                {ownCards}
                            </View>
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