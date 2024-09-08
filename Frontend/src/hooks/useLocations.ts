import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { UserLocation } from '../types/types';
import { HubClient, HubServer } from "../api/hub";
import useUserFromClerk from "./useLetsMeetUser";

export default function useLocations(defaultLocation: google.maps.LatLngLiteral) {
    const user = useUserFromClerk();
    const [location, setLocation] = useState<UserLocation>({ user: user, location: defaultLocation });
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [locations, setLocations] = useState<UserLocation[]>([]);

    const initializeConnection = () => {
        if (connection) {
            return connection;
        }

        const localConnection =
            new HubConnectionBuilder()
                .withUrl(`${import.meta.env.VITE_LOCAL_BASE_URL}/${import.meta.env.VITE_HUB_SEGMENT}`)
                .build();

        setConnection(localConnection);
        return localConnection;
    }

    const startConnection = async (localConnection: HubConnection) => {
        try {
            await localConnection.start();
            return localConnection;
        } catch (err) {
            console.error(err as Error);
        }
    }

    const setHubCallbacks = (localConnection: HubConnection) => {
        HubClient.registerRecieveGeolocations(localConnection, fetchedLocations => {
            fetchedLocations = fetchedLocations.filter(loc => loc.user.clerkId != user.clerkId);
            setLocations(fetchedLocations);
        });
    }

    const registerUser = async (localConnection: HubConnection) => {
        await HubServer.registerUser(localConnection, user);
    }

    const sendInitialLocation = async (localConnection: HubConnection) => {
        await HubServer.sendLocation(localConnection, location);
    }

    const stopConnection = () => {
        if (!connection) {
            return;
        }

        connection.stop();
        setConnection(null);
    }

    const effectCallback = async () => {
        if (connection) {
            return stopConnection
        }

        let localConnection = initializeConnection();

        localConnection = (await startConnection(localConnection))!;

        if (!localConnection.connectionId) {
            return stopConnection;
        }

        setHubCallbacks(localConnection);
        registerUser(localConnection);
        sendInitialLocation(localConnection);
    }

    useEffect(() => {
        effectCallback();
        return stopConnection
    }, []);

    const setCurrentLocation = async (location: UserLocation) => {
        if (connection) {
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
