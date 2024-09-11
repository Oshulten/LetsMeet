import { useQuery } from "@tanstack/react-query";
import useClientUser from "./useClientUser";
import useConnection from "./useConnection";
import { ActiveMeeting, Meeting, MeetingState, UserIdentity, userIdentityFromUser } from "../types/types";
import { queryClient } from "../main";
import { HubClient, HubServer } from "../api/hub";

export default function useMeetings() {
    const { clientUser } = useClientUser();
    const connection = useConnection();

    const queryKey = ["meetings"];

    const registerCallbacks = () => {
        if (!connection) return;

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
    }

    const confirmMeeting = async (meeting: ActiveMeeting) => {
        if (!connection || !clientUser) return;

        const userIdentity = userIdentityFromUser(clientUser);
        await HubServer.confirmMeeting(connection, {
            requestUser: userIdentity,
            targetUser: meeting.user
        });
    }

    const requestMeeting = async (targetUser: UserIdentity) => {
        if (!connection || !clientUser) return;
        const userIdentity = userIdentityFromUser(clientUser);
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
        if (!connection || !clientUser) return;
        const userIdentity = userIdentityFromUser(clientUser);

        console.log(`You cancel a meeting with ${targetUser.username}`);

        removeMeeting(targetUser);

        await HubServer.cancelMeeting(connection, {
            requestUser: userIdentity,
            targetUser: targetUser
        });
    }

    const meetingsQuery = useQuery({
        queryKey: [queryKey],
        queryFn: async (): Promise<ActiveMeeting[]> => {
            registerCallbacks();
            return [];
        },
        enabled: (!!connection && !!clientUser)
    });

    const getMeetingByUser = (user: UserIdentity): ActiveMeeting | undefined => {
        const meetings = queryClient.getQueryData(queryKey) as ActiveMeeting[];
        return meetings.find(m => m.user.id == user.id);
    }

    const addMeeting = (meeting: ActiveMeeting) => {
        const meetings = queryClient.getQueryData(queryKey) as ActiveMeeting[];
        queryClient.setQueryData(queryKey, [...meetings, meeting]);
    }

    const setMeetingState = (user: UserIdentity, state: MeetingState): ActiveMeeting | undefined => {
        const meeting = getMeetingByUser(user);
        if (!meeting) return;

        const newMeeting = { ...meeting, state: state };

        const meetings = queryClient.getQueryData(queryKey) as ActiveMeeting[];

        const newMeetings = meetings.map(m =>
            m.user.id == user.id ? newMeeting : m);

        queryClient.setQueryData(queryKey, [newMeetings]);
    }

    const removeMeeting = (user: UserIdentity): void => {
        const meetings = queryClient.getQueryData(queryKey) as ActiveMeeting[];
        const meetingsWithoutMeeting = meetings.filter(m => m.user.id == user.id);
        queryClient.setQueryData(queryKey, [meetingsWithoutMeeting]);
    }

    return {
        meetings: meetingsQuery.data,
        getMeetingByUser,
        requestMeeting,
        cancelMeeting,
    }
}
