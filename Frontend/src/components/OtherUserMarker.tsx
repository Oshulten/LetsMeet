/* eslint-disable react/react-in-jsx-scope */
import { AdvancedMarker, AdvancedMarkerProps, InfoWindow, InfoWindowProps, Pin, PinProps, useAdvancedMarkerRef } from "@vis.gl/react-google-maps";
import { useCallback, useState } from "react";
import { Geolocation } from "../api/types";
import { latLngLiteral, GeolocationToUser } from "../utilities/conversations";
import haversine from 'haversine-distance';
import readableDistance from "../utilities/readableDistance";
import MeetingButton from "./MeetingButton";

interface Props {
    position: Geolocation,
    userPosition: Geolocation,
    handleRequestMeeting: () => Promise<void>,
    handleCancelMeeting: () => Promise<void>,
    infoWindowIsOpen: boolean
}

export default function OtherUserMarker({ position, userPosition, handleRequestMeeting, handleCancelMeeting, infoWindowIsOpen }: Props) {
    const [markerRef, marker] = useAdvancedMarkerRef();
    const [infoWindowShown, setInfoWindowShown] = useState(infoWindowIsOpen);

    const handleMarkerClick = useCallback(() => setInfoWindowShown(isShown => !isShown), []);
    const handleClose = useCallback(() => setInfoWindowShown(false), []);

    const infoWindowHeaderContent =
        <div className="flex flex-row">
            <h2 className="font-bold text-lg">{position.username}</h2>
        </div>

    const infoWindowMainContent =
        <div>
            <p>{readableDistance(haversine(position, userPosition))} away</p>
            <MeetingButton
                handleRequestMeeting={handleRequestMeeting}
                handleCancelMeeting={handleCancelMeeting}
                otherUser={GeolocationToUser(position)}
            />
        </div>

    const markerProps: AdvancedMarkerProps = {
        position: latLngLiteral(position),
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