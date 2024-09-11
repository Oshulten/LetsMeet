import { UserLocation } from "../types/types";
import { mean, max } from 'mathjs/number'
import haversine from 'haversine-distance';
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function usePlaces() {
    const queryClient = useQueryClient();
    const queryKey = ["placesLibrary"];

    const libraryQuery = useQuery({
        queryKey: queryKey,
        queryFn: async (): Promise<google.maps.PlacesLibrary> => {
            console.log("load places library");
            return await google.maps.importLibrary("places") as google.maps.PlacesLibrary;;
        },
    });

    const suggestMeetingPlaces = async (userLocations: UserLocation[]) => {
        const library = queryClient.getQueryData(queryKey);
        if (!library) {
            console.log("Library is not loaded");
            return;
        }

        const meanLocation: google.maps.LatLngLiteral = {
            lat: mean(userLocations.map(user => user.location.lat)),
            lng: mean(userLocations.map(user => user.location.lng)),
        };


        const maxDistanceFromMeanLocation = max(userLocations.map(user =>
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
        return places;
    }

    return {
        suggestMeetingPlaces
    }
}