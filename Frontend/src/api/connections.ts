import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { User } from "../types/types";

export const Connection = {
    initializeConnection: (clientUser: User) => {
        console.log("initializeConnection");

        const queryString = `?username=${clientUser.username}&clerkId=${clientUser.id}`

        const localConnection =
            new HubConnectionBuilder()
                .withUrl(`${import.meta.env.VITE_LOCAL_BASE_URL}/${import.meta.env.VITE_HUB_SEGMENT}${queryString}`)
                .withAutomaticReconnect()
                .build();

        return localConnection;
    },

    startConnection: async (connection: HubConnection) => {
        try {
            console.log("startConnection");
            await connection.start();
            console.log(`Connection ID: ${connection.connectionId}`)
        } catch (err) {
            console.error(err as Error);
        }
    },
    queryKey: "connection"
}