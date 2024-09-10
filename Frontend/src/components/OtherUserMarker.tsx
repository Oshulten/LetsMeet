/* eslint-disable react/react-in-jsx-scope */
import { AdvancedMarker, AdvancedMarkerProps, InfoWindow, InfoWindowProps, Pin, PinProps, useAdvancedMarkerRef } from "@vis.gl/react-google-maps";
import { useState } from "react";
import haversine from 'haversine-distance';
import readableDistance from "../utilities/readableDistance";
import MeetingButton from "./MeetingButton";
import { UserLocation } from "../types/types";
import { useUserContext } from "./UserContextProvider";

export interface OtherUserMarkerProps {
    location: UserLocation,
}

export default function OtherUserMarker({ location }: OtherUserMarkerProps) {
    const { user } = useUserContext();
    const [markerRef, marker] = useAdvancedMarkerRef();
    const [infoWindowShown, setInfoWindowShown] = useState(false);

    const thisLocation: google.maps.LatLngLiteral = {
        lat: location.lat,
        lng: location.lng
    }

    const infoWindowHeaderContent =
        <div className="flex flex-row">
            <h2 className="font-bold text-lg">{location.username}</h2>
        </div>

    const distanceToUser = haversine(thisLocation, user.location);

    const infoWindowMainContent =
        <div>
            <p>{readableDistance(distanceToUser)} away</p>
            <MeetingButton otherUser={{ username: location.username, clerkId: location.clerkId }} />
        </div>

    const markerProps: AdvancedMarkerProps = {
        position: location,
        onClick: () => setInfoWindowShown(isShown => !isShown),
    }

    const pinProps: PinProps = {
        background: '#F0B004',
        glyphColor: '#000',
        borderColor: '#000'
    }

    const infoWindowProps: InfoWindowProps = {
        anchor: marker,
        onClose: () => setInfoWindowShown(false),
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