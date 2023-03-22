export interface IUser {
  _id: string,
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  bio: string,
  location: number[],
  photo: {_id: string, filename: string}
}