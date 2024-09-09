import { HubConnection } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { HubClient, HubServer } from "../api/hub";
import { UserLocation, userLocationFromUser } from "../types/types";
import { useUserContext } from "../components/UserContextProvider";

export default function useLocations(connection?: HubConnection) {
    const { user } = useUserContext();
    const [otherUsersLocations, setOtherUsersLocations] = useState<UserLocation[]>();

    useEffect(() => {
        console.log("useLocations");
        console.log(connection);

        if (connection)
            console.log(connection.state);

        const registerCallbacks = async () => {
            if (connection) {
                console.log("registerCallbacks")
                HubClient.registerRecieveGeolocations(connection, fetchedLocations => {
                    console.log("Receiving locations");
                    setOtherUsersLocations(fetchedLocations);
                });
            }
        }

        const sendInitialLocation = async () => {
            if (connection && connection.state == "Connected") {
                console.log("sendInitialLocation");
                await HubServer.sendLocation(connection, userLocationFromUser(user));
            }
        }

        registerCallbacks();
        sendInitialLocation();
    }, [connection]);

    return {
        otherUsersLocations
    }
}
