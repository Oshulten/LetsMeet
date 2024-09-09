/* eslint-disable react/react-in-jsx-scope */
import UseConnection from '../hooks/useConnection';
import useLocations from '../hooks/useLocations2';
import { useUserContext } from './UserContextProvider';

export default function GoogleMap() {
    const { user } = useUserContext();
    console.log(user);
    const { connection } = UseConnection();
    const { otherUsersLocations } = useLocations(connection);

    console.log(connection);

    return (
        <>
            <p>{`connectionState: ${connection?.state}`}</p>
            <button onClick={() => console.log(connection)}>Print Connection</button>
        </>)
    // const user = useLetsMeetUser();

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

    // const mapProps: MapProps = {
    //     style: { width: '100vw', height: '100vh' },
    //     defaultCenter: defaultLocation,
    //     defaultZoom: 5,
    //     gestureHandling: 'greedy',
    //     disableDefaultUI: true,
    //     mapId: import.meta.env.VITE_GOOGLE_MAP_ID,
    // }

    // return (
    //     <>
    //         <Map {...mapProps} className="w-96 h-96">
    //             {locations.map(loc =>
    //                 <OtherUserMarker
    //                     key={loc.user.clerkId}
    //                     position={loc}
    //                     userPosition={location}
    //                     handleRequestMeeting={() => requestMeeting(loc.user)}
    //                     handleCancelMeeting={() => cancelMeeting(loc.user)}
    //                     infoWindowIsOpen={true}/>)}
    //             <UserMarker location={location} onDragEnd={handleDragEnd} />
    //         </Map>
    //     </>
    // );
}