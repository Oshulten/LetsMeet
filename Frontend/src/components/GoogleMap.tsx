/* eslint-disable react/react-in-jsx-scope */
import { AdvancedMarker, APIProvider, Map, MapMouseEvent, Pin } from '@vis.gl/react-google-maps';
import useSignalRLocations from '../hooks/useSignalRLocations';
import { Geolocation } from '../api/types';
import { geolocationToLatLngLiteral, latLngLiteralToGeolocation } from '../utilities/conversations';

interface Props {
    defaultLocation: google.maps.LatLngLiteral,
}

export default function GoogleMap({ defaultLocation }: Props) {
    console.log("Top of GoogleMap");
    const { locations, currentLocation, setCurrentLocation, user, signalIsInitialized } = useSignalRLocations(defaultLocation);

    const handleContextmenu = (e: MapMouseEvent) => {
        setCurrentLocation(latLngLiteralToGeolocation(e.detail.latLng!, user!.id, user!.username!));
        const location: Geolocation = {
            clerkId: user!.id,
            username: user!.username!,
            latitude: e.detail.latLng!.lat,
            longitude: e.detail.latLng!.lng
        }
        setCurrentLocation(location);
    }

    if (!signalIsInitialized) {
        console.log("Signal is not initialized");
        return <p>Loading...</p>
    }

    // if (currentLocation) {
    //     console.log(`Current location [${currentLocation.username}]: (${currentLocation.latitude}, ${currentLocation.longitude})`);
    // }
    // if (locations) {
    //     locations.forEach(loc => console.log(`${loc.username} : (${loc.latitude}, ${loc.longitude})`));
    // }

    return (
        <>
            <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                <Map
                    style={{ width: '100vw', height: '100vh' }}
                    defaultCenter={defaultLocation}
                    defaultZoom={15}
                    gestureHandling={'greedy'}
                    disableDefaultUI={true}
                    mapId={"LetsMeetMap"}
                    onContextmenu={handleContextmenu}>
                    {
                        locations.map(location =>
                            <AdvancedMarker
                                position={geolocationToLatLngLiteral(location)}
                                key={location.clerkId}
                                onClick={() => console.log(`Clicked on ${location.username}`)}
                            >
                                <Pin
                                    background={'#F0B004'}
                                    glyphColor={'#000'}
                                    borderColor={'#000'} />
                            </AdvancedMarker>)
                    }
                    {/* <AdvancedMarker
                        position={currentLocation}>
                        <Pin
                            background={'#FF0000'}
                            glyphColor={'#000'}
                            borderColor={'#000'} />
                    </AdvancedMarker> */}
                </Map>
            </APIProvider >
        </>
    );
}