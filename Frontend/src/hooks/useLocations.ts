import { useQuery } from "@tanstack/react-query";
import { HubClient, HubServer } from "../api/hub";
import { User, UserLocation, userLocationFromUser } from "../types/types";
import useClientUser, { ClientUser } from "./useClientUser";
import useConnection from "./useConnection";
import { queryClient } from "../main";

export default function useLocations() {
    const clientUser = useClientUser();
    const connection = useConnection();

    const queryKey = "locations";

    const sendInitialLocation = async () => {
        if (!connection || !clientUser) return;
        console.log("sendInitialLocation");
        await HubServer.sendLocation(connection, userLocationFromUser(clientUser));
    }

    const receiveGeolocationsCallback = (fetchedLocations: UserLocation[]) => {
        if (!connection || !clientUser) return;
        console.log("Receiving locations");
        console.log(fetchedLocations);
        console.log(queryClient);
        const remoteLocations = fetchedLocations.filter(location => location.clerkId != clientUser.clerkId)
        queryClient.setQueryData([queryKey], remoteLocations);
        const queryData = queryClient.getQueryData([queryKey]);
        console.log(queryData);
    }

    const registerCallbacks = async () => {
        if (!connection || !clientUser) return;
        console.log("registerCallbacks");
        HubClient.registerRecieveGeolocations(connection, receiveGeolocationsCallback);
    }

    const locationsQuery = useQuery({
        queryKey: [queryKey],
        queryFn: async (): Promise<UserLocation[]> => {
            console.log(connection);
            await registerCallbacks();
            await sendInitialLocation();
            return [] as UserLocation[];
        },
        enabled:
            clientUser != undefined &&
            connection != undefined
    });

    const setClientUserLocation = async (newLocation: google.maps.LatLngLiteral) => {
        console.log("sendLocation");

        if (!(connection && clientUser)) {
            console.log("Not ready");
            return;
        }

        const newClientUser: User = {
            ...clientUser,
            location: newLocation
        }

        queryClient.setQueryData([ClientUser.queryKey], newClientUser);

        await HubServer.sendLocation(connection, userLocationFromUser(newClientUser));
    }

    return {
        remoteUserLocations: locationsQuery.data,
        setClientUserLocation
    }
}
