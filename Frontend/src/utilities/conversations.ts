import { Geolocation, User } from "../api/types";

export function geolocationToLatLngLiteral(location: Geolocation) {
    return {
        lat: location.latitude,
        lng: location.longitude
    } as google.maps.LatLngLiteral;
}

export function latLngLiteralToGeolocation(latLng: google.maps.LatLngLiteral, clerkId: string, username: string) {
    return {
        clerkId: clerkId,
        username: username,
        latitude: latLng.lat,
        longitude: latLng.lng
    } as Geolocation;
}

export function latLngToLatLngLiteral(latLng: google.maps.LatLng) {
    return {
        lat: latLng.lat(),
        lng: latLng.lng()
    } as google.maps.LatLngLiteral;
}

export function ClerkUserToUser(id: string, username: string) {
    return {
        username: username,
        clerkId: id
    } as User;
}

export function GeolocationToUser(location: Geolocation) {
    return {
        username: location.username,
        clerkId: location.clerkId
    }
}