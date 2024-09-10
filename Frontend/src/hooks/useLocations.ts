import { useEffect, useState } from "react";
import { HubClient, HubServer } from "../api/hub";
import { UserLocation, userLocationFromUser } from "../types/types";
import { useClientContext } from "../components/ClientContextProvider";

export default function useLocations() {
    const {
        clientUser,
        setLocation: setUserLocation,
        connection, connectionProgress
    } = useClientContext();

    const [remoteUserLocations, setRemoteUserLocations] = useState<UserLocation[]>();

    useEffect(() => {
        console.log("useLocations");

        const registerCallbacks = async () => {
            if (connection && connectionProgress == `connected`) {
                HubClient.registerRecieveGeolocations(connection, fetchedLocations => {
                    console.log("Receiving locations");
                    console.log(fetchedLocations);

                    const otherUserLocations = fetchedLocations.filter(location => location.clerkId != clientUser.clerkId);
                    setRemoteUserLocations(otherUserLocations);

                    const userLocation = fetchedLocations.find(location => location.clerkId == clientUser.clerkId);

                    if (userLocation) {
                        setUserLocation({ lat: userLocation.lat, lng: userLocation.lng });
                    }
                });
            }
        }

        const sendInitialLocation = async () => {
            if (connection && connectionProgress == `connected`) {
                await HubServer.sendLocation(connection, userLocationFromUser(clientUser));
            }
        }

        registerCallbacks();
        sendInitialLocation();
    }, [connection, connectionProgress]);

    const setLocation = async (newLocation: google.maps.LatLngLiteral) => {
        if (connection && connectionProgress == `connected`) {
            clientUser.location = newLocation;
            await HubServer.sendLocation(connection, userLocationFromUser(clientUser));
        }
    }

    return {
        remoteUserLocations,
        setLocation
    }
}
