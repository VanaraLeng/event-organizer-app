export interface Users {
    _id: string,
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    bio: string,
    location: [{
        lat: string,
        long: string
    }]
    createdAt: string,
    photo: [_id: string, filename: string],
    updatedAt: string,
}