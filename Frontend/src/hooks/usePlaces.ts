import { UserLocation } from "../types/types";
import { mean, max } from 'mathjs/number'
import haversine from 'haversine-distance';
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function usePlaces() {
    const queryClient = useQueryClient();
    const queryKey = ["places"];
    const queryKeyLibrary = [...queryKey, "library"];

    useQuery({
        queryKey: queryKeyLibrary,
        queryFn: async (): Promise<google.maps.PlacesLibrary> => {
            console.log("load places library");
            return await google.maps.importLibrary("places") as google.maps.PlacesLibrary;;
        },
    });

    const placesQuery = useQuery({
        queryKey: queryKey,
        queryFn: async (): Promise<google.maps.places.Place[]> => {
            return [];
        },
    });

    const suggestMeetingPlacesTest = async () => {
        console.log("suggestMeetingPlacesTest");

        const library = queryClient.getQueryData(queryKeyLibrary) as google.maps.PlacesLibrary;

        if (!library) {
            console.log("Library is not loaded");
            return;
        }

        console.log("Library is loaded");
        console.log(library);

        const location1: google.maps.LatLngLiteral = {
            lat: parseFloat(import.meta.env.VITE_DEFAULT_LOCATION_LAT),
            lng: parseFloat(import.meta.env.VITE_DEFAULT_LOCATION_LNG)
        }

        const location2: google.maps.LatLngLiteral = {
            lat: parseFloat(import.meta.env.VITE_DEFAULT_LOCATION_LAT) + 0.1,
            lng: parseFloat(import.meta.env.VITE_DEFAULT_LOCATION_LNG) + 0.1
        }

        console.log(location1);
        console.log(location2);

        const userLocations = [location1, location2];

        const meanLocation: google.maps.LatLngLiteral = {
            lat: mean(userLocations.map(location => location.lat)),
            lng: mean(userLocations.map(location => location.lng)),
        };

        const maxDistanceFromMeanLocation = max(userLocations.map(location =>
            haversine(location, meanLocation)
        ));

        console.log(meanLocation);

        const request = {
            // required parameters
            fields: ['displayName', 'location', 'id'],
            locationRestriction: {
                center: meanLocation,
                radius: maxDistanceFromMeanLocation + 50,
            },
            // optional parameters
            // includedPrimaryTypes: ['restaurant'],
            maxResultCount: 1,
            rankPreference: 'DISTANCE',
            // language: 'en-US',
            // region: 'us',
        } as google.maps.places.SearchNearbyRequest;

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

    const suggestMeetingPlaces = async (userLocations: UserLocation[]) => {
        console.log("suggestMeetingPlaces");
        const library = queryClient.getQueryData(queryKeyLibrary) as google.maps.PlacesLibrary;

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
        suggestMeetingPlacesTest,
        places: placesQuery.data
    }
}