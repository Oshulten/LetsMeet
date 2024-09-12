import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useState, useEffect } from "react";
import { equal } from 'mathjs'
import useClientUser from "./useClientUser";
import useMeetings from "./useMeetings";
import useRemoteUsers from "./useRemoteUsers";
import { UserLocation } from "../types/types";
import haversine from 'haversine-distance';

export default function useDirections(map: google.maps.Map | null) {
    const proximityForSuccessfulMeeting = 50;

    const { clientUser } = useClientUser();
    const { remoteUserLocations } = useRemoteUsers();
    const { confirmedMeeting, setConfirmedMeetingAsSuccess } = useMeetings();

    const routesLibrary = useMapsLibrary('routes');
    const [directionsService, setDirectionService] = useState<google.maps.DirectionsService>();
    const [directionsRenderers, setDirectionsRenderers] = useState<google.maps.DirectionsRenderer[]>();
    const [lastOrigins, setLastOrigins] = useState<google.maps.LatLngLiteral[]>();

    useEffect(() => {
        if (!routesLibrary || !map || !clientUser) return;

        setDirectionService(new routesLibrary.DirectionsService());
        setDirectionsRenderers([0, 1].map(() => new routesLibrary.DirectionsRenderer({})));
    }, [routesLibrary, map]);

    useEffect(() => {
        const disableDirections = () => {
            if (!directionsRenderers) return;

            directionsRenderers.forEach(renderer => renderer.setMap(null));
        }

        const enableDirections = () => {
            if (!directionsRenderers) return;

            directionsRenderers.forEach(renderer => renderer.setMap(map));
        }

        const getCurrentOrigins = () => {
            if (!confirmedMeeting?.participants || !clientUser?.location) return;

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

            if (haversine(origins[0], origins[1]) < proximityForSuccessfulMeeting) {
                console.log("Users met!");
                setConfirmedMeetingAsSuccess();
            }

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

        if (!confirmedMeeting?.place) {
            disableDirections();
            return;
        }

        enableDirections();
        renderRoutes();
    }, [directionsService, directionsRenderers, clientUser, confirmedMeeting, remoteUserLocations]);
}