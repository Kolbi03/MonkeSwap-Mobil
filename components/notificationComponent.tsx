import {Text, View} from "react-native";
import React from "react";
import Animated, {FadeInLeft, FadeOutRight} from "react-native-reanimated";
import {Icon, shadow} from "react-native-paper";

interface notificationDTO {
    id: string,
    type: 'WARNING' | 'NOTIFICATION',
    message: string,
    counter: number,
}

const NotificationComponent = (input: notificationDTO) => {
    return (
        <Animated.View className={` rounded-2xl p-4 mx-0.5 my-1.5 flex-row justify-start items-center h-24
                    ${input.type === 'WARNING' ? 'bg-red-300' : 'bg-gray-300'}`}
                       entering={FadeInLeft.delay(input.counter *  30).duration(600).springify()}
        exiting={FadeOutRight.delay(input.counter * 40).duration(600)}>
            <View className="">
                {input.type === "WARNING" ?
                    <Icon size={60} source={"alert-outline"} color={"#F00"} /> : <Icon size={50} source={"bell"}/>}
            </View>
            <View className={`font-bold text-xl ml-6 ${input.type ? 'text-red-700' : 'text-black'}`}>
                <Text className="text-xl font-bold">
                    {input.message}
                </Text>
            </View>
        </Animated.View>
    )
}

export default NotificationComponent;