export type Geolocation = {
    user: User,
    latitude: number,
    longitude: number
}

export type User = {
    username: string,
    clerkId: string
}

export type Meeting = {
    requestUser: User,
    targetUser: User
}