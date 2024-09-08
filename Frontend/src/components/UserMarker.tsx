import { AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { Geolocation } from '../api/types';
import { latLngLiteral } from "../utilities/conversations";

/* eslint-disable react/react-in-jsx-scope */
interface Props {
    position: Geolocation,
    onDragEnd: (e: google.maps.MapMouseEvent) => void
}

export default function UserMarker({ position, onDragEnd }: Props) {
    return (
        <AdvancedMarker
            position={latLngLiteral(position)}
            onDragEnd={onDragEnd}>
            <Pin
                background={'#00AA00'}
                glyphColor={'#000'}
                borderColor={'#000'}
            />
        </AdvancedMarker>
    );
}