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
        <View className="flex-row flex-wrap pt-2 justify-center">
            {priceTier
                .map((item, index) => (
                    <Image key={index} source={require('../assets/peeled_banana.png')} style={{height: 29, width: 29}}/>
                ))}
        </View>
    );
}

export default PriceTier;