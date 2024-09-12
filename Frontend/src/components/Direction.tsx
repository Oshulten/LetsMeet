/* eslint-disable react/react-in-jsx-scope */
import { useMap } from "@vis.gl/react-google-maps";
import useDirections from "../hooks/useDirections";
import usePlaces from "../hooks/usePlaces";
import useClientUser from "../hooks/useClientUser";

export default function Direction() {
    const { suggestAndRenderRoute } = useDirections();
    const { place } = usePlaces();
    const { clientUser } = useClientUser();
    const map = useMap();

    if (!map || !place || !clientUser) {
        console.log("No map, place or clientUser");
        return <></>
    }

    suggestAndRenderRoute(clientUser.location, { lat: place.location!.lat(), lng: place.location!.lng() }, map);
    return <></>
}