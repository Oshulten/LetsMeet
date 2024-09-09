import { useEffect, useState } from "react";
import { User } from "../types/types";
import { mean, max } from 'mathjs/number'
import haversine from 'haversine-distance';

export default function usePlaces() {
    const [library, setLibrary] = useState<google.maps.PlacesLibrary>();

    useEffect(() => {
        const loadLibraries = async () => {
            const placesLibrary = await google.maps.importLibrary("places") as google.maps.PlacesLibrary;
            setLibrary(placesLibrary);
        }

        if (!library) {
            loadLibraries();
            console.log("loading libraries");
        }
    });

    const suggestMeetingPlaces = async (users: User[]) => {
        if (!library) return;

        const meanLocation: google.maps.LatLngLiteral = {
            lat: mean(users.map(user => user.location.lat)),
            lng: mean(users.map(user => user.location.lng)),
        };


        const maxDistanceFromMeanLocation = max(users.map(user =>
            haversine(user.location, meanLocation)
        ));

        const request = {
            // required parameters
            fields: ['displayName', 'location', 'id'],
            locationRestriction: {
                center: meanLocation,
                radius: maxDistanceFromMeanLocation + 50,
            },
            // optional parameters
            // includedPrimaryTypes: ['restaurant'],
            maxResultCount: 5,
            rankPreference: 'DISTANCE',
            // language: 'en-US',
            // region: 'us',
        } as google.maps.places.SearchNearbyRequest;

        const { places } = await library.Place.searchNearby(request);

        console.log(places);
    }

    return {
        suggestMeetingPlaces
    }
}