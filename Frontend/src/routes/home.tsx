/* eslint-disable react/react-in-jsx-scope */
import { createFileRoute } from '@tanstack/react-router'
import ClientMap from '../components/ClientMap'
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react';
import { APIProvider } from '@vis.gl/react-google-maps';
import Header from '../components/Header';
import WelcomePage from '../components/WelcomePage';
import { dark } from '@clerk/themes'

export const Route = createFileRoute('/home')({
  component: Home
})

export default function Home() {
  return (
    <>
      <ClerkProvider appearance={{
        baseTheme: dark
      }} publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY} afterSignOutUrl="/">
        <SignedIn>
          <div className="w-full h-screen flex flex-col items-center justify-center">
            <Header />
            <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
              <ClientMap />
            </APIProvider>
          </div>
        </SignedIn>
        <SignedOut>
          <WelcomePage />
        </SignedOut>
      </ClerkProvider >
    </>
  );
}