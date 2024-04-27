import TradeOfferEnum from "../Enums/tradeOfferEnum";

interface TradeOfferDTO {
    id: number,
    offeredItem: string,
    incomingItem: string,
    comment: string,
    counter: number,
    type: TradeOfferEnum,
    getModalVisible: (incoming: boolean, offered: boolean) => void
}

export default TradeOfferDTO;