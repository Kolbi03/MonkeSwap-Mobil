import {ScrollView, Text, TouchableOpacity, View} from "react-native";
import NotificationComponent from "../../components/notificationComponent";
import React, {useContext, useEffect, useState} from "react";
import {StatusBar} from "expo-status-bar";
import {HttpContext} from "../../provider/httpProvider";
import Animated, {FadeInUp} from "react-native-reanimated";
import notificationDTO from "../../interfaces/notificationDTO";

const Notifications = () => {

    const axios = useContext(HttpContext)

    const [notificationList, setNotificationList] = useState<notificationDTO[]>()

    /*Loads the notifications*/
    function loadNotifications() {
        axios.get('/notification')
            .then((response) => {
                setNotificationList(response.data)
            })
            .catch((e) => console.log(e.response.data))
    }

    /*Deletes all notifications*/
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
            <ScrollView className="w-full">
                    <Animated.View className=" items-center pb-6" entering={FadeInUp.delay(100).duration(600).springify()}>
                        <TouchableOpacity className="w-full bg-amber-300 p-3 rounded-2xl" onPress={deleteNotifications}>
                            <Text className="text-xl font-bold text-white text-center">Delete notifications</Text>
                        </TouchableOpacity>
                    </Animated.View>
                <View className="h-full w-full">
                    {notificationList?.sort((itemA, itemB) => itemB.id - itemA.id)
                        .map((notification, i ) =>
                        <NotificationComponent key={i} counter={i} message={notification.message} id={notification.id} type={notification.type}/>)}
                </View>
            </ScrollView>
        </View>
    )
}

export default Notifications;