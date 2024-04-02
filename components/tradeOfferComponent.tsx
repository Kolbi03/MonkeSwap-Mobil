import {Pressable, Text, View} from "react-native";
import TradeOfferDTO from "../interfaces/tradeOfferDTO";

const TradeOfferComponent= (item: TradeOfferDTO) => {
    return (
        <View className="flex-1 flex-row border-b-2 border-amber-400">
            <Pressable>
                <Text>
                    Incoming Item: {item.incomingItem}
                </Text>
                <Text>
                    Offered Item: {item.offeredItem}
                </Text>
                <Text>
                    Comment: {item.comment}
                </Text>
            </Pressable>
        </View>
    )
}

export default TradeOfferComponent