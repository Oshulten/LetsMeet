import { MapProps, Map } from '@vis.gl/react-google-maps';

import useClientUser from '../hooks/useClientUser';
import useRemoteUsers from '../hooks/useRemoteUsers';
import useMeetings from '../hooks/useMeetings';
import usePlaces from '../hooks/usePlaces';

import RemoteUserMarker, { RemoteUserMarkerProps } from './RemoteUserMarker';
import ClientUserMarker from './ClientUserMarker';
import PlaceMarker from './PlaceMarker';
import Direction from './Direction';

import { UserLocation } from '../types/types';
import generateDefaultLocation from '../utilities/defaultLocation';

/* eslint-disable react/react-in-jsx-scope */

export default function ClientMap() {
    const { clientUser } = useClientUser();
    const { remoteUserLocations } = useRemoteUsers();
    useMeetings();
    const { place } = usePlaces();

    if (!clientUser) {
        console.log("clientUser is undefined");
        return <p>Getting client user</p>
    }

    const mapProps: MapProps = {
        defaultCenter: clientUser.location,
        defaultZoom: 14,
        gestureHandling: 'greedy',
        disableDefaultUI: true,
        mapId: import.meta.env.VITE_GOOGLE_MAP_ID,
    }

    const remoteUserMarkerProps = (location: UserLocation) => {
        return {
            remoteLocation: location,
        } as RemoteUserMarkerProps;
    }

    return (
        <>
            <Map {...mapProps} className="w-full flex-auto">
                {remoteUserLocations && remoteUserLocations.map(userLocation =>
                    <RemoteUserMarker key={userLocation.user.id} {...remoteUserMarkerProps(userLocation)} />)
                }
                {place && <PlaceMarker place={place} />}
                <ClientUserMarker />
                <Direction />
            </Map>
        </>
    );
}