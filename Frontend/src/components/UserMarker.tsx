import { AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { useUserContext } from "./UserContextProvider";

/* eslint-disable react/react-in-jsx-scope */
interface Props {
    updateLocation: (newLocation: google.maps.LatLngLiteral) => Promise<void>
}


export default function UserMarker({ updateLocation }: Props) {
    const { user } = useUserContext();

    const handleDragEnd = (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) {
            console.error("MapMouseEvent event does not have a defined location");
            return;
        }

        updateLocation({
            lat: e.latLng.lat(),
            lng: e.latLng.lng()
        });
    }

    return (
        <AdvancedMarker
            position={user.location}
            onDragEnd={e => handleDragEnd(e)}
            zIndex={1}>
            <Pin
                background={'#00AA00'}
                glyphColor={'#000'}
                borderColor={'#000'}

            />
        </AdvancedMarker>
    );
}