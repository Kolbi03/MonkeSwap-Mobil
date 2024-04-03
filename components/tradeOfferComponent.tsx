import {Pressable, Text, View} from "react-native";
import TradeOfferDTO from "../interfaces/tradeOfferDTO";
import {useContext, useEffect, useState} from "react";
import {HttpContext} from "../provider/httpProvider";
import itemDataDTO from "../interfaces/itemDataDTO";

const TradeOfferComponent = (item: TradeOfferDTO) => {

    const axios = useContext(HttpContext)

    const [incomingItemData, setIncomingItemData] = useState<itemDataDTO>()
    const [offeredItemData, setOfferedItemData] = useState<itemDataDTO>()
    const [type] = useState(item.type)

    function getIncomingItemData() {
        axios.get('/item/' + item.incomingItem)
            .then((response) => {
                setIncomingItemData(response.data)
                console.log(incomingItemData)
            })
            .catch((e) => console.log(e))
    }

    function getOfferedItemData() {
        axios.get('/item/' + item.offeredItem)
            .then((response) => {
                setOfferedItemData(response.data)
                console.log(incomingItemData)
            })
            .catch((e) => console.log(e))
    }

    useEffect(() => {
        getIncomingItemData()
        getOfferedItemData()
    }, []);

    return (
        <View className="h-14 border-b-2 border-amber-400">
            <Pressable onPress={()=> console.log(incomingItemData)}>
                {!type ?
                <View>
                    <Text>
                        Your {offeredItemData?.title} has a pending trade for {incomingItemData?.title}!
                    </Text>
                </View>
                    :
                    <View>
                        <Text>
                        You have offered a {incomingItemData?.title} for a {offeredItemData?.title}!
                        </Text>
                    </View>
                }
            </Pressable>
        </View>
    )
}

export default TradeOfferComponent