/* eslint-disable react/react-in-jsx-scope */
import { AdvancedMarker, APIProvider, Map, MapMouseEvent, Pin } from '@vis.gl/react-google-maps';
import { useState } from 'react';

interface Props {
    defaultLocation: google.maps.LatLngLiteral
}

export default function GoogleMap({ defaultLocation }: Props) {
    const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral | null>(defaultLocation);

    const handleContextmenu = (e: MapMouseEvent) => {
        setCurrentLocation(e.detail.latLng);
    }

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
                    <AdvancedMarker
                        position={currentLocation ?? defaultLocation}>
                        <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
                    </AdvancedMarker>
                </Map>
            </APIProvider>
        </>
    );
}