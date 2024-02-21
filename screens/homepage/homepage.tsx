import React from "react";
import {Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View} from "react-native";
import Styles from "../../Stylesheet";
import {Card} from "react-native-paper";


const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const Homepage = ({ navigation }) => {
    const styles = Styles;
    return(
        <View style={styles.container}>
            <ScrollView>
                <View style={{flexDirection: "row"}}>
                    <Card mode={"elevated"} style={styles.card}>
                        <Card.Title title='Monke'/>
                        <Card.Cover source={require('../../assets/monke.jpg')}/>
                        <Card.Content>
                            <Text>Monke for sale</Text>
                        </Card.Content>
                    </Card>

                    <Card mode={"elevated"} style={styles.card}>
                        <Card.Title title='Monke'/>
                        <Card.Cover source={require('../../assets/monke.jpg')}/>
                        <Card.Content>
                            <Text>Monke for sale</Text>
                        </Card.Content>
                    </Card>
                </View>
            </ScrollView>
        </View>
    )
}
export default Homepage;