import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { Connection } from "../api/connections";
import { HubClient, HubServer } from "../api/hub";
import { HubConnection } from "@microsoft/signalr";
import { User, UserLocation, userLocationFromUser } from "../types/types";
import useClientUser, { ClientUser } from "./useClientUser";
import useConnection from "./useConnection";

export type LocationsProgress = 'uninitialized' | 'initialized';

const Locations = {
    queryKey: "locations",

    sendInitialLocation: async (connection: HubConnection, clientUser: User) => {
        console.log("sendInitialLocation");
        await HubServer.sendLocation(connection, userLocationFromUser(clientUser));
    },

    receiveGeolocationsCallback: (fetchedLocations: UserLocation[]) => {
        console.log("Receiving locations");
        console.log(fetchedLocations);
        const queryClient = useQueryClient()
        queryClient.setQueryData([Locations.queryKey], fetchedLocations);
    },

    registerCallbacks: async (connection: HubConnection, clientUser: User, queryClient: QueryClient) => {
        console.log("registerCallbacks");
        HubClient.registerRecieveGeolocations(connection, Locations.receiveGeolocationsCallback);
    },
};

export default function useLocations() {
    const queryClient = useQueryClient();
    const clientUser = useClientUser();
    const connection = useConnection();

    const initializeQuery = useQuery({
        queryKey: [Locations.queryKey],
        queryFn: async (): Promise<UserLocation[]> => {
            console.log(connection);
            await Locations.registerCallbacks(connection!, clientUser!, queryClient);
            await Locations.sendInitialLocation(connection!, clientUser!);
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
        setClientUserLocation
    }




    // const {
    //     clientUser,
    //     setLocation,
    //     connection,
    //     connectionProgress,
    //     locationsProgress,
    //     setLocationsProgress
    // } = useClientContext();

    // console.log(locationsProgress);

    // const [remoteUserLocations, setRemoteUserLocations] = useState<UserLocation[]>();

    // useEffect(() => {


    // const sendInitialLocation = async () => {
    //     if (connection && connectionProgress == `connected`) {
    //         console.log("sendInitialLocation");
    //         await HubServer.sendLocation(connection, userLocationFromUser(clientUser));
    //     }
    // }

    //     if (connection && connectionProgress == `connected` && locationsProgress == 'uninitialized') {
    //         registerCallbacks();
    //         sendInitialLocation();
    //         setLocationsProgress('initialized');
    //     }
    // }, [connection, connectionProgress]);

    // const setLocationSyncWithServer = async (newLocation: google.maps.LatLngLiteral) => {
    //     if (connection && connectionProgress == `connected`) {
    //         console.log("sendLocation");
    //         clientUser.location = newLocation;
    //         await HubServer.sendLocation(connection, userLocationFromUser(clientUser));
    //         setLocation({ ...newLocation });
    //     }
    // }

    // return {
    //     remoteUserLocations,
    //     setLocationSyncWithServer
    // }
}
