/* eslint-disable react/react-in-jsx-scope */
import { MapProps, Map } from '@vis.gl/react-google-maps';
import useConnection from '../hooks/useConnection';
import useLocations from '../hooks/useLocations';
import { useUserContext } from './UserContextProvider';
import UserMarker from './UserMarker';
import OtherUserMarker, { OtherUserMarkerProps } from './OtherUserMarker';
import { UserLocation } from '../types/types';

export default function GoogleMap() {
    const { user, meetings } = useUserContext();
    useConnection();
    const { otherUsersLocations, setLocation } = useLocations();

    const mapProps: MapProps = {
        defaultCenter: user.location,
        defaultZoom: 10,
        gestureHandling: 'greedy',
        disableDefaultUI: true,
        mapId: import.meta.env.VITE_GOOGLE_MAP_ID,
    }

    const otherUserMarkerProps = (location: UserLocation) => {
        return {
            location: location,
        } as OtherUserMarkerProps;
    }

    return (
        <>
            <Map {...mapProps} className="w-96 h-96">
                {otherUsersLocations && otherUsersLocations.map(location =>
                    <OtherUserMarker key={location.clerkId} {...otherUserMarkerProps(location)} />)
                }
                <UserMarker updateLocation={setLocation} />
            </Map>
            <p>{JSON.stringify(otherUsersLocations)}</p>
            <p>{JSON.stringify(meetings ?? "meetingRequests is undefined")}</p>
        </>
    );
}