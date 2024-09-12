import { MapProps, Map } from '@vis.gl/react-google-maps';

import useClientUser from '../hooks/useClientUser';
import useRemoteUsers from '../hooks/useRemoteUsers';
import useMeetings from '../hooks/useMeetings';

import RemoteUserMarker, { RemoteUserMarkerProps } from './RemoteUserMarker';
import ClientUserMarker from './ClientUserMarker';
import Direction from './Direction';

import { UserLocation } from '../types/types';
import ConfirmedMeetingMarker from './ConfirmedMeetingMarker';
import SuccessfulMeetingModal, { openSuccessfulMeetingModal } from './SuccessfulMeetingModal';

/* eslint-disable react/react-in-jsx-scope */

export default function ClientMap() {
    const successfulMeetingModalId = "success";

    const { clientUser } = useClientUser();
    const { remoteUserLocations } = useRemoteUsers();
    useMeetings(successfulMeetingModalId);

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
                <ConfirmedMeetingMarker />
                <ClientUserMarker />
                <Direction />
            </Map>
            <SuccessfulMeetingModal id={successfulMeetingModalId} />
            <button onClick={() => openSuccessfulMeetingModal(successfulMeetingModalId, "Stranger", "35")}>Open modal</button>
        </>
    );
}