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

    const messageQuery = useQuery({
        queryKey: queryKey,
        queryFn: (): ActiveMeeting[] => {
            return [];
        },
    });

    useQuery({
        queryKey: [...queryKey, "registerCallbacks"],
        queryFn: (): boolean => {
            if (!connection) return false;
            HubClient.registerReceiveMeetingRequest(connection, receiveMeetingRequest);
            HubClient.registerReceiveMeetingCancellation(connection, receiveMeetingCancellation);
            HubClient.registerReceiveMeetingConfirmation(connection, receiveMeetingConfirmation);
            return true;
        },
        enabled: (!!connection && !!clientUser)
    });

    const initMessagesWithEmptyIfUndefined = () => {
        const meetings = messageQuery.data;
        if (!meetings) {
            queryClient.setQueryData(queryKey, []);
        }
        return queryClient.getQueryData(queryKey) as ActiveMeeting[];
    }

    const addMeeting = (meeting: ActiveMeeting) => {
        const meetings = initMessagesWithEmptyIfUndefined();
        console.log(meetings);
        if (!meetings) return;

        console.log('Adding meeting');
        console.log(meeting);
        queryClient.setQueryData(queryKey, [...meetings, meeting]);
    }

    const removeMeeting = (user: UserIdentity): void => {
        const meetings = initMessagesWithEmptyIfUndefined();
        if (!meetings) return;

        queryClient.setQueryData(queryKey, [...meetings].filter(m => m.user.id != user.id));
    }

    const getMeetingByUser = (user: UserIdentity): ActiveMeeting | undefined => {
        const meetings = initMessagesWithEmptyIfUndefined();
        if (!meetings) return;

        return meetings.find(meeting => meeting.user.id == user.id);
    }

    const confirmMeeting = async (meeting: ActiveMeeting) => {
        if (!connection || !clientUser) return;

        console.log("confirm meeting");
        
        //TODO: pass a callback function into here somehow and get some process going in ClientMap

        await HubServer.confirmMeeting(connection, {
            requestUser: userIdentityFromUser(clientUser),
            targetUser: meeting.user
        });
    }

    const setMeetingState = (user: UserIdentity, state: MeetingState): ActiveMeeting | undefined => {
        const meetings = initMessagesWithEmptyIfUndefined();
        if (!meetings) return;

        const meeting = getMeetingByUser(user);
        if (!meeting) return;

        const newMeeting = { ...meeting, state: state };

        const newMeetings = meetings.map(meeting =>
            meeting.user.id == user.id ? newMeeting : meeting);

        queryClient.setQueryData(queryKey, [newMeetings]);
    }

    const cancelMeeting = async (targetUser: UserIdentity) => {
        if (!connection || !clientUser) return;

        console.log(`You cancel a meeting with ${targetUser.username}`);

        removeMeeting(targetUser);

        await HubServer.cancelMeeting(connection, {
            requestUser: userIdentityFromUser(clientUser),
            targetUser: targetUser
        });
    }

    const requestMeeting = async (targetUser: UserIdentity) => {
        if (!connection || !clientUser) return;

        console.debug(`You request a meeting with ${targetUser.username}`);

        const existingMeeting = getMeetingByUser(targetUser);

        if (!existingMeeting) {
            const newMeeting: ActiveMeeting = {
                user: targetUser,
                state: 'awaitingOtherUserConfirmation'
            }

            addMeeting(newMeeting);

            const meetingRequest: Meeting = {
                requestUser: userIdentityFromUser(clientUser),
                targetUser: targetUser
            }

            await HubServer.requestMeeting(connection, meetingRequest);

            return;
        }

        if (existingMeeting.state == 'awaitingUserConfirmation') {
            await confirmMeeting(existingMeeting);
            return;
        }
    }

    const receiveMeetingRequest = (meeting: Meeting) => {
        console.log(`${meeting.requestUser.username} wants a meeting with you`);

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
    }

    const receiveMeetingCancellation = (meeting: Meeting) => {
        console.log(`${meeting.requestUser.username} cancelled a meeting with you`);

        const existingMeeting = getMeetingByUser(meeting.requestUser);

        if (!existingMeeting)
            return;

        removeMeeting(meeting.requestUser);
    }

    const receiveMeetingConfirmation = (meeting: Meeting) => {
        console.debug(`Meeting confirmed between ${meeting.requestUser.username} and ${meeting.targetUser.username}`);
        console.log(meeting);
    }

    return {
        meetings: messageQuery.data,
        getMeetingByUser,
        requestMeeting,
        cancelMeeting,
    }
}
