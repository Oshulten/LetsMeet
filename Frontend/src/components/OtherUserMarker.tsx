/* eslint-disable react/react-in-jsx-scope */
import { AdvancedMarker, InfoWindow, Pin, useAdvancedMarkerRef } from "@vis.gl/react-google-maps";
import { useCallback, useState } from "react";
import { Geolocation } from "../api/types";
import { geolocationToLatLngLiteral } from "../utilities/conversations";

interface Props {
    position: Geolocation
}


export default function OtherUserMarker({ position }: Props) {
    const [markerRef, marker] = useAdvancedMarkerRef();
    const [infoWindowShown, setInfoWindowShown] = useState(false);

    const handleMarkerClick = useCallback(() => setInfoWindowShown(isShown => !isShown), []);

    const handleClose = useCallback(() => setInfoWindowShown(false), []);

    return (
        <>
            <AdvancedMarker
                ref={markerRef}
                position={geolocationToLatLngLiteral(position)}
                onClick={handleMarkerClick}
            />

            {infoWindowShown && (
                <InfoWindow anchor={marker} onClose={handleClose}>
                    <h2>{position.username}</h2>
                    <p>Some arbitrary html to be rendered into the InfoWindow.</p>
                </InfoWindow>

            )}

            <Pin
                background={'#F0B004'}
                glyphColor={'#000'}
                borderColor={'#000'} />
        </>
    );
};