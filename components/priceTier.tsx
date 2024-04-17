import {Image, View} from "react-native";
import React from "react";
import peeled_banana from "../assets/peeled_banana.png"

interface PriceTierProps {
    tier: number,
}

function PriceTier({ tier }: PriceTierProps) {
    const images: React.JSX.Element[] = [];

    for (let i = 0; i < tier; i++) {
        images.push(<Image key={i} src={peeled_banana} /> )
    }
    const imageArray = new Array(tier)
    return (
        <View>
            {images}
            {/*{imageArray.map((_, index) => (
                <Image key={index} src={require('../assets/peeled_banana.png')}/>
            ))}*/}
        </View>
    );
}

export default PriceTier;