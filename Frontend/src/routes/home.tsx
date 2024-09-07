/* eslint-disable react/react-in-jsx-scope */
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query';
import GoogleMap from '../components/GoogleMap'
import getPosition from '../utilities/getPosition';
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

export const Route = createFileRoute('/home')({
  component: Home
})

export default function Home() {
  const geolocationQuery = useQuery({ queryKey: ["geolocation"], queryFn: () => getPosition() });

  return (
    <>
      <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY} afterSignOutUrl="/">
        <SignedIn>
          <UserButton />
          {geolocationQuery.data &&
            <GoogleMap defaultLocation={{
              lat: geolocationQuery.data.coords.latitude,
              lng: geolocationQuery.data.coords.longitude
            }} />
          }
        </SignedIn>
        <SignedOut>
          <SignInButton />
        </SignedOut>
      </ClerkProvider>
    </>
  );
}