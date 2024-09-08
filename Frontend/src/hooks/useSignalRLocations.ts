import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { Geolocation, Meeting, User } from '../api/types';
import { useUser } from "@clerk/clerk-react";
import { ClerkUserToUser, latLngLiteralToGeolocation } from "../utilities/conversations";

export default function useSignalRLocations(defaultLocation: google.maps.LatLngLiteral) {
    const user = useUser().user!;
    const [currentLocation, setCurrentLocationLocal] = useState<Geolocation>(latLngLiteralToGeolocation(defaultLocation, user.id, user.username!));
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [locations, setLocations] = useState<Geolocation[]>([]);
    const [userWantsToMeet, setUserWantsToMeet] = useState<User[]>([]);

    const initializeConnection = () => {
        if (connection) {
            return connection;
        }

        const localConnection =
            new HubConnectionBuilder()
                .withUrl(`${import.meta.env.VITE_LOCAL_BASE_URL}/${import.meta.env.VITE_HUB_SEGMENT}`)
                .build();

        setConnection(localConnection);
        return localConnection;
    }

    const startConnection = async (localConnection: HubConnection) => {
        try {
            await localConnection.start();
            return localConnection;
        } catch (err) {
            console.error(err as Error);
        }
    }

    const setConnectionCallbacks = (localConnection: HubConnection) => {
        localConnection.on("RecieveGeolocations", (fetchedLocations: Geolocation[]) => {
            fetchedLocations = fetchedLocations.filter(loc => loc.clerkId != user.id);
            setLocations(fetchedLocations);
        });

        localConnection.on("ReceiveWantMeeting", (meeting: Meeting) => {
            setUserWantsToMeet([...userWantsToMeet, meeting.requestUser]);
        });

        localConnection.on("ReceiveCancelMeeting", (meeting: Meeting) => {
            setUserWantsToMeet(userWantsToMeet.filter(u => u.clerkId != meeting.requestUser.clerkId));
        });
    }

    const registerUser = async (localConnection: HubConnection) => {
        await localConnection.invoke("RegisterUser", { username: user.username, clerkId: user.id } as User);
    }

    const sendInitialLocation = async (localConnection: HubConnection) => {
        const geolocation = latLngLiteralToGeolocation(defaultLocation, user.id, user.username!);
        await localConnection.invoke("SendLocation", geolocation);
    }

    const stopConnection = () => {
        if (!connection) {
            return;
        }

        connection.stop();
        setConnection(null);
    }

    const effectCallback = async () => {
        if (connection) {
            return stopConnection
        }

        let localConnection = initializeConnection();

        localConnection = (await startConnection(localConnection))!;

        if (!localConnection.connectionId) {
            return stopConnection;
        }

        setConnectionCallbacks(localConnection);
        registerUser(localConnection);
        sendInitialLocation(localConnection);
    }

    useEffect(() => {
        effectCallback();
        return stopConnection
    }, []);

    const setCurrentLocation = async (location: Geolocation) => {
        if (connection) {
            await connection.invoke("SendLocation", location);
            setCurrentLocationLocal(location);
        }
    }

    const wantsMeeting = async (targetUser: User) => {
        if (connection) {
            console.log(`You request a meeting with ${targetUser.username}`);
            const meeting: Meeting = {
                requestUser: ClerkUserToUser(user.id, user.username!),
                targetUser: targetUser
            }
            await connection.invoke("WantsToMeet", meeting);
        }
    }

    const cancelMeeting = async (targetUser: User) => {
        if (connection) {
            console.log(`You cancel your meeting with ${targetUser.username}`);
            const meeting: Meeting = {
                requestUser: ClerkUserToUser(user.id, user.username!),
                targetUser: targetUser
            }
            await connection.invoke("CancelWantsMeet", meeting);
        }
    }

    const signalIsInitialized = !(!connection || !user || !user.username || !locations);

    return {
        otherUserLocations: locations,
        userLocation: currentLocation,
        setUserLocation: setCurrentLocation,
        user: user,
        userWantsToMeet: userWantsToMeet,
        wantsMeeting: wantsMeeting,
        cancelMeeting: cancelMeeting,
        signalIsInitialized: signalIsInitialized
    };
}