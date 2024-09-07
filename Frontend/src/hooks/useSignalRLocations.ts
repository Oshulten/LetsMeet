import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { DtoGeolocation } from '../api/types';
import { useUser } from "@clerk/clerk-react";
import { ensureUserExists } from "../api/endpoints";

export default function useSignalRLocations() {
    const { user } = useUser();
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [locations, setLocations] = useState<DtoGeolocation[]>([]);

    console.log(`Connected user ${user!.id} to hub`);

    useEffect(() => {
        const connection = new HubConnectionBuilder()
            .withUrl("http://localhost:5055/notifications")
            .build();

        const establishConnection = async () => {
            try {
                await connection.start();

                connection.on("RecieveGeolocations", data => {
                    setLocations(data);
                });

                setConnection(connection);

                if (user) ensureUserExists({ clerkId: user.id, username: user.username ?? "Inkognito", });
            } catch (err) {
                console.error(err as Error);
            }
        }

        establishConnection();
    }, []);

    const sendLocation = async (location: DtoGeolocation) => {
        if (connection) {
            await connection.invoke("SendLocation", location);
        }
    }

    return {
        locations,
        sendLocation,
        user
    };
}