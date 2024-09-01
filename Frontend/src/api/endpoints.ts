import { paths } from './schema';
import createClient from "openapi-fetch";

const client = createClient<paths>({ baseUrl: 'http://localhost:5055' });

export const getGoogleMapsApiKey = async () => {
    const {
        data,
        error,
    } = await client.GET("/api/Secrets/google-maps-api-key", {});

    if (error) throw error;

    return data.key as string;
}
