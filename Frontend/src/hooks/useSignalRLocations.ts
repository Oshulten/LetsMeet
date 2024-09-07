import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { DtoGeolocation, DtoUser } from '../api/types';
import { useUser } from "@clerk/clerk-react";
import { latLngLiteralToGeolocation } from "../utilities/conversations";

export default function useSignalRLocations(defaultLocation: google.maps.LatLngLiteral) {
    const { user } = useUser();
    const [currentLocation, setCurrentLocationLocal] = useState<DtoGeolocation>(latLngLiteralToGeolocation(defaultLocation, user!.id, user!.username!));
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [locations, setLocations] = useState<DtoGeolocation[]>([]);

    useEffect(() => {
        const connection = new HubConnectionBuilder()
            .withUrl("http://localhost:5055/notifications")
            .build();

        console.log(`Connected user ${user!.id} to hub`);

        const startConnection = async () => {
            try {
                await connection.start();
                await connection.invoke("RegisterUser", { username: user?.username, clerkId: user?.id } as DtoUser)

                connection.on("RecieveGeolocations", fetchedLocations => {
                    setLocations(fetchedLocations);
                });

                setConnection(connection);
            } catch (err) {
                console.error(err as Error);
            }
        }

        const stopConnection = () => {
            connection.stop();
        }

        startConnection();

        return stopConnection;
    }, []);

    const setCurrentLocation = async (location: DtoGeolocation) => {
        if (connection) {
            await connection.invoke("SendLocation", location);
            setCurrentLocationLocal(location);
        }
    }

    return {
        locations,
        currentLocation,
        setCurrentLocation,
        user
    };
}