/* eslint-disable react/react-in-jsx-scope */
import { MapProps, Map } from '@vis.gl/react-google-maps';
import UseConnection from '../hooks/useConnection';
import useLocations from '../hooks/useLocations';
import { useUserContext } from './UserContextProvider';
import UserMarker from './UserMarker';
import OtherUserMarker from './OtherUserMarker';

export default function GoogleMap() {
    const { user } = useUserContext();
    const { connection, connectionProgress } = UseConnection();
    const { otherUsersLocations, setLocation } = useLocations(connection, connectionProgress);

    const mapProps: MapProps = {
        defaultCenter: user.location,
        defaultZoom: 10,
        gestureHandling: 'greedy',
        disableDefaultUI: true,
        mapId: import.meta.env.VITE_GOOGLE_MAP_ID,
    }

    return (
        <>
            <Map {...mapProps} className="w-96 h-96">
                {otherUsersLocations && otherUsersLocations.map(otherLocation =>
                    <OtherUserMarker
                        key={otherLocation.clerkId}
                        location={otherLocation}
                        infoWindowIsOpen={true} />)}
                <UserMarker updateLocation={setLocation} />
            </Map>
            <p>{JSON.stringify(otherUsersLocations)}</p>
        </>
    );



    // const { suggestMeetingPlaces } = usePlaces();

    // const {
    //     location,
    //     setLocation,
    //     locations,
    //     connection,
    // } = useLocations({
    //     lat: import.meta.env.VITE_DEFAULT_LOCATION_LAT,
    //     lng: import.meta.env.VITE_DEFAULT_LOCATION_LNG
    // });

    // const {
    //     meetingRequests,
    //     requestMeeting,
    //     cancelMeeting
    // } = useMeetings({
    //     connection,
    //     onSuccessfulMeetingRequest: (meetingUser: User) => {
    //         console.log(`You have a meeting with ${meetingUser.username}!`);
    //     }
    // });

    // const handleDragEnd = (e: google.maps.MapMouseEvent) => {
    //     setLocation({ user: user, location: { lat: e.latLng!.lat(), lng: e.latLng!.lng() } });
    // }

    // if (!connection) {
    //     console.log('No connection is initialized');
    //     return <p>Establishing connection...</p>;
    // }

    // if (connection.state != "Connected") {
    //     console.log(connection.state);
    //     return <p>{connection.state}</p>;
    // }




}