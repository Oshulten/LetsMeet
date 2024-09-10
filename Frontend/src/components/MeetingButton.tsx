/* eslint-disable react/react-in-jsx-scope */
import { UserIdentity } from "../types/types";
import { useUserContext } from "./UserContextProvider";
import useMeetings from "../hooks/useMeetings";

interface Props {
    otherUser: UserIdentity
}

export default function MeetingButton({ otherUser }: Props) {
    const { getMeetingByUser } = useUserContext();
    const { requestMeeting, cancelMeeting} = useMeetings(); 

    const meeting = getMeetingByUser(otherUser);

    if (!meeting)
        return (
            <button
                onClick={() => {
                    requestMeeting(otherUser);
                }}
                className="btn btn-info text-white font-normal w-full">
                {`Let's Meet!`}
            </button>)

    switch (meeting.state) {
        case 'awaitingOtherUserConfirmation':
            return (
                <button
                    onClick={() => {
                        requestMeeting(otherUser);
                    }}
                    className="btn btn-info text-white font-normal w-full">
                    Waiting for response
                    <span className="loading loading-spinner text-white"></span>
                </button>)

        case 'awaitingUserConfirmation':
            return (<>
                <p>{`${otherUser.username} wants to meet you!`}</p>
                <button 
                    onClick={() => {
                        requestMeeting(otherUser);
                    }}
                    className="btn btn-info text-white font-normal w-full">
                    {`Someone wants to meet you`}
                </button>)
                <button 
                    onClick={() => {
                        cancelMeeting(otherUser);
                    }}
                    className="btn btn-info text-white font-normal w-full" >
                    {`Not a good time...`}
                </button>
            </ >)
    }
}