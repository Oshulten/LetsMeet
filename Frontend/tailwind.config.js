import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            backgroundImage: {
                "splash-image": "url('/public/LetsMeet.jpg')",
            },
        },
    },
    plugins: [daisyui],
};
