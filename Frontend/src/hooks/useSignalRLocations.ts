import { HubConnectionBuilder } from "@microsoft/signalr";
import { useEffect, useState } from "react";

export default function useSignalRLocations() {
    const [locations, setLocations] = useState<Location[]>([]);

    useEffect(() => {
        const connection = new HubConnectionBuilder()
            .withUrl("http://localhost:5055/notifications")
            .build();

        connection.start();

        connection.on("RecieveGeolocation", data => {
            const location = JSON.parse(data) as Location;
            setLocations([...locations, location]);
        });
    }, []);

    return locations;
}