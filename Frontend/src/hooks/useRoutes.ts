import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useState, useEffect } from "react";
import { equal } from 'mathjs'
import useClientUser from "./useClientUser";
import useMeetings from "./useMeetings";

export default function useRoutes(map: google.maps.Map | null) {
    const { clientUser } = useClientUser();
    const { confirmedMeeting } = useMeetings();

    const routesLibrary = useMapsLibrary('routes');
    const [directionsService, setDirectionService] = useState<google.maps.DirectionsService>();
    const [directionsRenderers, setDirectionsRenderers] = useState<google.maps.DirectionsRenderer[]>();
    const [lastOrigins, setLastOrigins] = useState<google.maps.LatLngLiteral[]>([]);

    useEffect(() => {
        if (!routesLibrary || !map || !clientUser) return;

        setDirectionService(new routesLibrary.DirectionsService());
        setDirectionsRenderers([0, 1].map(() => new routesLibrary.DirectionsRenderer({ map })));
    }, [routesLibrary, map]);


    useEffect(() => {
        const lastOriginsAreIdenticalToOrigins = (origins: google.maps.LatLngLiteral[]) => {
            const eq = [0, 1]
                .map(i => equal(origins[i].lat, lastOrigins[i].lat) && equal(origins[i].lng, lastOrigins[i].lng))
            return (eq[0] == true && eq[1] == true);
        }
        const renderRoutes = async () => {
            if (!directionsService ||
                !directionsRenderers ||
                !clientUser ||
                !confirmedMeeting?.participants ||
                !confirmedMeeting?.place?.location) return;

            const origins = confirmedMeeting.participants.map(p => p.location);

            console.log("rendering routes 1");

            console.log(lastOrigins);
            console.log(origins);

            if (lastOrigins.length == 0) {
                setLastOrigins(origins);
            } else if (lastOriginsAreIdenticalToOrigins(origins)) {
                console.log("lastOrignins are identical to origins")
                return;
            }

            console.log("lastOrigins are not identical to origins");

            const destination = confirmedMeeting.place?.location;

            const requests: google.maps.DirectionsRequest[] = origins.map(origin => ({
                origin,
                destination,
                travelMode: google.maps.TravelMode.WALKING
            }));

            const directionsResults = await Promise.all(
                (requests.map(async (request) =>
                    await directionsService.route(request))));

            [0, 1].forEach(i => directionsRenderers[i].setDirections(directionsResults[i]));

            setLastOrigins(origins);
        }

        renderRoutes();
    }, [directionsService, directionsRenderers, clientUser, confirmedMeeting, lastOrigins]);
}