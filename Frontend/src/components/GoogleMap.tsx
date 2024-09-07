/* eslint-disable react/react-in-jsx-scope */
import { APIProvider, Map, MapProps } from '@vis.gl/react-google-maps';
import useSignalRLocations from '../hooks/useSignalRLocations';
import { latLngLiteralToGeolocation, latLngToLatLngLiteral } from '../utilities/conversations';
import OtherUserMarker from './OtherUserMarker';
import UserMarker from './UserMarker';

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
                    {otherUserLocations.map(location =>
                        <OtherUserMarker key={location.clerkId} position={location} />)}
                    <UserMarker position={userLocation} onDragEnd={handleDragEnd} />
                </Map>
            </APIProvider >
        </>
    );
}