/* eslint-disable react/react-in-jsx-scope */
import { AdvancedMarker, AdvancedMarkerProps, InfoWindow, InfoWindowProps, Pin, PinProps, useAdvancedMarkerRef } from "@vis.gl/react-google-maps";
import { useState } from "react";
import haversine from 'haversine-distance';
import readableDistance from "../utilities/readableDistance";
import { UserLocation } from "../types/types";
import useClientUser from "../hooks/useClientUser";
import MeetingDialog from "./MeetingDialog";
import capitalize from "capitalize";

export interface RemoteUserMarkerProps {
    remoteLocation: UserLocation,
}

export default function RemoteUserMarker({ remoteLocation }: RemoteUserMarkerProps) {
    const { clientUser } = useClientUser();
    const [markerRef, marker] = useAdvancedMarkerRef();
    const [infoWindowShown, setInfoWindowShown] = useState(true);

    if (!clientUser) return <></>

    const infoWindowHeaderContent = (
        <h2 className="leading-3 font-bold text-lg">{capitalize.words(remoteLocation.user.username)}</h2>
    );

    const infoWindowMainContent = (
        <div className="flex flex-col items-start justify-center gap-4">
            <p className='text-left'>is {readableDistance(haversine(remoteLocation.location, clientUser.location))} away</p>
            <MeetingDialog remoteUser={{ username: remoteLocation.user.username, id: remoteLocation.user.id }} />
        </div>);

    const markerProps: AdvancedMarkerProps = {
        position: remoteLocation.location,
        onClick: () => setInfoWindowShown(isShown => !isShown),
        className: "overscroll-contain"
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