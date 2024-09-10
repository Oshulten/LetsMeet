import { useEffect, useState } from "react";
import { HubClient, HubServer } from "../api/hub";
import { UserLocation, userLocationFromUser } from "../types/types";
import { useUserContext } from "../components/UserContextProvider";

export default function useLocations() {
    const { 
        user, 
        setLocation: setUserLocation, 
        connection, connectionProgress 
    } = useUserContext();
    
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
            user.location = newLocation;
            await HubServer.sendLocation(connection, userLocationFromUser(user));
        }
    }

    return {
        otherUsersLocations,
        setLocation
    }
}
