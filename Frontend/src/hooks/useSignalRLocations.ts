import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { DtoGeolocation, DtoUser } from '../api/types';
import { useUser } from "@clerk/clerk-react";

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

                await connection.invoke("RegisterUser", { username: user?.username, clerkId: user?.id } as DtoUser)

                connection.on("RecieveGeolocations", data => {
                    setLocations(data);
                });

                setConnection(connection);
            } catch (err) {
                console.error(err as Error);
            }
        }

        const abortConnection = () => {
            connection.stop();
        }

        establishConnection();

        return abortConnection;
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