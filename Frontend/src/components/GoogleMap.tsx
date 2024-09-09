/* eslint-disable react/react-in-jsx-scope */
import { APIProvider, Map, MapProps } from '@vis.gl/react-google-maps';
import useLocations from '../hooks/useLocations';
import OtherUserMarker from './OtherUserMarker';
import UserMarker from './UserMarker';
import useLetsMeetUser from '../hooks/useLetsMeetUser';
import useMeetings from '../hooks/useMeetings';
import { User } from '../types/types';

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
    } = useMeetings({
        connection,
        onSuccessfulMeetingRequest: (meetingUser: User) => {
            console.log(`You have a meeting with ${meetingUser.username}!`);
        }
    });

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
        defaultZoom: 5,
        gestureHandling: 'greedy',
        disableDefaultUI: true,
        mapId: 'LetsMeetMap',
    }

    return (
        <>
            <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                <Map {...mapProps}>
                    {locations.map(loc =>
                        <OtherUserMarker
                            key={loc.user.clerkId}
                            position={loc}
                            userPosition={location}
                            handleRequestMeeting={() => requestMeeting(loc.user)}
                            handleCancelMeeting={() => cancelMeeting(loc.user)}
                            infoWindowIsOpen={meetingRequests.find(request => request.clerkId == loc.user.clerkId) != undefined} />)}
                    <UserMarker location={location} onDragEnd={handleDragEnd} />
                </Map>
            </APIProvider>
        </>
    );
}