interface notificationDTO {
    id: number,
    type: 'WARNING' | 'NOTIFICATION',
    message: string,
    counter: number,
}

export default notificationDTO;