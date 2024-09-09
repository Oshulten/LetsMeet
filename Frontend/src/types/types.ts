export type DtoUser = {
    username: string,
    clerkId: string
}

export type DtoLocation = {
    clerkId: string,
    username: string,
    latitude: number,
    longitude: number
}

export type DtoMeeting = {
    requestUser: DtoUser,
    targetUser: DtoUser
}

export type UserLocation = {
    user: User,
    location: google.maps.LatLngLiteral
}

export type User = {
    username: string,
    clerkId: string,
    location: google.maps.LatLngLiteral
}

export type Meeting = {
    requestUser: User,
    targetUser: User
}

export const dtoFromUser = (user: User) => {
    return { username: user.username, clerkId: user.clerkId } as DtoUser;
}

export const dtoFromMeeting = (meeting: Meeting) => {
    return meeting as DtoMeeting;
}

export const dtoFromUserLocation = (location: UserLocation) => {
    return {
        clerkId: location.user.clerkId,
        username: location.user.username,
        latitude: location.location.lat,
        longitude: location.location.lng
    } as DtoLocation;
}

export const userFromDto = (user: DtoUser, location: google.maps.LatLngLiteral) => {
    return { ...user, location } as User;
}

export const userLocationFromDto = (loc: DtoLocation) => {
    return {
        user: {
            clerkId: loc.clerkId,
            username: loc.username
        },
        location: {
            lat: loc.latitude,
            lng: loc.longitude
        }
    } as UserLocation;
}

export const userLocationFromUser = (user: User) => {
    return {
        user: user,
        location: user.location
    } as UserLocation;
}

export const meetingFromDto = (meeting: DtoMeeting) => {
    return {
        requestUser: {
            clerkId: meeting.requestUser.clerkId,
            username: meeting.requestUser.username
        },
        targetUser: {
            clerkId: meeting.targetUser.clerkId,
            username: meeting.targetUser.username
        },
    } as Meeting;
}