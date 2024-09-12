import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useState, useEffect } from "react";
import { equal } from 'mathjs'
import useClientUser from "./useClientUser";
import useMeetings from "./useMeetings";
import useRemoteUsers from "./useRemoteUsers";
import { UserLocation } from "../types/types";

export default function useRoutes(map: google.maps.Map | null) {
    const { clientUser } = useClientUser();
    const { remoteUserLocations } = useRemoteUsers();
    const { confirmedMeeting } = useMeetings();

    const routesLibrary = useMapsLibrary('routes');
    const [directionsService, setDirectionService] = useState<google.maps.DirectionsService>();
    const [directionsRenderers, setDirectionsRenderers] = useState<google.maps.DirectionsRenderer[]>();
    const [lastOrigins, setLastOrigins] = useState<google.maps.LatLngLiteral[]>();

    useEffect(() => {
        if (!routesLibrary || !map || !clientUser) return;

        setDirectionService(new routesLibrary.DirectionsService());
        setDirectionsRenderers([0, 1].map(() => new routesLibrary.DirectionsRenderer({ map })));
    }, [routesLibrary, map]);


    useEffect(() => {
        const getCurrentOrigins = () => {
            if (!confirmedMeeting?.participants || !clientUser?.location) {
                console.error("!");
                return;
            }

            const currentOrigins: google.maps.LatLngLiteral[] = [];

            const clientUserLocation: UserLocation = {
                user: { 
                    id: clientUser.id,
                    username: clientUser.username
                },
                location: clientUser.location
             };

             confirmedMeeting.participants.forEach(participant => {
                const matchingUserLocation = [...remoteUserLocations, clientUserLocation].find(x => x.user.id == participant.user.id);
                if (!matchingUserLocation) {
                    console.error("remote user mismatch with confirmed meeting");
                    return;
                }
                currentOrigins.push(matchingUserLocation.location);
            });

            return currentOrigins;
        }

        const lastOriginsAreIdenticalToOrigins = (origins: google.maps.LatLngLiteral[]) => {
            if (!lastOrigins) return false;

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

            const origins = getCurrentOrigins();

            if (!origins) return;

            if (lastOriginsAreIdenticalToOrigins(origins)) return;

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
    }, [directionsService, directionsRenderers, clientUser, confirmedMeeting, remoteUserLocations]);
}