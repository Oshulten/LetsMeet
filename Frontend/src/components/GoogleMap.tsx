/* eslint-disable react/react-in-jsx-scope */
import { AdvancedMarker, APIProvider, Map, MapMouseEvent, Pin } from '@vis.gl/react-google-maps';
import { useState } from 'react';
import { Guid } from "guid-typescript";
import useSignalRLocations from '../hooks/useSignalRLocations';
import { MapLocation } from '../api/types';

interface Props {
    defaultLocation: google.maps.LatLngLiteral,
}

export default function GoogleMap({ defaultLocation }: Props) {
    const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral | null>(defaultLocation);
    const [clientGuid] = useState<Guid>(Guid.create());
    const { locations, sendLocation } = useSignalRLocations();


    const handleContextmenu = (e: MapMouseEvent) => {
        setCurrentLocation(e.detail.latLng);
        const location: MapLocation = {
            userGuid: clientGuid.toString(),
            latitude: e.detail.latLng!.lat,
            longitude: e.detail.latLng!.lng
        }
        sendLocation(location);
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