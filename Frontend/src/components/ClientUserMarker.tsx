import { AdvancedMarker, AdvancedMarkerProps, Pin, PinProps } from "@vis.gl/react-google-maps";
import useLocations from "../hooks/useLocations";
import useClientUser from "../hooks/useClientUser";

/* eslint-disable react/react-in-jsx-scope */

export default function ClientUserMarker() {
    const clientUser = useClientUser();
    const { setClientUserLocation } = useLocations();

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

    const pinProps: PinProps = {
        background: '#00AA00',
        glyphColor: '#000',
        borderColor: '#000'
    }

    return (
        <AdvancedMarker {...advancedMarkerProps}>
            <Pin {...pinProps} />
        </AdvancedMarker>
    );
}