import { DtoGeolocation } from "../api/types";

export function geolocationToLatLngLiteral(location: DtoGeolocation) {
    return {
        lat: location.latitude,
        lng: location.longitude
    } as google.maps.LatLngLiteral;
}

export function latLngLiteralToGeolocation(latLng: google.maps.LatLngLiteral, clerkId: string, username: string) {
    return {
        clerkId,
        username,
        latitude: latLng.lat,
        longitude: latLng.lng
    } as DtoGeolocation;
}