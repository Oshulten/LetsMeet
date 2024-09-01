/* eslint-disable react/react-in-jsx-scope */
import { useQuery } from '@tanstack/react-query';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { getGoogleMapsApiKey } from '../api/endpoints';
import getPosition from '../utilities/getPosition';

export default function GoogleMap() {
    const apiKeyQuery = useQuery({ queryKey: ["googleApiKey"], queryFn: getGoogleMapsApiKey });
    const geolocationQuery = useQuery({ queryKey: ["geolocation"], queryFn: () => getPosition() });

    switch (apiKeyQuery.status) {
        case "pending":
            return <p>Fetching Google Maps api key...</p>
        case "error":
            return <p>Google Maps api key could not be fetched</p>
        case "success":
            if (apiKeyQuery.data) {
                if (!geolocationQuery.data?.coords) {
                    return <span className="loading loading-ring loading-lg"></span>
                }

                const { latitude: lat, longitude: lng } = geolocationQuery.data.coords;
                console.log(geolocationQuery.data.coords);
                return (
                    <>
                        <APIProvider apiKey={apiKeyQuery.data}>
                            <Map
                                style={{ width: '100vw', height: '100vh' }}
                                defaultCenter={{ lat: lat, lng: lng }}
                                defaultZoom={15}
                                gestureHandling={'greedy'}
                                disableDefaultUI={true}
                            />
                        </APIProvider>
                    </>
                );
            }
    }
}