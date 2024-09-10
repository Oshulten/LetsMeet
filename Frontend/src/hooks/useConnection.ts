import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { useUserContext } from "../components/UserContextProvider";

export type ConnectionProgress = "uninitialized" | "initialized" | "connected";

export default function UseConnection() {
    const { user } = useUserContext();
    const [connectionProgress, setConnectionProgress] = useState<ConnectionProgress>('uninitialized');
    const [connection, setConnection] = useState<HubConnection>();

    console.log(connectionProgress);

    useEffect(() => {
        const initializeConnection = async () => {
            if (connectionProgress != 'uninitialized') return;

            const queryString = `?username=${user.username}&clerkId=${user.clerkId}`

            const localConnection =
                new HubConnectionBuilder()
                    .withUrl(`${import.meta.env.VITE_LOCAL_BASE_URL}/${import.meta.env.VITE_HUB_SEGMENT}${queryString}`)
                    .withAutomaticReconnect()
                    .build();

            setConnection(localConnection);
            setConnectionProgress('initialized');
            console.log("initializeConnection");
            console.log(localConnection);
        };

        initializeConnection();
    }, []);

    useEffect(() => {
        const startConnection = async () => {
            if (connection && connectionProgress != 'connected') {
                try {
                    console.log("startConnection");
                    await connection.start();
                    console.log(connection);
                    setConnectionProgress('connected');

                } catch (err) {
                    console.error(err as Error);
                }
            }
        }
        startConnection();
    }, [connection, connectionProgress]);

    return {
        connection,
        connectionProgress,
    };
}
