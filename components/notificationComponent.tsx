import {Text, View} from "react-native";
import React from "react";

interface notificationDTO {
    id: string,
    type: 'WARNING' | 'NOTIFICATION',
    message: string,
}
const NotificationComponent = (input: notificationDTO) => {
    return(
        <View className="border-b-2 border-gray-300 h-20">
            <Text className="text-l">
                {input.message}{input.type}
            </Text>
        </View>
    )
}

export default NotificationComponent;