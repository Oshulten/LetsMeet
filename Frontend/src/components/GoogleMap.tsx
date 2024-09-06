/* eslint-disable react/react-in-jsx-scope */
import { AdvancedMarker, APIProvider, Map, MapMouseEvent, Pin } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import { Guid } from "guid-typescript";
import useSignalRLocations from '../hooks/useSignalRLocations';
import { DtoGeolocation } from '../api/types';
import { useAuth, useUser } from '@clerk/clerk-react';
import { ensureUserExists } from '../api/endpoints';

interface Props {
    defaultLocation: google.maps.LatLngLiteral,
}

function geolocationToLatLngLiteral(location: DtoGeolocation): google.maps.LatLngLiteral {
    return {
        lat: location.latitude,
        lng: location.longitude
    }
}

export default function GoogleMap({ defaultLocation }: Props) {
    const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral | null>(defaultLocation);
    const { user } = useUser();
    const auth = useAuth();
    const [clientGuid] = useState<Guid>(Guid.create());
    const { locations, sendLocation } = useSignalRLocations();

    useEffect(() => {
        if (user) {
            ensureUserExists({
                clerkId: user.id,
                username: user.username ?? "Inkognito",
            });
        }
    }, []);

    console.log(auth);
    console.log(user);

    const handleContextmenu = (e: MapMouseEvent) => {
        setCurrentLocation(e.detail.latLng);
        const location: DtoGeolocation = {
            clerkId: user!.id,
            latitude: e.detail.latLng!.lat,
            longitude: e.detail.latLng!.lng
        }
        sendLocation(location);
    }

    useEffect(() => {
        console.log("locations changed");
        console.log(locations);
    }, [locations]);

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
                        locations.filter(location => location.userGuid != clientGuid.toString())
                            .map(location =>
                                <AdvancedMarker
                                    position={geolocationToLatLngLiteral(location)}
                                    key={location.userGuid}>
                                    <Pin
                                        background={'#F0B004'}
                                        glyphColor={'#000'}
                                        borderColor={'#000'} />
                                </AdvancedMarker>)
                    }
                    <AdvancedMarker
                        position={currentLocation}
                        key={clientGuid.toString()}>
                        <Pin
                            background={'#FF0000'}
                            glyphColor={'#000'}
                            borderColor={'#000'} />
                    </AdvancedMarker>
                </Map>
            </APIProvider>
        </>
    );
}