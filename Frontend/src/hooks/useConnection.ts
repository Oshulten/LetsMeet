import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "../types/types";

export default function useConnection() {
    const queryClient = useQueryClient();

    const queryKey = ["connection"];

    const connectionQuery = useQuery({
        queryKey,
        queryFn: async (): Promise<HubConnection> => {
            const clientUser = queryClient.getQueryData(["clientUser"]) as User;
            const connection = initializeConnection(clientUser);

            connection.onclose((error?: Error) => {
                console.log(`Connection closed${error ? " with error" : ''}`);
                if (error) console.log(error);
            });

            connection.onreconnected((connectionId?: string) => {
                console.log(`Connection reconnected${connectionId ? ` with connectionId  ${connectionId}` : ''}`);
            });

            await startConnection(connection);
            return connection;
        },
        enabled: queryClient.getQueryData(["clientUser"]) != undefined,
    });

    const initializeConnection = (clientUser?: User) => {
        const queryString = clientUser ? `?username=${clientUser.username}&clerkId=${clientUser.id}` : '';

        const connection =
            new HubConnectionBuilder()
                .withUrl(`${import.meta.env.VITE_LOCAL_BASE_URL}/${import.meta.env.VITE_HUB_SEGMENT}${queryString}`)
                .withAutomaticReconnect()
                .build();

        return connection;
    }

    const startConnection = async (connection: HubConnection) => {
        try {
            if (connection.state == "Connected") return;

            await connection.start();
            console.log(`Started connection with connection ID: ${connection.connectionId}`);
        } catch (err) {
            console.error(err as Error);
        }
    }

    return connectionQuery.data
}