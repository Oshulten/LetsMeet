import { SignOutButton, UserButton } from "@clerk/clerk-react";
import useClientUser from "../hooks/useClientUser";
import capitalize from 'capitalize';

/* eslint-disable react/react-in-jsx-scope */

export default function Header() {
    const { clientUser } = useClientUser();

    const username = clientUser ? capitalize.words(clientUser.username) : 'strange person';

    return (
        <div className="bg-slate-600 w-full flex flex-row p-4 items-center justify-center gap-y-4 gap-x-8">
            <SignOutButton>
                <button className="btn">Sign out</button>
            </SignOutButton>
            <p className="text-lg ml-auto">{`${username}`}</p>
            <UserButton />
        </div>
    );
}