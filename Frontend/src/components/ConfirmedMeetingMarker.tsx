import { AdvancedMarker, AdvancedMarkerProps, InfoWindow, InfoWindowProps, Pin, PinProps, useAdvancedMarkerRef } from "@vis.gl/react-google-maps";
import { useState } from "react";
import useMeetings from "../hooks/useMeetings";

/* eslint-disable react/react-in-jsx-scope */

export default function ConfirmedMeetingMarker() {
    const [markerRef, marker] = useAdvancedMarkerRef();
    const [infoWindowShown, setInfoWindowShown] = useState(true);
    const { confirmedMeeting, cancelConfirmedMeeting } = useMeetings();

    if (!confirmedMeeting?.place) return null;

    const place = confirmedMeeting.place;


    const infoWindowHeaderContent = (
        <h2 className="leading-3 font-bold text-lg">{place.displayName}</h2>);

    const infoWindowMainContent = (
        <div>
            <button className="btn btn-warning" onClick={() => cancelConfirmedMeeting()}>Cancel meeting</button>
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