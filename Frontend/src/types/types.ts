export type UserIdentity = {
    username: string,
    clerkId: string
}

export type Meeting = {
    requestUser: UserIdentity,
    targetUser: UserIdentity
}

export type UserLocation = UserIdentity & {
    location: google.maps.LatLngLiteral
}

export type User = UserIdentity & {
    location: google.maps.LatLngLiteral
}

export function userLocationFromUser(user: User) {
    return user as UserLocation;
}