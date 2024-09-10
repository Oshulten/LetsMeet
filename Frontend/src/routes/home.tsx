/* eslint-disable react/react-in-jsx-scope */
import { createFileRoute } from '@tanstack/react-router'
import ClientMap from '../components/ClientMap'
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { ClientContextProvider } from '../components/ClientContextProvider';

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
            <ClientContextProvider>
              <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                <ClientMap />
              </APIProvider>
            </ClientContextProvider>
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </div>
      </ClerkProvider >
    </>
  );
}