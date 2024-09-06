import { paths } from './schema';
import createClient from "openapi-fetch";
import { DtoUser } from './types';

const client = createClient<paths>({ baseUrl: 'http://localhost:5055' });

export const ensureUserExists = async (dtoUser: DtoUser) => {
    await client.POST("/api/Authorization/ensure-created", { body: dtoUser })
}
