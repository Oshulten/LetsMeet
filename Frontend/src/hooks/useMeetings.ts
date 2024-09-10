import { useEffect } from "react";
import { ActiveMeeting, UserIdentity, userIdentityFromUser } from '../types/types';
import { HubClient, HubServer } from "../api/hub";
import { useUserContext } from "../components/UserContextProvider";


export default function useMeetings() {
    const {
        user,
        meetings,
        getMeetingByUser,
        addMeeting,
        setMeetingState,
        removeMeeting,
        connection,
        connectionProgress
    } = useUserContext();

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
            addMeeting(newMeeting);

            await HubServer.requestMeeting(connection, {
                requestUser: userIdentity,
                targetUser: targetUser
            });

            return;
        }

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
