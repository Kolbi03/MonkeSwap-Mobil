import {Text} from "react-native";
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
        <Animated.View className="border-2 backdrop:bg-gray-200 border-gray-200 h-20 rounded-2xl my-1 w-full"
                       entering={FadeInLeft.delay(input.counter *  30).duration(600).springify()}
        exiting={FadeOutRight.delay(input.counter * 30).duration(600)}>
            <Text className="text-xl text-center pt-1">
                {input.message}
            </Text>
            <Text className="text-right pt-2 pr-4">
                {input.type}
            </Text>
        </Animated.View>
    )
}

export default NotificationComponent;