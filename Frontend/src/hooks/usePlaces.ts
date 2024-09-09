import { useEffect, useState } from "react";
import { User } from "../types/types";

export default function usePlaces() {
    const [library, setLibrary] = useState<google.maps.PlacesLibrary>();

    useEffect(() => {
        const loadLibraries = async () => {
            const placesLibrary = await google.maps.importLibrary("places") as google.maps.PlacesLibrary;
            setLibrary(placesLibrary);
        }

        if (!library) {
            loadLibraries();
        }
    });

    const suggestMeetingPlaces = async (users: User[]) => {
    }

    return {
        suggestMeetingPlaces
    }
}