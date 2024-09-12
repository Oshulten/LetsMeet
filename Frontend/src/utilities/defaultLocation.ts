export default function generateDefaultLocation(scatter?: number) {
    const defaultLocation: google.maps.LatLngLiteral = {
        lat: parseFloat(import.meta.env.VITE_DEFAULT_LOCATION_LAT) + Math.random() * (scatter ?? 0),
        lng: parseFloat(import.meta.env.VITE_DEFAULT_LOCATION_LNG) + Math.random() * (scatter ?? 0)
    }
    return defaultLocation;
}