interface notificationDTO {
    id: string,
    type: 'WARNING' | 'NOTIFICATION',
    message: string,
    counter: number,
}

export default notificationDTO;