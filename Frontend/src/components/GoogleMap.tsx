/* eslint-disable react/react-in-jsx-scope */
import { APIProvider, Map, MapProps } from '@vis.gl/react-google-maps';
import useLocations from '../hooks/useLocations';
import OtherUserMarker from './OtherUserMarker';
import UserMarker from './UserMarker';
import useLetsMeetUser from '../hooks/useLetsMeetUser';
import useMeetings from '../hooks/useMeetings';

interface Props {
    defaultLocation: google.maps.LatLngLiteral,
}

export default function GoogleMap({ defaultLocation }: Props) {
    const user = useLetsMeetUser();

    const {
        location,
        setLocation,
        locations,
        connection,
    } = useLocations(defaultLocation);

    const {
        meetingRequests,
        requestMeeting,
        cancelMeeting
    } = useMeetings(connection);

    console.log("User WantsToMeet");
    console.log(meetingRequests);

    const handleDragEnd = (e: google.maps.MapMouseEvent) => {
        setLocation({ user: user, location: { lat: e.latLng!.lat(), lng: e.latLng!.lng() } });
    }

    if (!connection) {
        console.log('No connection is initialized');
        return <p>Establishing connection...</p>;
    }

    if (connection.state != "Connected") {
        console.log(connection.state);
        return <p>{connection.state}</p>;
    }

    const mapProps: MapProps = {
        style: { width: '100vw', height: '100vh' },
        defaultCenter: defaultLocation,
        defaultZoom: 15,
        gestureHandling: 'greedy',
        disableDefaultUI: true,
        mapId: 'LetsMeetMap',
    }

    return (
        <>
            <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                <Map {...mapProps}>
                    {locations.map(location =>
                        <OtherUserMarker
                            key={location.user.clerkId}
                            position={location}
                            userPosition={location}
                            handleRequestMeeting={() => requestMeeting(location.user)}
                            handleCancelMeeting={() => cancelMeeting(location.user)}
                            infoWindowIsOpen={meetingRequests.find(request => request.clerkId == location.user.clerkId) != undefined} />)}
                    <UserMarker location={location} onDragEnd={handleDragEnd} />
                </Map>
            </APIProvider>
        </>
    );
}