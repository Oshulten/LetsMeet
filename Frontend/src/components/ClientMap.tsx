import { MapProps, Map } from '@vis.gl/react-google-maps';

import useClientUser from '../hooks/useClientUser';
import useRemoteUsers from '../hooks/useRemoteUsers';
import useMeetings from '../hooks/useMeetings';
import usePlaces from '../hooks/usePlaces';
import useDirections from '../hooks/useDirections';

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
    const { places, suggestMeetingPlacesTest } = usePlaces();
    const { suggestRoute } = useDirections();

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
                {places && places.map(place =>
                    <PlaceMarker key={place.id} place={place} />)
                }
                <ClientUserMarker />
                <Direction />
            </Map>
            <button onClick={() => suggestMeetingPlacesTest()}>Suggest Places</button>
            <button onClick={() => suggestRoute(clientUser.location, generateDefaultLocation(0.02))}>Suggest Route</button>
        </>
    );
}