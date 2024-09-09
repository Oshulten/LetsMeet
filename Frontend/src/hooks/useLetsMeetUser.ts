import { useUser } from "@clerk/clerk-react";
import { User } from "../types/types";

export default function useUserFromClerk() {
    const clerkUser = useUser().user!;
    return { clerkId: clerkUser.id, username: clerkUser.username } as User;
}