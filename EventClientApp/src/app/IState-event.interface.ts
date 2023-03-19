export default interface IStateEvent {
    _id: string,
    title: string,
    description: string,
    startAt: string,
    endAt: string,
    seatLimit: number,
    location: [],
    token: string,
}