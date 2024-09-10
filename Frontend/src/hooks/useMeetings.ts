import { HubConnection } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { ActiveMeeting, UserIdentity, userIdentityFromUser } from '../types/types';
import { HubClient, HubServer } from "../api/hub";
import { useUserContext } from "../components/UserContextProvider";
import { ConnectionProgress } from './useConnection';

interface Props {
    connection?: HubConnection,
    connectionProgress: ConnectionProgress,
    onSuccessfulMeetingRequest: (meetingUser: UserIdentity) => void
}

export default function useMeetings({ connection, connectionProgress, onSuccessfulMeetingRequest }: Props) {
    const { user, meetings, setMeetings } = useUserContext();

    const userIdentity = userIdentityFromUser(user);

    const requestMeeting = async (targetUser: UserIdentity) => {
        if (!(connection && connectionProgress == 'connected')) return;

        console.log(`You request a meeting with ${targetUser.username}`);

        if (meetings.find(m => m.user.clerkId == targetUser.clerkId)) {
            HubServer.confirmMeeting(connection, {
                requestUser: userIdentity,
                targetUser: targetUser,
            });
            return;
        }

        const meeting: ActiveMeeting = {
            user: targetUser,
            state: 'awaitingOtherUserConfirmation'
        };

        setMeetings([...meetings, meeting]);

        await HubServer.requestMeeting(connection, {
            requestUser: userIdentity,
            targetUser: targetUser
        });
    }

    const cancelMeeting = async (targetUser: UserIdentity) => {
        if (!(connection && connectionProgress == 'connected')) return;

        console.log(`You cancel a meeting with ${targetUser.username}`);

        setMeetings(meetings.filter(m => m.user.clerkId == targetUser.clerkId));

        await HubServer.cancelMeeting(connection, {
            requestUser: userIdentity,
            targetUser: targetUser
        });
    }

    useEffect(() => {
        if (!(connection && connectionProgress == 'connected')) return;

        HubClient.registerReceiveMeetingRequest(connection, meeting => {
            console.log(`${meeting.requestUser.username} wants to meet you!`);

            if (meetings.find(m => m.user.clerkId == meeting.requestUser.clerkId)) {
                
            }

            setMeetings([...meetings, meeting.requestUser]);
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
    }, [connection, connectionProgress]);

    return {
        meetingRequests,
        requestMeeting,
        cancelMeeting
    }
}
