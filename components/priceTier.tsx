import {Image, View} from "react-native";
import React from "react";

interface PriceTierProps {
    tier: number,
}

function PriceTier({ tier }: PriceTierProps) {


    const priceTier = new Array(tier);
    for(let i = 0; i < tier; i++) {
        priceTier[i] = 0;
    }
    // @ts-ignore
    return (
        <View className="flex-row flex-wrap h-10 pt-2 justify-center">
            {priceTier
                .map((item, index) => (
                    <Image key={index} source={require('../assets/peeled_banana.png')} className="h-8 w-5 mx-1 p-0"/>
                ))}
        </View>
    );
}

export default PriceTier;