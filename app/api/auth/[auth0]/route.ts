import { auth0 } from '@/lib/auth0';

console.log('🔧 [route.ts] Auth0 Route Handler Loaded');
console.log('🔧 [route.ts] auth0 instance:', auth0 ? '✅ EXISTS' : '❌ NULL');
console.log('🔧 [route.ts] middleware function:', typeof auth0?.middleware);
console.log('🔧 [route.ts] Available methods:', Object.keys(auth0 || {}));

// En Auth0 v4, el middleware maneja todas las rutas automáticamente
export const GET = auth0.middleware;
export const POST = auth0.middleware;

console.log('🔧 [route.ts] GET handler:', GET ? '✅ EXPORTED' : '❌ FAILED');
console.log('🔧 [route.ts] POST handler:', POST ? '✅ EXPORTED' : '❌ FAILED');
