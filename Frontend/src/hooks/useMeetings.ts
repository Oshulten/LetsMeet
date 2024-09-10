import { useEffect } from "react";
import { ActiveMeeting, Meeting, UserIdentity, userIdentityFromUser } from '../types/types';
import { HubClient, HubServer } from "../api/hub";
import { useClientContext } from "../components/ClientContextProvider";

export default function useMeetings() {
    const {
        clientUser: user,
        meetings,
        getMeetingByUser,
        addMeeting,
        setMeetingState,
        removeMeeting,
        connection,
        connectionProgress
    } = useClientContext();

    const userIdentity = userIdentityFromUser(user);

    const confirmMeeting = async (meeting: ActiveMeeting) => {
        if (!(connection && connectionProgress == 'connected')) return;

        await HubServer.confirmMeeting(connection, {
            requestUser: userIdentity,
            targetUser: meeting.user
        });
    }

    const requestMeeting = async (targetUser: UserIdentity) => {
        if (!(connection && connectionProgress == 'connected')) return;

        console.log(`You request a meeting with ${targetUser.username}`);

        const existingMeeting = getMeetingByUser(targetUser);

        if (!existingMeeting) {
            const newMeeting: ActiveMeeting = {
                user: targetUser,
                state: 'awaitingOtherUserConfirmation'
            }
            console.log(newMeeting);
            addMeeting(newMeeting);

            const meetingRequest: Meeting = {
                requestUser: userIdentity,
                targetUser: targetUser
            }

            await HubServer.requestMeeting(connection, meetingRequest);

            return;
        }

        console.log(existingMeeting);

        if (existingMeeting.state == 'awaitingUserConfirmation') {
            await confirmMeeting(existingMeeting);
            return;
        }
    }

    const cancelMeeting = async (targetUser: UserIdentity) => {
        if (!(connection && connectionProgress == 'connected')) return;

        console.log(`You cancel a meeting with ${targetUser.username}`);

        removeMeeting(targetUser);

        await HubServer.cancelMeeting(connection, {
            requestUser: userIdentity,
            targetUser: targetUser
        });
    }

    useEffect(() => {
        if (!(connection && connectionProgress == 'connected')) return;

        HubClient.registerReceiveMeetingRequest(connection, meeting => {
            console.log(`${meeting.requestUser.username} wants to meet you!`);

            const existingMeeting = getMeetingByUser(meeting.requestUser);

            if (!existingMeeting) {
                const newMeeting: ActiveMeeting = {
                    user: meeting.requestUser,
                    state: 'awaitingUserConfirmation'
                }
                console.log("adding new meeting");
                console.log(newMeeting);
                addMeeting(newMeeting);
                return;
            }

            if (existingMeeting.state == 'awaitingOtherUserConfirmation') {
                const meeting = setMeetingState(existingMeeting.user, 'confirmed');
                if (!meeting)
                    return;

                confirmMeeting(meeting);
                return;
            }
        });

        HubClient.registerRecieveMeetingCancellation(connection, meeting => {
            console.log(`${meeting.requestUser.username} cancelled a meeting with you`);

            const existingMeeting = getMeetingByUser(meeting.requestUser);

            if (!existingMeeting)
                return;

            removeMeeting(meeting.requestUser);
        });

        HubClient.registerReceiveMeetingConfirmation(connection, meeting => {
            console.log(`Meeting confirmed between ${meeting.requestUser.username} and ${meeting.targetUser.username}`);

            const existingMeeting = getMeetingByUser(meeting.requestUser);

            if (!existingMeeting)
                return;

            setMeetingState(meeting.requestUser, 'confirmed');
        });
    }, [connection, connectionProgress]);

    return {
        meetings,
        requestMeeting,
        cancelMeeting
    }
}
