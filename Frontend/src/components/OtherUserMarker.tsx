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

export default function OtherUserMarker({ position, userPosition }: Props) {
    const [markerRef, marker] = useAdvancedMarkerRef();
    const [infoWindowShown, setInfoWindowShown] = useState(false);

    const handleMarkerClick = useCallback(() => setInfoWindowShown(isShown => !isShown), []);
    const handleClose = useCallback(() => setInfoWindowShown(false), []);

    const distanceFromUser = haversine(position, userPosition);

    const infoWindowHeaderContent =
        <div className="flex flex-row">
            <h2 className="font-bold text-lg">{position.username}</h2>
        </div>

    const infoWindowMainContent =
        <div>
            <p>{readableDistance(distanceFromUser)} away</p>
            <button className="btn btn-info text-white font-normal w-full">{`Let's Meet!`}</button>
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