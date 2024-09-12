import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useState, useEffect } from "react";
import useClientUser from "./useClientUser";
import usePlaces from "./usePlaces";

export default function useDirections(map: google.maps.Map | null) {
    const { place } = usePlaces();
    const { clientUser } = useClientUser();

    const routesLibrary = useMapsLibrary('routes');
    const [directionsService, setDirectionService] = useState<google.maps.DirectionsService>();
    const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();
    const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>();

    console.log(place, clientUser, map);

    useEffect(() => {
        if (!routesLibrary || !map || !clientUser) return;

        console.log("setting up directions");

        setDirectionService(new routesLibrary.DirectionsService());
        setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
    }, [routesLibrary, map]);

    useEffect(() => {
        const renderRoutes = async () => {
            if (!directionsService || !directionsRenderer || !clientUser || !place) return;

            console.log("rendering direction");

            const origin = clientUser.location
            const destination = { lat: place.location!.lat(), lng: place.location!.lng() };

            const request: google.maps.DirectionsRequest = {
                origin,
                destination,
                travelMode: google.maps.TravelMode.WALKING
            }

            const directionsResult = await directionsService.route(request)
            directionsRenderer.setDirections(directionsResult);
            setRoutes(directionsResult.routes);
        }

        renderRoutes();
    }, [directionsService, directionsRenderer, clientUser, place]);
}