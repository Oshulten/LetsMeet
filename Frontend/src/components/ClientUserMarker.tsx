import { AdvancedMarker, AdvancedMarkerProps, Pin, PinProps } from "@vis.gl/react-google-maps";

import useClientUser from "../hooks/useClientUser";

/* eslint-disable react/react-in-jsx-scope */

export default function ClientUserMarker() {
    const { clientUser, setClientUserLocation } = useClientUser();

    if (!clientUser)
        return <></>

    const advancedMarkerProps: AdvancedMarkerProps = {
        position: clientUser.location,
        onDragEnd: (e: google.maps.MapMouseEvent) => {
            if (!e.latLng) return;
            setClientUserLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
        },
        zIndex: 1
    }

    const glyph = document.createElement("img");
    if (clientUser.imageUrl) {
        glyph.src = clientUser.imageUrl;
        glyph.style.width = '35px';
        glyph.style.height = '35px';
        glyph.classList.add("rounded-full")
    }


    const pinProps: PinProps = {
        background: '#44AA44',
        glyphColor: '#AAA',
        borderColor: '#444444',
        scale: 1.5,
        glyph: glyph
    }

    return (
        <AdvancedMarker {...advancedMarkerProps}>
            <Pin {...pinProps} />
        </AdvancedMarker>
    );
}