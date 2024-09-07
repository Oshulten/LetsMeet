import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { Geolocation, User } from '../api/types';
import { useUser } from "@clerk/clerk-react";
import { latLngLiteralToGeolocation } from "../utilities/conversations";

export default function useSignalRLocations(defaultLocation: google.maps.LatLngLiteral) {
    const { user } = useUser();
    const [currentLocation, setCurrentLocationLocal] = useState<Geolocation>(latLngLiteralToGeolocation(defaultLocation, user!.id, user!.username!));
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [locations, setLocations] = useState<Geolocation[]>([]);


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

    const setConnectionCallbacks = (localConnection: HubConnection) => {
        localConnection.on("RecieveGeolocations", fetchedLocations => {
            setLocations(fetchedLocations);
        });
    }

    const registerUser = async (localConnection: HubConnection) => {
        if (!user) {
            return;
        }

        if (!user.username) {
            return;
        }

        await localConnection.invoke("RegisterUser", { username: user.username, clerkId: user.id } as User);
    }

    const sendInitialLocation = async (localConnection: HubConnection) => {
        if (!user) {
            return;
        }

        if (!user.username) {
            return;
        }

        const geolocation = latLngLiteralToGeolocation(defaultLocation, user.id, user.username);
        await localConnection.invoke("SendLocation", geolocation);
    }

    const stopConnection = () => {
        if (!connection) {
            return;
        }

        connection.stop();
        setConnection(null);
    }

    const effectCallback = async () => {
        console.log("effectCallback");

        if (connection) {
            return stopConnection
        }

        let localConnection = initializeConnection();

        localConnection = (await startConnection(localConnection))!;

        if (!localConnection.connectionId) {
            return stopConnection;
        }

        setConnectionCallbacks(localConnection);
        registerUser(localConnection);
        sendInitialLocation(localConnection);
    }

    useEffect(() => {
        effectCallback();
        return stopConnection
    }, []);

    const setCurrentLocation = async (location: Geolocation) => {
        if (connection) {
            await connection.invoke("SendLocation", location);
            setCurrentLocationLocal(location);
        }
    }

    const signalIsInitialized = !(!connection || !user || !user.username || !locations);

    return {
        locations,
        currentLocation,
        setCurrentLocation,
        user,
        signalIsInitialized: signalIsInitialized
    };
}