import { HubConnection } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { DtoMeeting, User, userFromDto } from '../types/types';
import { HubClient, HubServer } from "../api/hub";
import useUserFromClerk from "./useLetsMeetUser";
import { latLng } from '../utilities/conversations';

export default function useMeetings(connection: HubConnection | null) {
    const user = useUserFromClerk();
    const [meetingRequests, setMeetingRequests] = useState<User[]>([]);

    const requestMeeting = async (targetUser: User) => {
        if (connection) {
            await HubServer.requestMeeting(connection, {
                requestUser: user,
                targetUser: targetUser
            });
            console.log(`You request a meeting with ${targetUser.username}`);
        }
    }

    const cancelMeeting = async (targetUser: User) => {
        if (connection) {
            await HubServer.cancelMeeting(connection, {
                requestUser: user,
                targetUser: targetUser
            });
            console.log(`You cancel your meeting with ${targetUser.username}`);
        }
    }

    const setHubCallbacks = (connection: HubConnection) => {
        HubClient.registerReceiveMeetingRequest(connection, meeting => {
            setMeetingRequests([...meetingRequests, meeting.requestUser]);
            console.log(`${meeting.requestUser.username} wants to meet you!`);
        });

        HubClient.registerRecieveMeetingCancellation(connection, meeting => {
            setMeetingRequests(meetingRequests.filter(u => u.clerkId != meeting.requestUser.clerkId));
            console.log(`${meeting.requestUser.username} cancelled your meeting`);
        });
    }

    useEffect(() => {
        if (!connection) {
            console.error("No connection");
            return;
        }
        setHubCallbacks(connection!);
        console.log("Setting callbacks");
    }, [connection]);

    return {
        meetingRequests,
        requestMeeting,
        cancelMeeting
    }
}
