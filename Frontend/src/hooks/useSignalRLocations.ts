import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { Geolocation, User } from '../api/types';
import { useUser } from "@clerk/clerk-react";
import { latLngLiteralToGeolocation } from "../utilities/conversations";

export default function useSignalRLocations(defaultLocation: google.maps.LatLngLiteral) {
    console.log("Top of useSignalRLocations");

    const { user } = useUser();
    const [currentLocation, setCurrentLocationLocal] = useState<Geolocation>(latLngLiteralToGeolocation(defaultLocation, user!.id, user!.username!));
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [locations, setLocations] = useState<Geolocation[]>([]);


    const initializeConnection = () => {
        if (connection) {
            console.error(`InitializeConnection: connection is already initialized`);
            return connection;
        }

        const localConnection =
            new HubConnectionBuilder()
                .withUrl(`${import.meta.env.VITE_LOCAL_BASE_URL}/${import.meta.env.VITE_HUB_SEGMENT}`)
                .build();

        setConnection(localConnection);
        console.log(`Connected user ${user!.id} to hub`);

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
            console.error(`RegisterUser: user is undefined`);
            return;
        }

        if (!user.username) {
            console.error(`RegisterUser: username is undefined`);
            return;
        }

        await localConnection.invoke("RegisterUser", { username: user.username, clerkId: user.id } as User);
    }

    const sendInitialLocation = async (localConnection: HubConnection) => {
        if (!user) {
            console.error(`RegisterUser: user is undefined`);
            return;
        }

        if (!user.username) {
            console.error(`RegisterUser: username is undefined`);
            return;
        }

        const geolocation = latLngLiteralToGeolocation(defaultLocation, user.id, user.username);
        await localConnection.invoke("SendLocation", geolocation);
    }

    const stopConnection = () => {
        if (!connection) {
            console.error(`StopConnection: connection is not initialized`);
            return;
        }

        connection.stop();
        setConnection(null);
    }

    const effectCallback = async () => {
        console.log("effectCallback");

        if (connection) {
            console.log("Effect of useSignalRLocations: connection is already initialized");
            return stopConnection
        }

        let localConnection = initializeConnection();

        localConnection = (await startConnection(localConnection))!;

        if (!localConnection.connectionId) {
            console.error("Local connection lacks id");
            return stopConnection;
        }

        setConnectionCallbacks(localConnection);
        registerUser(localConnection);
        sendInitialLocation(localConnection);
    }

    useEffect(() => {
        console.log("Effect of useSignalRLocations");
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