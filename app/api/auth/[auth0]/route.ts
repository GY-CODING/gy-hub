import { auth0 } from "@/app/lib/auth0";

// En Auth0 v4, el middleware maneja todas las rutas automáticamente
export const GET = auth0.middleware;
export const POST = auth0.middleware;
