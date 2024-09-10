/* eslint-disable react/react-in-jsx-scope */
import { MapProps, Map } from '@vis.gl/react-google-maps';
import useConnection from '../hooks/useConnection';
import useLocations from '../hooks/useLocations';
import { useClientContext } from './ClientContextProvider';
import ClientUserMarker from './ClientUserMarker';
import RemoteUserMarker, { RemoteUserMarkerProps } from './RemoteUserMarker';
import { UserLocation } from '../types/types';

export default function ClientMap() {
    const { clientUser, meetings } = useClientContext();
    useConnection();
    const { remoteUserLocations } = useLocations();

    const mapProps: MapProps = {
        defaultCenter: clientUser.location,
        defaultZoom: 10,
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
            <Map {...mapProps} className="w-96 h-96">
                {remoteUserLocations && remoteUserLocations.map(location =>
                    <RemoteUserMarker key={location.clerkId} {...remoteUserMarkerProps(location)} />)
                }
                <ClientUserMarker />
            </Map>
            <p>{JSON.stringify(remoteUserLocations)}</p>
            <p>{JSON.stringify(meetings ?? "meetingRequests is undefined")}</p>
        </>
    );
}