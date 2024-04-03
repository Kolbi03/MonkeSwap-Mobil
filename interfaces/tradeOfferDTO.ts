interface TradeOfferDTO {
    id: string,
    offeredItem: string,
    incomingItem: string,
    comment: string,
    type: boolean |undefined,
}

export default TradeOfferDTO;