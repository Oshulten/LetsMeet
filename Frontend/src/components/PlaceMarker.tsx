import { AdvancedMarker, AdvancedMarkerProps, InfoWindow, InfoWindowProps, Pin, PinProps, useAdvancedMarkerRef } from "@vis.gl/react-google-maps";
import { useState } from "react";

/* eslint-disable react/react-in-jsx-scope */
interface PlaceMarkerProps {
    place: google.maps.places.Place
}

export default function PlaceMarker({ place } : PlaceMarkerProps) {
    const [markerRef, marker] = useAdvancedMarkerRef();
    const [infoWindowShown, setInfoWindowShown] = useState(true);

    if (!place) return <></>

    const infoWindowHeaderContent = (
        <div className="flex flex-row">
            <h2 className="font-bold text-lg">{place.displayName}</h2>
        </div>);

    const infoWindowMainContent = (
        <div>
        </div>);

    const markerProps: AdvancedMarkerProps = {
        position: place.location,
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