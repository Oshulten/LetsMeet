/* eslint-disable react/react-in-jsx-scope */
import { MapProps, Map } from '@vis.gl/react-google-maps';
import ClientUserMarker from './ClientUserMarker';
import useClientUser from '../hooks/useClientUser';
import useConnection from '../hooks/useConnection';
import useLocations from '../hooks/useLocations';

export default function ClientMap() {
    // const { clientUser, meetings } = useClientContext();
    const clientUser = useClientUser();
    const connection = useConnection();
    // const { remoteUserLocations } = useLocations();

    if (!clientUser) {
        console.log("clientUser is undefined");
        return <p>Getting client user</p>
    }

    const mapProps: MapProps = {
        defaultCenter: clientUser.location,
        defaultZoom: 10,
        gestureHandling: 'greedy',
        disableDefaultUI: true,
        mapId: import.meta.env.VITE_GOOGLE_MAP_ID,
    }

    // const remoteUserMarkerProps = (location: UserLocation) => {
    //     return {
    //         remoteLocation: location,
    //     } as RemoteUserMarkerProps;
    // }

    return (
        <>
            <Map {...mapProps} className="w-96 h-96">
                {/* {remoteUserLocations && remoteUserLocations.map(location =>
                    <RemoteUserMarker key={location.clerkId} {...remoteUserMarkerProps(location)} />)
                } */}
                <ClientUserMarker />
            </Map>
            {/* <p>{JSON.stringify(remoteUserLocations)}</p>
            <p>{JSON.stringify(meetings ?? "meetingRequests is undefined")}</p> */}
        </>
    );
}