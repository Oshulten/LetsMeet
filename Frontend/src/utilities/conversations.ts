import { Geolocation } from "../api/types";

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