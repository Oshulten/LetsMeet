import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useState, useEffect } from "react";
import useClientUser from "./useClientUser";
import useMeetings from "./useMeetings";

export default function useRoutes(map: google.maps.Map | null) {
    const { clientUser } = useClientUser();
    const { confirmedMeeting } = useMeetings();

    const routesLibrary = useMapsLibrary('routes');
    const [directionsService, setDirectionService] = useState<google.maps.DirectionsService>();
    const [directionsRenderers, setDirectionsRenderers] = useState<google.maps.DirectionsRenderer[]>();

    useEffect(() => {
        if (!routesLibrary || !map || !clientUser) return;

        setDirectionService(new routesLibrary.DirectionsService());
        setDirectionsRenderers([0, 1].map(() => new routesLibrary.DirectionsRenderer({ map })));
    }, [routesLibrary, map]);

    useEffect(() => {
        const renderRoutes = async () => {
            if (!directionsService ||
                !directionsRenderers ||
                !clientUser ||
                !confirmedMeeting?.participants ||
                !confirmedMeeting?.place?.location) return;


            const origins = confirmedMeeting.participants.map(p => p.location);
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
            // const directionsResult = await directionsService.route(request)
            // directionsRenderer.setDirections(directionsResult);
        }

        renderRoutes();
    }, [directionsService, directionsRenderers, clientUser, confirmedMeeting]);
}