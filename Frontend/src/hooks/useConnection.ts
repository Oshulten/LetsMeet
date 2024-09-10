import { HubConnectionBuilder } from "@microsoft/signalr";
import { useEffect } from "react";
import { useClientContext } from "../components/ClientContextProvider";

export type ConnectionProgress = "uninitialized" | "initialized" | "connected";

export default function useConnection() {
    const {
        clientUser: user,
        connection,
        setConnection,
        connectionProgress,
        setConnectionProgress
    } = useClientContext();

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
        };

        initializeConnection();
    }, []);

    useEffect(() => {
        const startConnection = async () => {
            if (connection && connectionProgress != 'connected') {
                try {
                    console.log("startConnection");
                    await connection.start();
                    setConnectionProgress('connected');
                    console.log(`Connection ID: ${connection.connectionId}`)

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
