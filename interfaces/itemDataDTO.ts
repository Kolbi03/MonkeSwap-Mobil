export  default interface itemDataDTO {
    id: string;
    title: string,
    itemPicture: string,
    description: string,
    category: string,
    priceTier: string,
    userId: string,
    buttonPressFunction: () => void,
}