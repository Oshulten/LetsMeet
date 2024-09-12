import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useState, useEffect } from "react";
import useClientUser from "./useClientUser";
import useMeetings from "./useMeetings";

export default function useDirections(map: google.maps.Map | null) {
    const { clientUser } = useClientUser();
    const { confirmedMeeting } = useMeetings();

    const routesLibrary = useMapsLibrary('routes');
    const [directionsService, setDirectionService] = useState<google.maps.DirectionsService>();
    const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();

    useEffect(() => {
        if (!routesLibrary || !map || !clientUser) return;

        setDirectionService(new routesLibrary.DirectionsService());
        setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
    }, [routesLibrary, map]);

    useEffect(() => {
        const renderRoutes = async () => {
            console.log(confirmedMeeting);
            if (!directionsService || !directionsRenderer || !clientUser || !confirmedMeeting?.place?.location) return;

            const origin = clientUser.location
            const destination = confirmedMeeting.place?.location;

            const request: google.maps.DirectionsRequest = {
                origin,
                destination,
                travelMode: google.maps.TravelMode.WALKING
            }

            const directionsResult = await directionsService.route(request)
            directionsRenderer.setDirections(directionsResult);
        }

        renderRoutes();
    }, [directionsService, directionsRenderer, clientUser, confirmedMeeting]);
}