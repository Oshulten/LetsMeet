import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { UserLocation } from '../types/types';
import { HubClient, HubServer } from "../api/hub";
import useUserFromClerk from "./useUserFromClerk";

export default function useLocations(defaultLocation: google.maps.LatLngLiteral) {
    const user = useUserFromClerk();
    const [location, setLocation] = useState<UserLocation>({ user: user, location: defaultLocation });
    const [connection, setConnection] = useState<HubConnection>();
    const [locations, setLocations] = useState<UserLocation[]>([]);


    // const startConnection = async (localConnection: HubConnection) => {
    //     try {
    //         await localConnection.start();
    //         return localConnection;
    //     } catch (err) {
    //         console.error(err as Error);
    //     }
    // }

    // const setHubCallbacks = (localConnection: HubConnection) => {
    // HubClient.registerRecieveGeolocations(localConnection, fetchedLocations => {
    //     fetchedLocations = fetchedLocations.filter(loc => loc.user.clerkId != user.clerkId);
    //     setLocations(fetchedLocations);
    // });
    // }

    // const registerUser = async (localConnection: HubConnection) => {
    //     await HubServer.registerUser(localConnection, user);
    // }

    // const sendInitialLocation = async (localConnection: HubConnection) => {
    //     console.log(location);
    //     await HubServer.sendLocation(localConnection, location);
    // }

    // const stopConnection = () => {
    //     if (!connection) {
    //         return;
    //     }

    //     connection.stop();
    //     setConnection(undefined);
    // }

    // const effectCallback = async () => {
    //     if (connection) {
    //         return stopConnection
    //     }

    //     let localConnection = initializeConnection();

    //     localConnection = (await startConnection(localConnection))!;
    //     if (!localConnection.connectionId) {
    //         return stopConnection;
    //     }

    //     setHubCallbacks(localConnection);
    //     registerUser(localConnection);
    //     sendInitialLocation(localConnection);
    // }

    useEffect(() => {
        const initializeConnection = async () => {
            if (connection) {
                return;
            }

            const localConnection =
                new HubConnectionBuilder()
                    .withUrl(`${import.meta.env.VITE_LOCAL_BASE_URL}/${import.meta.env.VITE_HUB_SEGMENT}`)
                    .withAutomaticReconnect()
                    .build();

            setConnection(localConnection);

            console.log("initializeConnection");
            console.log(localConnection);
        };

        initializeConnection();
    }, []);

    useEffect(() => {
        const registerCallbacks = async () => {
            if (connection) {
                try {
                    console.log("registerCallbacks");
                    console.log(connection);
                    await connection.start();

                    HubClient.registerRecieveGeolocations(connection, fetchedLocations => {
                        fetchedLocations = fetchedLocations.filter(loc => loc.user.clerkId != user.clerkId);
                        setLocations(fetchedLocations);
                    });
                } catch (err) {
                    console.error(err as Error);
                }
            }
        }

        const registerUser = async () => {
            if (connection && connection.state == "Connected") {
                console.log("registerUser");
                console.log(connection);
                await HubServer.registerUser(connection, user);
            }
        }

        // registerCallbacks();
        // registerUser();
    }, [connection]);

    // useEffect(() => {
    //     effectCallback();
    //     return stopConnection
    // }, []);

    const setCurrentLocation = async (location: UserLocation) => {
        if (connection) {
            console.log(location);
            await HubServer.sendLocation(connection, location);
            setLocation(location);
        }
    }

    return {
        location: location,
        setLocation: setCurrentLocation,
        locations: locations,
        connection: connection
    };
}
