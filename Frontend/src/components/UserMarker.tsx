import { AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { UserLocation } from "../types/types";

/* eslint-disable react/react-in-jsx-scope */
interface Props {
    location: UserLocation,
    onDragEnd: (e: google.maps.MapMouseEvent) => void
}

export default function UserMarker({ location, onDragEnd }: Props) {
    return (
        <AdvancedMarker
            position={location.location}
            onDragEnd={onDragEnd}>
            <Pin
                background={'#00AA00'}
                glyphColor={'#000'}
                borderColor={'#000'}
            />
        </AdvancedMarker>
    );
}