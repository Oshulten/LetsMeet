/* eslint-disable react/react-in-jsx-scope */
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query';
import GoogleMap from '../components/GoogleMap'
import getPosition from '../utilities/getPosition';

export const Route = createFileRoute('/home')({
  component: Home
})

export default function Home() {
  const geolocationQuery = useQuery({ queryKey: ["geolocation"], queryFn: () => getPosition() });

  if (geolocationQuery.data) {
    const location: google.maps.LatLngLiteral = {
      lat: geolocationQuery.data.coords.latitude,
      lng: geolocationQuery.data.coords.longitude
    }

    return (
      <>
        <GoogleMap defaultLocation={location}/>
      </>
    );
  }

}