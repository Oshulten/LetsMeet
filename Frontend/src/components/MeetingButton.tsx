/* eslint-disable react/react-in-jsx-scope */
import { useState } from "react";
import { MeetingState, UserIdentity } from "../types/types";

interface Props {
    state?: MeetingState,
    handleRequestMeeting: () => Promise<void>,
    handleCancelMeeting: () => Promise<void>,
    otherUser: UserIdentity
}

export default function MeetingButton({ state, handleRequestMeeting, handleCancelMeeting, otherUser }: Props) {
    const [meetButtonState, setMeetButtonState] = useState<MeetingState>(state ?? 'neutral');

    switch (meetButtonState) {
        case 'neutral':
            return (
                <button
                    onClick={() => {
                        setMeetButtonState('awaitingOtherUserConfirmation');
                        handleRequestMeeting();
                    }}
                    className="btn btn-info text-white font-normal w-full">
                    {`Let's Meet!`}
                </button>)

        case 'awaitingOtherUserConfirmation':
            return (
                <button
                    onClick={() => {
                        setMeetButtonState('neutral');
                        handleCancelMeeting();
                    }}
                    className="btn btn-info text-white font-normal w-full">
                    Waiting for response
                    <span className="loading loading-spinner text-white"></span>
                </button>)

        case 'awaitingUserConfirmation':
            return (<>
                <p>{`${otherUser.username} wants to meet you!`}</p>
                <button className="btn btn-info text-white font-normal w-full">
                    {`Let's meet!`}
                </button>)
                <button className="btn btn-info text-white font-normal w-full" >
                    {`Not a good time...`}
                </button>
            </ >)
    }
}