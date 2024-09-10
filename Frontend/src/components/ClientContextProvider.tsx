/* eslint-disable react/react-in-jsx-scope */
import { createContext, useContext, useState } from "react";
import { ActiveMeeting, MeetingState, User, UserIdentity } from "../types/types";
import { useUser } from "@clerk/clerk-react";
import { HubConnection } from "@microsoft/signalr";
import { ConnectionProgress } from "../hooks/useConnection";

const defaultLocation: google.maps.LatLngLiteral = {
    lat: parseFloat(import.meta.env.VITE_DEFAULT_LOCATION_LAT),
    lng: parseFloat(import.meta.env.VITE_DEFAULT_LOCATION_LNG)
}

interface ClientContext {
    clientUser: User
    setLocation: (newLocation: google.maps.LatLngLiteral) => void,
    meetings: ActiveMeeting[],
    setMeetings: (newMeetings: ActiveMeeting[]) => ActiveMeeting[],
    getMeetingByUser: (user: UserIdentity) => ActiveMeeting | undefined,
    addMeeting: (meeting: ActiveMeeting) => ActiveMeeting,
    setMeetingState: (user: UserIdentity, state: MeetingState) => ActiveMeeting | undefined,
    removeMeeting: (user: UserIdentity) => void,
    connection: HubConnection | undefined,
    setConnection: (newConnection: HubConnection) => void,
    connectionProgress: ConnectionProgress,
    setConnectionProgress: (newProgress: ConnectionProgress) => void
}

const nullUser: User = { username: "null", clerkId: "null", location: defaultLocation };
const nullMeeting: ActiveMeeting = { user: nullUser, state: 'confirmed' };
const nullUserContext: ClientContext = {
    clientUser: nullUser,
    setLocation: () => { },
    meetings: [],
    setMeetings: () => [],
    getMeetingByUser: () => nullMeeting,
    addMeeting: () => nullMeeting,
    setMeetingState: () => nullMeeting,
    removeMeeting: () => { },
    connection: undefined,
    setConnection: () => { },
    connectionProgress: 'uninitialized',
    setConnectionProgress: () => { }
};

const UserContext = createContext<ClientContext>(nullUserContext);

interface Props {
    children?: React.ReactNode
}

export function ClientContextProvider({ children }: Props) {
    const clerkUser = useUser().user!;

    const clientUser = useState<User>({
        username: clerkUser.username!,
        clerkId: clerkUser.id,
        location: defaultLocation
    })[0];

    const setLocation = useState<google.maps.LatLngLiteral>(defaultLocation)[1];
    const [meetings, setMeetings] = useState<ActiveMeeting[]>([]);
    const [connection, setConnection] = useState<HubConnection>();
    const [connectionProgress, setConnectionProgress] = useState<ConnectionProgress>('uninitialized');

    const localMeetingByUser = (user: UserIdentity) =>
        meetings.find(m => m.user.clerkId == user.clerkId);

    const meetingsWithoutMeetingByUser = (user: UserIdentity) =>
        meetings.filter(m => m.user.clerkId == user.clerkId);

    const meetingsWithAddedMeeting = (meeting: ActiveMeeting) =>
        [...meetings, meeting];

    return (
        <UserContext.Provider
            value={{
                clientUser: clientUser!,
                setLocation,
                meetings,
                connection,
                setConnection,
                connectionProgress,
                setConnectionProgress,

                setMeetings: (newMeetings: ActiveMeeting[]) => {
                    setMeetings(newMeetings);
                    return newMeetings;
                },

                getMeetingByUser: localMeetingByUser,

                addMeeting: (meeting: ActiveMeeting) => {
                    if (localMeetingByUser(meeting.user))
                        return meeting;

                    const newMeetings = meetingsWithAddedMeeting(meeting);
                    setMeetings(newMeetings);
                    return meeting;
                },

                setMeetingState: (user: UserIdentity, state: MeetingState) => {
                    const existingMeeting = localMeetingByUser(user);
                    if (!existingMeeting) return;

                    const newMeeting = { ...existingMeeting, state: state };

                    const newMeetings = meetings.map(m =>
                        m.user.clerkId == user.clerkId
                            ? newMeeting
                            : m);

                    setMeetings(newMeetings)
                    return newMeeting;
                },

                removeMeeting: (user: UserIdentity) => {
                    setMeetings(meetingsWithoutMeetingByUser(user));
                }
            }}>
            {children}
        </UserContext.Provider>
    )
}

export function useClientContext() {
    return useContext(UserContext);
}