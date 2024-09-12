//Backend: DtoUser
export type UserIdentity = {
    username: string,
    id: string
}

//Backend: DtoMeeting
export type Meeting = {
    requestUser: UserIdentity,
    targetUser: UserIdentity
}

//Backend: DtoMeetingConfirmation
export type MeetingConfirmation = {
    participants: UserLocation[]
}

export type ActiveMeeting = {
    user: UserIdentity,
    state: MeetingState
}

//Backend: DtoUserLocation
export type UserLocation = {
    user: UserIdentity,
    location: google.maps.LatLngLiteral
}

export type User = UserIdentity & {
    location: google.maps.LatLngLiteral,
    imageUrl?: string
}

export type MeetingState = 'awaitingOtherUserConfirmation' | 'awaitingUserConfirmation' | 'confirmed'

export function userLocationFromUser(user: User) {
    return {
        user: {
            id: user.id,
            username: user.username
        },
        location: user.location
    } as UserLocation;
}

export function userIdentityFromUser(user: User) {
    return {
        id: user.id,
        username: user.username
    } as UserIdentity;
}