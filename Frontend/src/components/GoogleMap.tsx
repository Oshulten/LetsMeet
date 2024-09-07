/* eslint-disable react/react-in-jsx-scope */
import { AdvancedMarker, APIProvider, Map, MapMouseEvent, MapProps, Pin } from '@vis.gl/react-google-maps';
import useSignalRLocations from '../hooks/useSignalRLocations';
import { Geolocation } from '../api/types';
import { geolocationToLatLngLiteral, latLngLiteralToGeolocation, latLngToLatLngLiteral } from '../utilities/conversations';

interface Props {
    defaultLocation: google.maps.LatLngLiteral,
}

export default function GoogleMap({ defaultLocation }: Props) {
    const { otherUserLocations, userLocation, setUserLocation, user, signalIsInitialized } = useSignalRLocations(defaultLocation);

    const handleDragEnd = (e: google.maps.MapMouseEvent) => {
        const latLngLiteral = latLngToLatLngLiteral(e.latLng!);
        setUserLocation(latLngLiteralToGeolocation(latLngLiteral, user.id, user.username!));
    }

    if (!signalIsInitialized) {
        console.log("Signal is not initialized");
        return <p>Loading...</p>
    }

    const otherUserLocationMarkers = otherUserLocations.map(location =>
        <AdvancedMarker
            position={geolocationToLatLngLiteral(location)}
            key={location.clerkId}
            onClick={() => console.log(`Clicked on ${location.username}`)}>
            <Pin
                background={'#F0B004'}
                glyphColor={'#000'}
                borderColor={'#000'} />
        </AdvancedMarker>);

    const userLocationMarker = (
        <AdvancedMarker
            position={geolocationToLatLngLiteral(userLocation)}
            onDragEnd={handleDragEnd}>
            <Pin
                background={'#FF0000'}
                glyphColor={'#000'}
                borderColor={'#000'} />
        </AdvancedMarker>);

    const mapProps: MapProps = {
        style: { width: '100vw', height: '100vh' },
        defaultCenter: defaultLocation,
        defaultZoom: 15,
        gestureHandling: 'greedy',
        disableDefaultUI: true,
        mapId: 'LetsMeetMap',
    }

    return (
        <>
            <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                <Map {...mapProps}>
                    {otherUserLocationMarkers}
                    {userLocationMarker}
                </Map>
            </APIProvider >
        </>
    );
}