import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function useDirections() {
    const queryClient = useQueryClient();
    const queryKey = ["directions"];
    const queryKeyLibrary = [...queryKey, "library"];

    const routeQuery = useQuery({
        queryKey: queryKeyLibrary,
        queryFn: async (): Promise<google.maps.DirectionsService> => {
            console.log("load directions library");
            const { DirectionsService } = await google.maps.importLibrary("routes") as google.maps.RoutesLibrary;
            return DirectionsService.prototype;
        },
    });

    const directionQuery = useQuery({
        queryKey: queryKey,
        queryFn: async (): Promise<google.maps.DirectionsResult[]> => {
            return [];
        },
    });

    const suggestRoute = async (origin: google.maps.LatLngLiteral, destination: google.maps.LatLngLiteral) => {
        const route = routeQuery.data;

        if (!route) {
            return;
        }

        console.log(route);

        const request: google.maps.DirectionsRequest = {
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode.WALKING
        }

        const directionsResult = await route.route(request);

        queryClient.setQueryData(queryKey, [directionsResult]);

        return directionQuery.data ? directionQuery.data[0] : undefined;
    }

    const renderRoute = async (map: google.maps.Map, directionsResult: google.maps.DirectionsResult) => {
        const directionsRenderer = new google.maps.DirectionsRenderer();
        directionsRenderer.setMap(map);
        directionsRenderer.setDirections(directionsResult);
    }

    const suggestAndRenderRoute = async (origin: google.maps.LatLngLiteral, destination: google.maps.LatLngLiteral, map: google.maps.Map) => {
        const directionsResult = await suggestRoute(origin, destination);

        if (!directionsResult) {
            return;
        }

        await renderRoute(map, directionsResult);
    }

    return {
        suggestRoute,
        route: directionQuery.data ? directionQuery.data[0] : undefined,
        renderRoute,
        suggestAndRenderRoute,
    }

}