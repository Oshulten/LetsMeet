import { HubConnection } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { HubClient, HubServer } from "../api/hub";
import { UserLocation, userLocationFromUser } from "../types/types";
import { useUserContext } from "../components/UserContextProvider";
import { ConnectionProgress } from "./useConnection";

export default function useLocations(connection: HubConnection | undefined, connectionProgress: ConnectionProgress,) {
    const { user, setLocation: setUserLocation } = useUserContext();
    const [otherUsersLocations, setOtherUsersLocations] = useState<UserLocation[]>();

    useEffect(() => {
        console.log("useLocations");

        const registerCallbacks = async () => {
            if (connection && connectionProgress == `connected`) {
                HubClient.registerRecieveGeolocations(connection, fetchedLocations => {
                    console.log("Receiving locations");
                    console.log(fetchedLocations);

                    const otherUserLocations = fetchedLocations.filter(location => location.clerkId != user.clerkId);
                    setOtherUsersLocations(otherUserLocations);

                    const userLocation = fetchedLocations.find(location => location.clerkId == user.clerkId);

                    if (userLocation) {
                        setUserLocation({ lat: userLocation.lat, lng: userLocation.lng });
                        return;
                    }

                    console.error("This user's location was not among the fetched locations");
                });
            }
        }

        const sendInitialLocation = async () => {
            if (connection && connectionProgress == `connected`) {
                await HubServer.sendLocation(connection, userLocationFromUser(user));
            }
        }

        registerCallbacks();
        sendInitialLocation();
    }, [connection, connectionProgress]);

    const setLocation = async (newLocation: google.maps.LatLngLiteral) => {
        if (connection && connectionProgress == `connected`) {
            // setUserLocation(newLocation);
            user.location = newLocation;
            await HubServer.sendLocation(connection, userLocationFromUser(user));
        }
    }

    return {
        otherUsersLocations,
        setLocation
    }
}
