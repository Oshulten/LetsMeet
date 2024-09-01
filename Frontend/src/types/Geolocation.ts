export type GeolocationCoordinates = {
    latitude: number,
    longitude: number,
    altitude?: number,
    accuracy: number,
    altitudeAccuracy?: number,
    heading?: number,
    speed?: number
}

export type Geolocation = {
    coords: GeolocationCoordinates,
    timestamp: number
}

export type GeolocationPositionError = {
    code: number,
    message: string
}