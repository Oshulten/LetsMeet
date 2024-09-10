/* eslint-disable react/react-in-jsx-scope */
import { AdvancedMarker, AdvancedMarkerProps, InfoWindow, InfoWindowProps, Pin, PinProps, useAdvancedMarkerRef } from "@vis.gl/react-google-maps";
import { useState } from "react";
import haversine from 'haversine-distance';
import readableDistance from "../utilities/readableDistance";
import Meeting from "./Meeting";
import { UserLocation } from "../types/types";
import { useClientContext } from "./ClientContextProvider";

export interface RemoteUserMarkerProps {
    remoteLocation: UserLocation,
}

export default function RemoteUserMarker({ remoteLocation }: RemoteUserMarkerProps) {
    const { clientUser } = useClientContext();
    const [markerRef, marker] = useAdvancedMarkerRef();
    const [infoWindowShown, setInfoWindowShown] = useState(false);

    const location = {
        lat: remoteLocation.lat,
        lng: remoteLocation.lng
    }

    const infoWindowHeaderContent = (
        <div className="flex flex-row">
            <h2 className="font-bold text-lg">{remoteLocation.username}</h2>
        </div>);

    const infoWindowMainContent = (
        <div>
            <p>{readableDistance(haversine(location, clientUser.location))} away</p>
            <Meeting remoteUser={{ username: remoteLocation.username, clerkId: remoteLocation.clerkId }} />
        </div>);

    const markerProps: AdvancedMarkerProps = {
        position: remoteLocation,
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