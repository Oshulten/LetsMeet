import { HubConnection } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { User } from '../types/types';
import { HubClient, HubServer } from "../api/hub";
import useUserFromClerk from "./useLetsMeetUser";

export default function useMeetings(
    connection: HubConnection | null,
    onSuccessfulMeetingRequest: (meetingUser: User) => void) {

    const user = useUserFromClerk();
    const [meetingRequests, setMeetingRequests] = useState<User[]>([]);

    const requestMeeting = async (targetUser: User) => {
        if (!connection) return;
        console.log(`You request a meeting with ${targetUser.username}`);

        if (meetingRequests.find(u => u.clerkId == targetUser.clerkId)) {
            HubServer.confirmMeeting(connection, {
                requestUser: user,
                targetUser: targetUser
            });
            return;
        }

        await HubServer.requestMeeting(connection, {
            requestUser: user,
            targetUser: targetUser
        });

        const requestsWithTargetUser = [...meetingRequests, targetUser];
        setMeetingRequests(requestsWithTargetUser);
    }

    const cancelMeeting = async (targetUser: User) => {
        if (!connection) return;

        console.log(`You cancel a meeting with ${targetUser.username}`);

        await HubServer.cancelMeeting(connection, {
            requestUser: user,
            targetUser: targetUser
        });

        const requestsWithoutTargetUser = meetingRequests.filter(u => u.clerkId != targetUser.clerkId);
        setMeetingRequests(requestsWithoutTargetUser);
    }

    useEffect(() => {
        if (!connection) return;

        HubClient.registerReceiveMeetingRequest(connection, meeting => {
            console.log(`${meeting.requestUser.username} wants to meet you!`);
            const requestsWithRequestUser = [...meetingRequests, meeting.requestUser];
            setMeetingRequests(requestsWithRequestUser);
        });

        HubClient.registerRecieveMeetingCancellation(connection, meeting => {
            console.log(`${meeting.requestUser.username} cancelled a meeting with you`);
            const requestsWithoutRequestUser = meetingRequests.filter(u => u.clerkId != meeting.requestUser.clerkId);
            setMeetingRequests(requestsWithoutRequestUser);
            console.log(requestsWithoutRequestUser);
        });

        HubClient.registerReceiveMeetingConfirmation(connection, meeting => {
            console.log(`Meeting confirmed between ${meeting.requestUser.username} and ${meeting.targetUser.username}`);
            setMeetingRequests([]);
            const meetingWith = meeting.requestUser.clerkId == user.clerkId
                ? meeting.targetUser
                : meeting.requestUser
            onSuccessfulMeetingRequest(meetingWith);
        });
    }, [connection]);

    return {
        meetingRequests,
        requestMeeting,
        cancelMeeting
    }
}
