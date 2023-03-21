import {IUser} from './IUser.interface'
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
    photo: { filename: string },
    registered: boolean
}