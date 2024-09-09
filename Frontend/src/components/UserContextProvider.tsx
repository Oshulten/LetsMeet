/* eslint-disable react/react-in-jsx-scope */
import { createContext, useContext, useEffect, useState } from "react";
import { User } from "../types/types";
import { useUser } from "@clerk/clerk-react";

const defaultLocation: google.maps.LatLngLiteral = {
    lat: import.meta.env.VITE_DEFAULT_LOCATION_LAT,
    lng: import.meta.env.VITE_DEFAULT_LOCATION_LNG
}

interface UserContext {
    user: User
    setLocation: (newLocation: google.maps.LatLngLiteral) => void
}

export const UserContext = createContext<UserContext>({
    user: { username: "null", clerkId: "null", location: defaultLocation },
    setLocation: () => { }
});

interface Props {
    children?: React.ReactNode
}

export function UserContextProvider({ children }: Props) {
    const clerkUser = useUser().user!;
    
    const [user, setUser] = useState<User>({
        username: clerkUser.username!,
        clerkId: clerkUser.id,
        location: defaultLocation
    });

    const [location, setLocation] = useState<google.maps.LatLngLiteral>(defaultLocation);

    useEffect(() => {
        setUser({
            clerkId: clerkUser.id,
            username: clerkUser.username,
            location
        } as User)
    }, []);

    return (
        <UserContext.Provider
            value={{
                user: user!,
                setLocation,
            }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUserContext() {
    return useContext(UserContext);
}