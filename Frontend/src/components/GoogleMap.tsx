/* eslint-disable react/react-in-jsx-scope */
import { MapProps, Map } from '@vis.gl/react-google-maps';
import UseConnection from '../hooks/useConnection';
import useLocations from '../hooks/useLocations';
import { useUserContext } from './UserContextProvider';
import UserMarker from './UserMarker';
import OtherUserMarker, { OtherUserMarkerProps } from './OtherUserMarker';
import useMeetings from '../hooks/useMeetings';
import { UserIdentity, UserLocation } from '../types/types';

export default function GoogleMap() {
    const { user } = useUserContext();
    const { connection, connectionProgress } = UseConnection();
    const { otherUsersLocations, setLocation } = useLocations(connection, connectionProgress);
    const {
        meetingRequests,
        requestMeeting,
        cancelMeeting
    } = useMeetings({
        connection,
        connectionProgress,
        onSuccessfulMeetingRequest: (meetingUser: UserIdentity) => {
            console.log(meetingUser);
        }
    });

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
            state: meetingRequests.find(m => m.clerkId == location.clerkId) != undefined
                ? 'awaitingUserConfirmation'
                : 'none',
            handleRequestMeeting: () => requestMeeting({ clerkId: location.clerkId, username: location.username }),
            handleCancelMeeting: () => cancelMeeting({ clerkId: location.clerkId, username: location.username })
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
            <p>{JSON.stringify(meetingRequests ?? "meetingRequests is undefined")}</p>
        </>
    );
}