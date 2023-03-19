import IUser from './IState.interface'
export default interface IEvent {
    _id : string, 
    title: string,
    description: string,
    createdBy: IUser,
    startAt: number,
    endAt: number,
    location: number[],
    seatLimit: number,
    createdAt: number,
    updatedAt: number,
    attendees: IUser[],
    photos: { filename: string}[],
    registered: boolean
}