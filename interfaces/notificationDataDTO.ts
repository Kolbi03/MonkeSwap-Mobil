interface notificationDataDTO {
    id: string,
    message: string,
    type: 'WARNING' | 'NOTIFICATION',
    counter: number,
}

export default notificationDataDTO;