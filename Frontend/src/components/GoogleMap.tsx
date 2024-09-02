/* eslint-disable react/react-in-jsx-scope */
import { useQuery } from '@tanstack/react-query';
import { AdvancedMarker, APIProvider, Map, Pin } from '@vis.gl/react-google-maps';
import getPosition from '../utilities/getPosition';
import useSignalRLocations from '../hooks/useSignalRLocations';

export default function GoogleMap() {
    const geolocationQuery = useQuery({ queryKey: ["geolocation"], queryFn: () => getPosition() });
    const locations = useSignalRLocations();

    console.log(`locations: ${JSON.stringify(locations)}`)

    if (!geolocationQuery.data?.coords) {
        return <span className="loading loading-ring loading-lg"></span>
    }

    const location: google.maps.LatLngLiteral = {
        lat: geolocationQuery.data.coords.latitude,
        lng: geolocationQuery.data.coords.longitude
    }

    return (
        <>
            <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                <Map
                    style={{ width: '100vw', height: '100vh' }}
                    defaultCenter={location}
                    defaultZoom={15}
                    gestureHandling={'greedy'}
                    disableDefaultUI={true}
                    mapId={"LetsMeetMap"}>
                    <AdvancedMarker
                        position={location}>
                        <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
                    </AdvancedMarker>
                </Map>
            </APIProvider>
        </>
    );
}