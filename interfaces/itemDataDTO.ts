export  default interface itemDataDTO {
    id: string;
    title: string,
    itemPicture: string | undefined | null,
    description: string,
    category: string,
    priceTier: number,
    userId: string,
    buttonText: string,
    buttonPressFunction: () => void,
}