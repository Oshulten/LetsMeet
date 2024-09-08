/* eslint-disable react/react-in-jsx-scope */
import { AdvancedMarker, AdvancedMarkerProps, InfoWindow, InfoWindowProps, Pin, PinProps, useAdvancedMarkerRef } from "@vis.gl/react-google-maps";
import { useCallback, useState } from "react";
import { Geolocation } from "../api/types";
import { geolocationToLatLngLiteral } from "../utilities/conversations";
import haversine from 'haversine-distance';
import readableDistance from "../utilities/readableDistance";

interface Props {
    position: Geolocation,
    userPosition: Geolocation
}

type MeetButtonState = "neutral" | "awaitingOtherUserConfirmation" | "awaitingUserConfirmation" | "cancelled";

export default function OtherUserMarker({ position, userPosition }: Props) {
    const [meetButtonState, setMeetButtonState] = useState<MeetButtonState>('neutral');
    const [markerRef, marker] = useAdvancedMarkerRef();
    const [infoWindowShown, setInfoWindowShown] = useState(false);

    const handleMarkerClick = useCallback(() => setInfoWindowShown(isShown => !isShown), []);
    const handleClose = useCallback(() => setInfoWindowShown(false), []);

    const infoWindowHeaderContent =
        <div className="flex flex-row">
            <h2 className="font-bold text-lg">{position.username}</h2>
        </div>

    function meetButton() {
        switch (meetButtonState) {
            case 'neutral':
                return <button onClick={() => setMeetButtonState('awaitingOtherUserConfirmation')} className="btn btn-info text-white font-normal w-full">{`Let's Meet!`}</button>
            case 'awaitingOtherUserConfirmation':
                return (<button onClick={() => setMeetButtonState('cancelled')} className="btn btn-info text-white font-normal w-full">
                    Waiting for response
                    <span className="loading loading-spinner text-white"></span>
                </button>)
            case 'awaitingUserConfirmation':
                return <button className="btn btn-info text-white font-normal w-full">{`Awaiting your response`}</button>
            case 'cancelled':
                return <button className="btn btn-info text-white font-normal w-full">{`Cancelled`}</button>
        }
    }

    const infoWindowMainContent =
        <div>
            <p>{readableDistance(haversine(position, userPosition))} away</p>
            {meetButton()}
        </div>

    const markerProps: AdvancedMarkerProps = {
        position: geolocationToLatLngLiteral(position),
        onClick: handleMarkerClick
    }

    const pinProps: PinProps = {
        background: '#F0B004',
        glyphColor: '#000',
        borderColor: '#000'
    }

    const infoWindowProps: InfoWindowProps = {
        anchor: marker,
        onClose: handleClose,
        headerContent: infoWindowHeaderContent
    }

    return (
        <>
            <AdvancedMarker ref={markerRef} {...markerProps}>
                <Pin {...pinProps} />
            </ AdvancedMarker>

            {infoWindowShown && (
                <InfoWindow {...infoWindowProps}>
                    {infoWindowMainContent}
                </InfoWindow >)
            }
        </>
    );
}