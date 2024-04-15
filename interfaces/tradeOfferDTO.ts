interface TradeOfferDTO {
    id: number,
    offeredItem: string,
    incomingItem: string,
    comment: string,
    counter: number,
    type: boolean |undefined,
}

export default TradeOfferDTO;