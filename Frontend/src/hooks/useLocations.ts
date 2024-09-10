import { useEffect, useState } from "react";
import { HubClient, HubServer } from "../api/hub";
import { UserLocation, userLocationFromUser } from "../types/types";
import { useClientContext } from "../components/ClientContextProvider";

export type LocationsProgress = 'uninitialized' | 'initialized';

export default function useLocations() {
    const {
        clientUser,
        setLocation,
        connection,
        connectionProgress,
        locationsProgress,
        setLocationsProgress
    } = useClientContext();

    console.log(locationsProgress);

    const [remoteUserLocations, setRemoteUserLocations] = useState<UserLocation[]>();

    useEffect(() => {
        const registerCallbacks = async () => {
            console.log(registerCallbacks);
            if (connection && connectionProgress == `connected`) {
                HubClient.registerRecieveGeolocations(connection, fetchedLocations => {
                    console.log("Receiving locations");
                    console.log(fetchedLocations);

                    const otherUserLocations = fetchedLocations.filter(location => location.clerkId != clientUser.clerkId);
                    setRemoteUserLocations(otherUserLocations);

                    const userLocation = fetchedLocations.find(location => location.clerkId == clientUser.clerkId);

                    if (userLocation) {
                        setLocation({ lat: userLocation.lat, lng: userLocation.lng });
                    }
                });
            }
        }

        const sendInitialLocation = async () => {
            if (connection && connectionProgress == `connected`) {
                console.log("sendInitialLocation");
                await HubServer.sendLocation(connection, userLocationFromUser(clientUser));
            }
        }

        if (connection && connectionProgress == `connected` && locationsProgress == 'uninitialized') {
            registerCallbacks();
            sendInitialLocation();
            setLocationsProgress('initialized');
        }
    }, [connection, connectionProgress]);

    const setLocationSyncWithServer = async (newLocation: google.maps.LatLngLiteral) => {
        if (connection && connectionProgress == `connected`) {
            console.log("sendLocation");
            clientUser.location = newLocation;
            await HubServer.sendLocation(connection, userLocationFromUser(clientUser));
            setLocation({ ...newLocation });
        }
    }

    return {
        remoteUserLocations,
        setLocationSyncWithServer
    }
}
