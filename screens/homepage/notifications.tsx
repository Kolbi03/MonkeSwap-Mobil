import {Pressable, ScrollView, Text, View} from "react-native";
import NotificationComponent from "../../components/notificationComponent";
import axios from "../../axios";
import React, {useContext, useEffect, useState} from "react";
import {AuthContext} from "../../contexts/authContext";
import Styles from "../../Stylesheet";

let notifications: React.JSX.Element[] | undefined;

const Notifications = () => {

    interface notificationDataDTO {
        id: string,
        message: string,
        type: 'WARNING' | 'NOTIFICATION',
    }

    const {token} = useContext(AuthContext)

    const [notificationList, setNotificationList] = useState<notificationDataDTO[]>()

    const config = {
        headers: {
            Authorization: 'Bearer ' + token?.token
        }
    }

    function loadNotifications() {
        axios.get('/notification', config)
            .then((response) => {
                setNotificationList(response.data)
                //console.log(response.data)
                //console.log(notificationList)
            })
            .catch((e) => console.log(e.response.data))

        if (notificationList === undefined) {} else {
            notifications = notificationList.map((notification, i ) =>
                <NotificationComponent key={i} message={notification.message} id={notification.id} type={notification.type}/>)

            console.log(notifications)
        }
    }

    function deleteNotifications() {
        axios.delete('/notification', config)
            .then((response) => console.log(response.data))
            .catch((e) => console.log(e.response.data))
    }

    useEffect(() => {
        loadNotifications()
    }, []);

    return(
        <View className="p-2">
            <ScrollView>
                <View>
                    <Pressable onPress={deleteNotifications}>
                        <Text style={Styles.pressButton}>Delete notifications</Text>
                    </Pressable>
                    <Pressable onPress={loadNotifications}>
                        <Text style={Styles.pressButton}>Load notifications</Text>
                    </Pressable>
                </View>
                <View>
                    {notifications}
                </View>
            </ScrollView>
        </View>
    )
}

export default Notifications;