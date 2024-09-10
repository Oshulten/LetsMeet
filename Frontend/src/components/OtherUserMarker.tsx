/* eslint-disable react/react-in-jsx-scope */
import { AdvancedMarker, AdvancedMarkerProps, InfoWindow, InfoWindowProps, Pin, PinProps, useAdvancedMarkerRef } from "@vis.gl/react-google-maps";
import { useCallback, useState } from "react";
import haversine from 'haversine-distance';
import readableDistance from "../utilities/readableDistance";
import MeetingButton from "./MeetingButton";
import { UserLocation } from "../types/types";
import { useUserContext } from "./UserContextProvider";

interface Props {
    location: UserLocation,
    // handleRequestMeeting: () => Promise<void>,
    // handleCancelMeeting: () => Promise<void>,
    infoWindowIsOpen: boolean
}

export default function OtherUserMarker({ location, infoWindowIsOpen }: Props) {
    const { user } = useUserContext();

    const thisLocation: google.maps.LatLngLiteral = {
        lat: location.lat,
        lng: location.lng
    }

    const [markerRef, marker] = useAdvancedMarkerRef();
    const [infoWindowShown, setInfoWindowShown] = useState(infoWindowIsOpen);

    const handleMarkerClick = useCallback(() => setInfoWindowShown(isShown => !isShown), []);
    const handleClose = useCallback(() => setInfoWindowShown(false), []);

    const infoWindowHeaderContent =
        <div className="flex flex-row">
            <h2 className="font-bold text-lg">{location.username}</h2>
        </div>

    const distanceToUser = haversine(thisLocation, user.location);

    const infoWindowMainContent =
        <div>
            <p>{readableDistance(distanceToUser)} away</p>
            {/* <MeetingButton
                handleRequestMeeting={handleRequestMeeting}
                handleCancelMeeting={handleCancelMeeting}
                otherUser={position.userIdentity}
            /> */}
        </div>

    const markerProps: AdvancedMarkerProps = {
        position: location,
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