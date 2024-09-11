import { UserLocation } from "../types/types";
import { mean, max } from 'mathjs/number'
import haversine from 'haversine-distance';
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function usePlaces() {
    const queryClient = useQueryClient();
    const queryKey = ["places"];

    useQuery({
        queryKey: [...queryKey, "library"],
        queryFn: async (): Promise<google.maps.PlacesLibrary> => {
            console.log("load places library");
            console.log(google.maps.importLibrary)
            const x = await google.maps.importLibrary("places");
            console.log(x);
            return await google.maps.importLibrary("places") as google.maps.PlacesLibrary;;
        },
    });

    const placesQuery = useQuery({
        queryKey: queryKey,
        queryFn: async (): Promise<google.maps.places.Place[]> => {
            return [];
        },
    });

    const suggestMeetingPlaces = async (userLocations: UserLocation[]) => {
        console.log("suggestMeetingPlaces");
        const library = queryClient.getQueryData(queryKey) as google.maps.PlacesLibrary;

        if (!library) {
            console.log("Library is not loaded");
            return;
        }

        console.log("Library is loaded");
        console.log(library);

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

        console.log("getting places");

        try {
            const { places } = await library.Place.searchNearby(request);

            console.log("got places");

            console.log(places);
            queryClient.setQueryData(queryKey, places);
            console.log(placesQuery.data);

            console.log("end of suggest places");
        } catch (error) {
            console.error((error as Error).message);
        }
    }

    return {
        suggestMeetingPlaces,
        places: placesQuery.data
    }
}