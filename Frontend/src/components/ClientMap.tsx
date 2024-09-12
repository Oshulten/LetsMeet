/* eslint-disable react/react-in-jsx-scope */
import { MapProps, Map } from '@vis.gl/react-google-maps';
// import ClientUserMarker from './ClientUserMarker';
import useClientUser from '../hooks/useClientUser';
import useRemoteUsers from '../hooks/useRemoteUsers';
import { UserLocation } from '../types/types';
import RemoteUserMarker, { RemoteUserMarkerProps } from './RemoteUserMarker';
import ClientUserMarker from './ClientUserMarker';
import useMeetings from '../hooks/useMeetings';
import usePlaces from '../hooks/usePlaces';
import PlaceMarker from './PlaceMarker';

export default function ClientMap() {
    const { clientUser } = useClientUser();
    const { remoteUserLocations } = useRemoteUsers();
    useMeetings();
    const { places, suggestMeetingPlacesTest } = usePlaces();


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
            </Map>
            <button onClick={() => suggestMeetingPlacesTest()}>Suggest Places</button>
        </>
    );
}