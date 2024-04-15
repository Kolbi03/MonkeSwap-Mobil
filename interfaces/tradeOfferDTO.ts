interface TradeOfferDTO {
    id: string,
    offeredItem: string,
    incomingItem: string,
    comment: string,
    counter: number,
    type: boolean |undefined,
}

export default TradeOfferDTO;