export  default interface itemDataDTO {
    id: number;
    title: string,
    itemPicture: string | undefined | null,
    description: string,
    category: string,
    priceTier: number | string,
    userId: string,
    buttonText: string,
    buttonPressFunction: () => void,
}