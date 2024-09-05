import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useEffect, useState } from "react";

export default function useSignalRLocations() {
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [locations, setLocations] = useState<Location[]>([]);

    useEffect(() => {
        const connection = new HubConnectionBuilder()
            .withUrl("http://localhost:5055/notifications")
            .build();

        try {
            connection.start();
            connection.on("RecieveGeolocation", data => {
                const location = JSON.parse(data) as Location;
                setLocations([...locations, location]);
            });

            setConnection(connection);
        } catch (err) {
            console.error(err as Error);
        }
    }, []);

    const sendLocation = async (location: Location) => {
        if (connection) {
            await connection.invoke("SendLocation", location);
        }
    }

    return {
        locations,
        sendLocation
    };
}