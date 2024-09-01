import { paths } from './schema';
import createClient from "openapi-fetch";

const client = createClient<paths>({ baseUrl: 'http://localhost:5055' });


