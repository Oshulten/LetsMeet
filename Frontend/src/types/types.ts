export type UserIdentity = {
    username: string,
    clerkId: string
}

export type Meeting = {
    requestUser: UserIdentity,
    targetUser: UserIdentity
}

export type UserLocation = UserIdentity & google.maps.LatLngLiteral;

export type User = UserIdentity & {
    location: google.maps.LatLngLiteral
}

export function userLocationFromUser(user: User) {
    const userLocation: UserLocation = {
        username: user.username,
        clerkId: user.clerkId,
        lat: user.location.lat,
        lng: user.location.lng
    };
    return userLocation;
}