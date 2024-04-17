import {Image, View} from "react-native";
import React from "react";
// @ts-ignore
import peeled_banana from "../assets/peeled_banana.png"

interface PriceTierProps {
    tier: number,
}

function PriceTier({ tier }: PriceTierProps) {


    const asd = new Array(tier);
    for(let i = 0; i<tier; i++) {
        asd[i] = 0;
    }
    // @ts-ignore
    return (
        <View className="flex-row flex-wrap">


            {asd
                .map((item, index) => (
                    <Image key={index} source={require('../assets/peeled_banana.png')} style={{height: 35, width: 35}}/>
                ))}


        </View>
    );
}

export default PriceTier;