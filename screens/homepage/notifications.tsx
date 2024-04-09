import {ScrollView, Text, TouchableOpacity, View} from "react-native";
import NotificationComponent from "../../components/notificationComponent";
import React, {useContext, useEffect, useState} from "react";
import {StatusBar} from "expo-status-bar";
import {HttpContext} from "../../provider/httpProvider";
import Animated, {FadeInUp} from "react-native-reanimated";

const Notifications = () => {

    interface notificationDataDTO {
        id: string,
        message: string,
        type: 'WARNING' | 'NOTIFICATION',
        counter: number,
    }

    const axios = useContext(HttpContext)

    const [notificationList, setNotificationList] = useState<notificationDataDTO[]>()

    function loadNotifications() {
        axios.get('/notification')
            .then((response) => {
                setNotificationList(response.data)
                //console.log(response.data)
                //console.log(notificationList)
            })
            .catch((e) => console.log(e.response.data))
    }

    function deleteNotifications() {
        axios.delete('/notification')
            .then((response) => console.log(response.data))
            .catch((e) => console.log(e.response.data))

        setNotificationList(undefined);
    }

    useEffect(() => {
        loadNotifications()
    }, [axios]);

    return(
        <View className="bg-white items-center h-full- w-full flex-1 p-2 pt-16">
            <StatusBar style="auto"/>
            <ScrollView>
                    <Animated.View className="w-full items-center" entering={FadeInUp.delay(400).duration(600).springify()}>
                        <TouchableOpacity className="w-full bg-amber-300 p-3 rounded-2xl" onPress={deleteNotifications}>
                            <Text className="text-xl font-bold text-white text-center">Delete notifications</Text>
                        </TouchableOpacity>
                    </Animated.View>
                <View className="h-full">
                    {notificationList?.map((notification, i ) =>
                        <NotificationComponent key={i} counter={i} message={notification.message} id={notification.id} type={notification.type}/>)}
                </View>
            </ScrollView>
        </View>
    )
}

export default Notifications;