import { SignInButton } from "@clerk/clerk-react";

/* eslint-disable react/react-in-jsx-scope */
export default function WelcomePage() {
    return (
        <div
            className="hero min-h-screen"
            style={{
                backgroundImage: "url(https://www.ppchero.com/wp-content/uploads/2024/07/kelvinnewman_an_editorial_illustration_of_san_diego_skyline._Th_407a8e3c-9745-48f6-9862-86ef23e50fd1.png)",
            }}>
            <div className="hero-overlay bg-opacity-60"></div>
            <div className="hero-content text-neutral-content text-center">
                <div className="max-w-md">
                    <p className="mb-5">
                        Talk to strangers. No strings attached.
                    </p>
                    <h1 className="mb-5 text-5xl font-bold">{"Let's Meet"}</h1>
                    <SignInButton mode="modal" >
                        <button className="btn btn-primary">Sign In</button>
                    </SignInButton>
                </div>
            </div>
        </div>
    );
}