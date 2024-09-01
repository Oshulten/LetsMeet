/* eslint-disable react/react-in-jsx-scope */
import { APIProvider, Map } from '@vis.gl/react-google-maps';

export default function GoogleMap() {
    return (
        <>
            <APIProvider apiKey={'SECRET'}>
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