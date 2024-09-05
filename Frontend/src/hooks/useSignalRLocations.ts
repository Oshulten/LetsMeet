import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { MapLocation } from "../api/types";

export default function useSignalRLocations() {
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [locations, setLocations] = useState<MapLocation[]>([]);

    useEffect(() => {
        const connection = new HubConnectionBuilder()
            .withUrl("http://localhost:5055/notifications")
            .build();

        try {
            connection.start();
            connection.on("RecieveGeolocation", data => {
                const location = JSON.parse(data) as MapLocation;
                setLocations([...locations, location]);
            });

            setConnection(connection);
        } catch (err) {
            console.error(err as Error);
        }
    }, []);

    const sendLocation = async (location: MapLocation) => {
        if (connection) {
            await connection.invoke("SendLocation", location);
        }
    }

    return {
        locations,
        sendLocation
    };
}