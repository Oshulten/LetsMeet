import { AdvancedMarker, AdvancedMarkerProps, Pin, PinProps } from "@vis.gl/react-google-maps";
import { useClientContext } from "./ClientContextProvider";
import useLocations from "../hooks/useLocations";

/* eslint-disable react/react-in-jsx-scope */

export default function ClientUserMarker() {
    const { clientUser } = useClientContext();
    const { setLocationSyncWithServer } = useLocations()

    const advancedMarkerProps: AdvancedMarkerProps = {
        position: clientUser.location,
        onDragEnd: (e: google.maps.MapMouseEvent) => {
            if (!e.latLng) return;
            setLocationSyncWithServer({ lat: e.latLng.lat(), lng: e.latLng.lng() });
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