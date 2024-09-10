export type UserIdentity = {
    clerkId: string
    username: string,
}

export type Meeting = {
    requestUser: UserIdentity,
    targetUser: UserIdentity
}

export type ActiveMeeting = {
    user: UserIdentity,
    state: MeetingState
}

export type UserLocation = UserIdentity & google.maps.LatLngLiteral;

export type User = UserIdentity & {
    location: google.maps.LatLngLiteral
}

export type MeetingState =
    'awaitingOtherUserConfirmation' | 'awaitingUserConfirmation' | 'confirmed'

export function userLocationFromUser(user: User) {
    const userLocation: UserLocation = {
        clerkId: user.clerkId,
        username: user.username,
        lat: user.location.lat,
        lng: user.location.lng
    };
    return userLocation;
}

export function userIdentityFromUser(user: User) {
    return {
        clerkId: user.clerkId,
        username: user.username
    } as UserIdentity;
}