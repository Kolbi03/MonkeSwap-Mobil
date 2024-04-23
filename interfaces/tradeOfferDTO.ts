import TradeOfferEnum from "../Enums/tradeOfferEnum";

interface TradeOfferDTO {
    id: number,
    offeredItem: string,
    incomingItem: string,
    comment: string,
    counter: number,
    type: TradeOfferEnum
}

export default TradeOfferDTO;