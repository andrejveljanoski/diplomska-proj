# Runtime Environment Variables Injection for AWS Amplify

This solution captures environment variables during the build phase and injects them into the Next.js runtime.

## How It Works

1. **During Build** (`scripts/capture-env.js`):
   - Captures all required environment variables from `process.env`
   - Generates `env-runtime.js` - a JavaScript module containing the env vars
   
2. **At Runtime** (`next.config.ts`):
   - Requires `env-runtime.js` when Next.js starts
   - Injects variables into `process.env` before the app initializes
   - Available to all API routes and server-side code

3. **Build Process** (`amplify.yml`):
   - Runs `capture-env.js` after `pnpm install` but before `pnpm build`
   - Ensures `env-runtime.js` is created and included in the build artifacts

## Files Modified

- [`scripts/capture-env.js`](scripts/capture-env.js) - Captures env vars to JS module
- [`next.config.ts`](next.config.ts#L3-L7) - Loads runtime env vars
- [`amplify.yml`](amplify.yml) - Updated build commands

## Environment Variables Captured

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `AUTH_SECRET`
- `AUTH_TRUST_HOST`
- `R2_ENDPOINT`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_NAME`
- `R2_PUBLIC_URL`
- `NODE_ENV`

## Testing

After deployment, check the `/api/debug` endpoint to verify environment variables are loaded.

## Benefits

✅ No AWS secrets limit (works with any number of env vars)  
✅ Variables available at runtime for SSR and API routes  
✅ Simple implementation - no external dependencies  
✅ Works with Amplify's build system  
✅ Generated file is included in build artifacts automatically
