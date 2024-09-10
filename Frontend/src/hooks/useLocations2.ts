import { HubConnection } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { HubClient, HubServer } from "../api/hub";
import { UserLocation, userLocationFromUser } from "../types/types";
import { useUserContext } from "../components/UserContextProvider";
import { ConnectionProgress } from "./useConnection";

export default function useLocations(connection: HubConnection | undefined, connectionProgress: ConnectionProgress) {
    const { user } = useUserContext();
    const [otherUsersLocations, setOtherUsersLocations] = useState<UserLocation[]>();

    useEffect(() => {
        console.log("useLocations");

        const registerCallbacks = async () => {
            if (connection && connectionProgress == `connected`) {
                console.log("registerCallbacks")
                HubClient.registerRecieveGeolocations(connection, fetchedLocations => {
                    console.log("Receiving locations");
                    setOtherUsersLocations(fetchedLocations);
                });
            }
        }

        const sendInitialLocation = async () => {
            if (connection && connectionProgress == `connected`) {
                console.log("sendInitialLocation");
                console.log(userLocationFromUser(user));
                await HubServer.sendLocation(connection, user);
            }
        }

        registerCallbacks();
        sendInitialLocation();
    }, [connection, connectionProgress]);

    return {
        otherUsersLocations
    }
}
