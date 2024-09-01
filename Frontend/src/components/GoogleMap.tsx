/* eslint-disable react/react-in-jsx-scope */
import { useQuery } from '@tanstack/react-query';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { getGoogleMapsApiKey } from '../api/endpoints';

export default function GoogleMap() {
    const { data, status } = useQuery({
        queryKey: ["googleApiKey"],
        queryFn: getGoogleMapsApiKey
    });

    switch (status) {
        case "pending":
            return <p>Fetching Google Maps api key...</p>
        case "error":
            return <p>Google Maps api key could not be fetched</p>
        case "success":
            if (data) {
                console.log(data);
                return (
                    <>
                        <APIProvider apiKey={data}>
                            <Map
                                style={{ width: '100vw', height: '100vh' }}
                                defaultCenter={{ lat: 22.54992, lng: 0 }}
                                defaultZoom={3}
                                gestureHandling={'greedy'}
                                disableDefaultUI={true}
                            />
                        </APIProvider>
                    </>
                );
            }
    }
}