/* eslint-disable react/react-in-jsx-scope */
import { createFileRoute } from '@tanstack/react-router'
import GoogleMap from '../components/GoogleMap'
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { UserContextProvider } from '../components/UserContextProvider';

export const Route = createFileRoute('/home')({
  component: Home
})

export default function Home() {
  return (
    <>
      <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY} afterSignOutUrl="/">
        <div className="w-full h-screen flex flex-col items-center justify-center">
          <SignedIn>
            <UserButton />
            <UserContextProvider>
              <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                <GoogleMap />
              </APIProvider>
            </UserContextProvider>
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </div>
      </ClerkProvider >
    </>
  );
}