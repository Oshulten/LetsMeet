/* eslint-disable react/react-in-jsx-scope */
import { APIProvider, Map, MapProps } from '@vis.gl/react-google-maps';
import useSignalRLocations from '../hooks/useSignalRLocations';
import OtherUserMarker from './OtherUserMarker';
import UserMarker from './UserMarker';

interface Props {
    defaultLocation: google.maps.LatLngLiteral,
}

export default function GoogleMap({ defaultLocation }: Props) {
    const {
        otherUserLocations,
        userLocation,
        setUserLocation,
        user,
        meetingRequests,
        requestMeeting,
        cancelMeeting,
        signalIsInitialized
    } = useSignalRLocations(defaultLocation);

    console.log("User WantsToMeet");
    console.log(meetingRequests);

    const handleDragEnd = (e: google.maps.MapMouseEvent) => {
        setUserLocation({ user: user, location: { lat: e.latLng!.lat(), lng: e.latLng!.lng() } });
    }

    if (!signalIsInitialized) {
        console.log("Signal is not initialized");
        return <p>Loading...</p>
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
                    {otherUserLocations.map(location =>
                        <OtherUserMarker
                            key={location.user.clerkId}
                            position={location}
                            userPosition={userLocation}
                            handleRequestMeeting={() => requestMeeting(location.user)}
                            handleCancelMeeting={() => cancelMeeting(location.user)}
                            infoWindowIsOpen={meetingRequests.find(request => request.clerkId == location.user.clerkId) != undefined} />)}
                    <UserMarker position={userLocation} onDragEnd={handleDragEnd} />
                </Map>
            </APIProvider >
        </>
    );
}