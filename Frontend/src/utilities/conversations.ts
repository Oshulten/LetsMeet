// import { Meeting, User } from "../types/types";

// export function latLngLiteral(lat: number, lng: number) {
//     return { lat, lng } as google.maps.LatLngLiteral;
// }

// export function latLngLiteralFromGeolocation(fromLocation: Geolocation) {
//     return latLngLiteral(fromLocation.latitude, fromLocation.longitude);
// }

// export function latLng(lat: number, lng: number) {
//     return new google.maps.LatLng(lat, lng);
// }

// export function latLngLiteralFromlatLng(fromLatLng: google.maps.LatLng) {
//     return latLng(fromLatLng.lat(), fromLatLng.lng());
// }

// export function geolocationFromLatLngLiteral(latLng: google.maps.LatLngLiteral, user: User) {
//     return { user, latitude: latLng.lat, longitude: latLng.lng } as Geolocation;
// }

// export function geolocationFromLatLng(latLng: google.maps.LatLng, user: User) {
//     return { user, latitude: latLng.lat(), longitude: latLng.lng() } as Geolocation;
// }
// export function meeting(requestUser: User, targetUser: User) {
//     return { requestUser, targetUser } as Meeting;
// }
