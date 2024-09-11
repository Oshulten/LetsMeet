import { HubConnection } from "@microsoft/signalr";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "../types/types";
import { Connection } from "../api/connections";

export default function useConnection() {
    const queryClient = useQueryClient();

    const connectionQuery = useQuery({
        queryKey: [Connection.queryKey],
        queryFn: async (): Promise<HubConnection> => {
            const clientUser = queryClient.getQueryData(["clientUser"]) as User;
            const connection = Connection.initializeConnection(clientUser);
            await Connection.startConnection(connection);
            return connection;
        },
        enabled: queryClient.getQueryData(["clientUser"]) != undefined
    });

    return connectionQuery.data

}