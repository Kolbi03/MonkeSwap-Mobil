import {Text, View} from "react-native";
import React from "react";
import Animated, {FadeInLeft, FadeOutRight} from "react-native-reanimated";

interface notificationDTO {
    id: string,
    type: 'WARNING' | 'NOTIFICATION',
    message: string,
    counter: number,
}
const NotificationComponent = (input: notificationDTO) => {
    return(
        <Animated.View className="border-2 border-gray-300 h-20 rounded-2xl"
                       entering={FadeInLeft.delay(input.counter *  30).duration(600).springify()}
        exiting={FadeOutRight.delay(input.counter * 30).duration(600)}>
            <Text className="text-l">
                {input.message}{input.type}
            </Text>
        </Animated.View>
    )
}

export default NotificationComponent;