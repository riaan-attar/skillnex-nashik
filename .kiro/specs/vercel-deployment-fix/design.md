# Design Document: Vercel Deployment Configuration

## Overview

This design document outlines the technical changes required to migrate a TanStack Start + React application from Cloudflare Workers deployment to Vercel. The application currently uses `wrangler.jsonc` for Cloudflare Workers configuration and the `@cloudflare/vite-plugin` for building. This migration requires:

1. Removing Cloudflare-specific dependencies and configurations
2. Updating Vite build configuration for Node.js runtime compatibility
3. Configuring `vercel.json` for Vercel deployment
4. Setting up environment variables for Vercel
5. Ensuring the server entry point works with Vercel's Node.js runtime
6. Verifying Supabase integration continues to function

The application will maintain all existing functionality including SSR (Server-Side Rendering), Supabase authentication, and backend integration while deploying to Vercel instead of Cloudflare Workers.

---

## Architecture

### High-Level Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Vercel Platform                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Build Phase (npm run build)                         │  │
│  │  ├─ Vite compiles React components                  │  │
│  │  ├─ TanStack Start generates SSR bundle             │  │
│  │  ├─ Server entry point (src/server.ts) bundled      │  │
│  │  └─ Output: dist/ directory                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Runtime Phase (Node.js)                             │  │
│  │  ├─ Vercel loads dist/server bundle                 │  │
│  │  ├─ Server exports default fetch handler            │  │
│  │  ├─ Handles incoming HTTP requests                  │  │
│  │  └─ Returns rendered HTML or API responses          │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  External Services                                   │  │
│  │  ├─ Supabase (Auth & Database)                      │  │
│  │  └─ Other backend services                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Build Process Flow

```
Source Code (src/)
    ↓
Vite Build (vite.config.ts)
    ├─ Remove @cloudflare/vite-plugin
    ├─ Keep TanStack Start configuration
    ├─ Compile React components
    └─ Bundle server entry point
    ↓
Output (dist/)
    ├─ Client assets (JS, CSS, HTML)
    ├─ Server bundle (Node.js compatible)
    └─ Static assets
    ↓
Vercel Deployment (vercel.json)
    ├─ Read environment variables
    ├─ Start Node.js server
    └─ Handle incoming requests
```

### Deployment Configuration Flow

```
Git Repository
    ↓
Vercel Detects Push
    ↓
Read vercel.json
    ├─ buildCommand: npm run build
    ├─ outputDirectory: dist
    ├─ framework: vite
    └─ env: {...}
    ↓
Load Environment Variables
    ├─ VITE_SUPABASE_URL (build-time)
    ├─ VITE_SUPABASE_PUBLISHABLE_KEY (build-time)
    └─ SUPABASE_SERVICE_ROLE_KEY (runtime)
    ↓
Execute Build
    ├─ npm run build
    ├─ Vite compiles application
    └─ Output to dist/
    ↓
Deploy to Node.js Runtime
    ├─ Start server from dist/
    └─ Listen for requests
```

---

## Components and Interfaces

### 1. Configuration Files

#### vercel.json (Updated)
Vercel's deployment configuration file that tells the platform how to build and deploy the application.

**Purpose**: Define build command, output directory, framework, and environment variables for Vercel.

**Key Responsibilities**:
- Specify the build command (`npm run build`)
- Specify the output directory (`dist`)
- Declare the framework (`vite`)
- Map environment variables with Vercel secret references
- Configure runtime settings for Node.js

#### vite.config.ts (Updated)
Vite build configuration that defines how the application is compiled.

**Purpose**: Configure Vite and TanStack Start for Vercel deployment without Cloudflare-specific plugins.

**Key Responsibilities**:
- Remove `@cloudflare/vite-plugin` reference
- Maintain TanStack Start configuration
- Preserve server entry point configuration
- Ensure Node.js runtime compatibility

#### package.json (Updated)
Node.js package manifest with dependencies and build scripts.

**Purpose**: Define project dependencies and build scripts.

**Key Responsibilities**:
- Remove `@cloudflare/vite-plugin` dependency
- Maintain `vite build` script
- Keep all other dependencies intact

### 2. Server Entry Point

#### src/server.ts (Existing, Vercel-Compatible)
The main server file that handles incoming HTTP requests and renders the application.

**Purpose**: Provide a Node.js-compatible fetch handler for Vercel's runtime.

**Key Responsibilities**:
- Export a default object with a `fetch` method
- Accept `request`, `env`, and `ctx` parameters
- Handle SSR rendering via TanStack Start
- Catch and handle errors gracefully
- Return proper HTTP responses

**Interface**:
```typescript
export default {
  async fetch(request: Request, env: unknown, ctx: unknown): Promise<Response>
}
```

### 3. Build Output Structure

The `dist/` directory contains all compiled artifacts:

```
dist/
├── server/
│   └── [server bundle files]
├── client/
│   ├── [compiled React components]
│   ├── [CSS files]
│   └── [JavaScript bundles]
├── public/
│   └── [static assets]
└── [other build artifacts]
```

### 4. Environment Variable Mapping

**Build-Time Variables** (injected during `npm run build`):
- `VITE_SUPABASE_URL` → Client-side Supabase URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` → Client-side Supabase key

**Runtime Variables** (available in Node.js process):
- `SUPABASE_SERVICE_ROLE_KEY` → Server-side Supabase key
- `SUPABASE_URL` → Server-side Supabase URL (optional)

---

## Data Models

### Environment Variables Schema

```typescript
// Build-time (VITE_ prefix - injected into client bundle)
interface BuildTimeEnv {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_PUBLISHABLE_KEY: string;
}

// Runtime (available in Node.js process)
interface RuntimeEnv {
  SUPABASE_SERVICE_ROLE_KEY: string;
  SUPABASE_URL?: string;
  // Other runtime variables as needed
}

// Vercel Configuration
interface VercelConfig {
  buildCommand: string;
  outputDirectory: string;
  framework: string;
  env: Record<string, string>;
}
```

### Request/Response Cycle

```typescript
// Incoming Request
interface IncomingRequest {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: ReadableStream;
}

// Server Response
interface ServerResponse {
  status: number;
  headers: Record<string, string>;
  body: string | ReadableStream;
}

// Server Context
interface ServerContext {
  request: Request;
  env: Record<string, unknown>;
  ctx: unknown;
}
```

---

## Configuration Changes

### 1. vercel.json Configuration

**Current State**: Partially configured for Vercel

**Required Changes**:
- Ensure `buildCommand` is set to `npm run build`
- Ensure `outputDirectory` is set to `dist`
- Ensure `framework` is set to `vite`
- Add all required environment variables with Vercel secret references

**Updated vercel.json**:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "env": {
    "VITE_SUPABASE_URL": "@vite_supabase_url",
    "VITE_SUPABASE_PUBLISHABLE_KEY": "@vite_supabase_publishable_key",
    "SUPABASE_SERVICE_ROLE_KEY": "@supabase_service_role_key"
  }
}
```

**Explanation**:
- `@vite_supabase_url`: Vercel secret reference for Supabase URL (build-time)
- `@vite_supabase_publishable_key`: Vercel secret reference for Supabase publishable key (build-time)
- `@supabase_service_role_key`: Vercel secret reference for service role key (runtime)

### 2. vite.config.ts Configuration

**Current State**: References `@cloudflare/vite-plugin`

**Required Changes**:
- Remove Cloudflare-specific plugin configuration
- Keep TanStack Start configuration
- Maintain server entry point configuration

**Updated vite.config.ts**:
```typescript
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
});
```

**Explanation**:
- Removed the comment about `@cloudflare/vite-plugin`
- Kept the `tanstackStart` configuration with server entry point
- The `@lovable.dev/vite-tanstack-config` already includes all necessary plugins for Vercel (Vite React, Tailwind, etc.)

### 3. package.json Dependency Changes

**Current State**: Includes `@cloudflare/vite-plugin`

**Required Changes**:
- Remove `@cloudflare/vite-plugin` from dependencies

**Updated package.json** (dependencies section):
```json
{
  "dependencies": {
    // Remove: "@cloudflare/vite-plugin": "^1.25.5",
    "@hookform/resolvers": "^5.2.2",
    "@lovable.dev/cloud-auth-js": "^1.1.2",
    // ... rest of dependencies
  }
}
```

### 4. File Deletions

**Files to Delete**:
- `wrangler.jsonc` - Cloudflare Workers configuration (no longer needed)

**Reason**: This file is specific to Cloudflare Workers deployment and is not used by Vercel.

---

## Environment Variable Setup for Vercel

### Step 1: Identify Required Variables

From `.env.example` and current setup:

| Variable | Type | Purpose | Source |
|----------|------|---------|--------|
| `VITE_SUPABASE_URL` | Build-time | Client-side Supabase URL | Supabase project settings |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Build-time | Client-side Supabase key | Supabase project settings |
| `SUPABASE_SERVICE_ROLE_KEY` | Runtime | Server-side Supabase key | Supabase project settings |

### Step 2: Configure in Vercel

In Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add each variable with the corresponding value
3. Vercel will automatically inject them during build and runtime

### Step 3: Reference in vercel.json

The `env` section in `vercel.json` maps local variable names to Vercel secrets:

```json
{
  "env": {
    "VITE_SUPABASE_URL": "@vite_supabase_url",
    "VITE_SUPABASE_PUBLISHABLE_KEY": "@vite_supabase_publishable_key",
    "SUPABASE_SERVICE_ROLE_KEY": "@supabase_service_role_key"
  }
}
```

The `@` prefix tells Vercel to use a secret with that name.

---

## Build Process Details

### Build Command Execution

```bash
npm run build
```

This command:
1. Runs `vite build` (defined in package.json)
2. Vite reads `vite.config.ts`
3. Compiles React components and TanStack Start
4. Bundles server entry point for Node.js
5. Outputs to `dist/` directory

### Build Output Verification

After build completes, verify:
- `dist/` directory exists
- `dist/server/` contains server bundle
- `dist/client/` contains client assets
- Server bundle exports default fetch handler

### Environment Variable Injection

During build:
- Vite injects `VITE_*` prefixed variables into the client bundle
- These become part of the compiled JavaScript
- Non-VITE_ variables are NOT injected into the client bundle
- Server-side variables are available at runtime via `process.env`

---

## Server Entry Point Compatibility

### Current Implementation (src/server.ts)

The existing `src/server.ts` is already compatible with Vercel:

```typescript
export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return brandedErrorResponse();
    }
  },
};
```

**Why it works on Vercel**:
- Exports a default object with a `fetch` method
- Accepts `request`, `env`, and `ctx` parameters
- Returns a `Response` object
- Handles errors gracefully
- Compatible with Node.js runtime

### Request Handling Flow

1. Vercel receives HTTP request
2. Calls `fetch(request, env, ctx)`
3. Server loads TanStack Start entry point
4. Renders React components on server
5. Returns HTML response to client
6. Client hydrates with React

### Error Handling

The server includes error handling for:
- SSR errors (caught and rendered as branded error page)
- Catastrophic errors (h3 framework errors)
- Unhandled exceptions (logged and branded error page returned)

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: No Cloudflare References Remain

*For any* configuration file in the project (package.json, vite.config.ts, vercel.json), after removing Cloudflare dependencies, no references to "cloudflare" or "wrangler" should exist in the file content.

**Validates: Requirements 1.1, 1.2, 1.3, 1.4**

### Property 2: Build Output Contains Required Artifacts

*For any* build execution, the resulting `dist/` directory should contain a server bundle that exports a default object with a `fetch` method compatible with Node.js.

**Validates: Requirements 2.1, 2.2, 2.3, 6.1, 6.2**

### Property 3: Build Succeeds Without Cloudflare Plugin

*For any* build execution with the updated vite.config.ts (without @cloudflare/vite-plugin), the build should complete successfully and produce valid output in the `dist/` directory.

**Validates: Requirements 2.1, 2.4, 8.2, 8.4**

### Property 4: Server Entry Point Exports Valid Handler

*For any* server bundle in `dist/`, importing the default export should yield an object with an async `fetch` method that accepts `(request: Request, env: unknown, ctx: unknown)` and returns a `Promise<Response>`.

**Validates: Requirements 5.1, 5.2, 5.3**

### Property 5: Environment Variables Injected at Build Time

*For any* build execution with VITE_* environment variables set, the resulting client bundle should contain the injected values, and these values should be accessible to client-side code.

**Validates: Requirements 4.1, 4.2, 4.4**

### Property 6: Server-Side Variables Available at Runtime

*For any* server execution on Vercel, non-VITE_ environment variables (like SUPABASE_SERVICE_ROLE_KEY) should be accessible via `process.env` in the server runtime.

**Validates: Requirements 4.3, 4.5**

### Property 7: vercel.json Configuration Valid

*For any* vercel.json file, it should be valid JSON and contain all required fields: `buildCommand`, `outputDirectory`, `framework`, and `env` with all required environment variable mappings.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

### Property 8: Server Handles Requests and Returns Responses

*For any* HTTP request sent to the server, the server should return a valid HTTP response (with status code and headers) without crashing.

**Validates: Requirements 5.2, 5.4**

### Property 9: Supabase Client Initialization Succeeds

*For any* server execution with VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY set, the Supabase client should initialize successfully and be ready for authentication operations.

**Validates: Requirements 9.1, 9.2, 9.4**

### Property 10: Server-Side Supabase Operations Use Service Role Key

*For any* server-side operation that requires elevated privileges, the server should use SUPABASE_SERVICE_ROLE_KEY for authentication instead of the publishable key.

**Validates: Requirements 9.3**

---

## Error Handling

### Build-Time Errors

**Missing Dependencies**:
- Error: `Cannot find module '@cloudflare/vite-plugin'`
- Solution: Remove from package.json and run `npm install`

**Invalid vite.config.ts**:
- Error: Syntax errors in vite.config.ts
- Solution: Verify TypeScript syntax and imports

**Missing Environment Variables**:
- Error: Build fails because VITE_* variables are undefined
- Solution: Set environment variables in Vercel dashboard before deploying

### Runtime Errors

**Server Startup Failure**:
- Error: Server fails to start on Vercel
- Solution: Verify server bundle exports default fetch handler

**SSR Rendering Errors**:
- Error: React component throws during server-side rendering
- Solution: Server catches error and returns branded error page

**Supabase Connection Errors**:
- Error: Cannot connect to Supabase
- Solution: Verify SUPABASE_URL and credentials are correct

**Missing Runtime Variables**:
- Error: SUPABASE_SERVICE_ROLE_KEY is undefined
- Solution: Set in Vercel environment variables

### Error Recovery

The server includes error recovery mechanisms:
1. Try/catch blocks around SSR rendering
2. Branded error page for catastrophic errors
3. Graceful degradation when services are unavailable
4. Logging of errors for debugging

---

## Testing Strategy

### Unit Testing

Unit tests should verify specific examples and edge cases:

1. **Configuration Validation**
   - Verify vercel.json is valid JSON
   - Verify vite.config.ts exports valid config
   - Verify package.json has correct scripts

2. **Server Entry Point**
   - Verify server exports default fetch handler
   - Verify fetch handler accepts correct parameters
   - Verify error handling returns branded error page

3. **Environment Variables**
   - Verify VITE_* variables are injected into client bundle
   - Verify non-VITE_ variables are available at runtime
   - Verify missing variables are handled gracefully

4. **Build Output**
   - Verify dist/ directory structure is correct
   - Verify server bundle can be imported
   - Verify client assets are present

### Property-Based Testing

Property-based tests should verify universal properties across all inputs:

1. **Property 1: No Cloudflare References**
   - Test: Search all config files for "cloudflare" or "wrangler" strings
   - Expected: No matches found
   - Iterations: 1 (deterministic)

2. **Property 2: Build Output Artifacts**
   - Test: Run build and verify dist/ contains required files
   - Expected: Server bundle exists and exports fetch handler
   - Iterations: 100+

3. **Property 3: Build Success Without Cloudflare**
   - Test: Run build with updated vite.config.ts
   - Expected: Build completes successfully
   - Iterations: 100+

4. **Property 4: Server Handler Validity**
   - Test: Import server bundle and verify fetch method signature
   - Expected: Method accepts (request, env, ctx) and returns Promise<Response>
   - Iterations: 100+

5. **Property 5: Build-Time Variable Injection**
   - Test: Set VITE_* variables and verify they appear in client bundle
   - Expected: Variables are injected and accessible to client code
   - Iterations: 100+

6. **Property 6: Runtime Variable Access**
   - Test: Set non-VITE_ variables and verify they're accessible at runtime
   - Expected: Variables available via process.env
   - Iterations: 100+

7. **Property 7: vercel.json Validity**
   - Test: Parse vercel.json and verify all required fields
   - Expected: Valid JSON with all required configuration
   - Iterations: 1 (deterministic)

8. **Property 8: Request/Response Handling**
   - Test: Send various HTTP requests to server
   - Expected: Server returns valid responses without crashing
   - Iterations: 100+

9. **Property 9: Supabase Initialization**
   - Test: Initialize Supabase client with configured credentials
   - Expected: Client initializes successfully
   - Iterations: 100+

10. **Property 10: Service Role Key Usage**
    - Test: Verify server uses service role key for privileged operations
    - Expected: Service role key is used instead of publishable key
    - Iterations: 100+

### Testing Configuration

- **Minimum iterations**: 100 per property test
- **Test framework**: Use language-appropriate PBT library (e.g., fast-check for JavaScript)
- **Tag format**: `Feature: vercel-deployment-fix, Property {number}: {property_text}`
- **Coverage**: Each correctness property should have exactly one property-based test

---

## Deployment Process Overview

### Pre-Deployment Checklist

1. ✓ Remove `@cloudflare/vite-plugin` from package.json
2. ✓ Delete `wrangler.jsonc`
3. ✓ Update `vite.config.ts` to remove Cloudflare references
4. ✓ Verify `vercel.json` has correct configuration
5. ✓ Run `npm install` to update dependencies
6. ✓ Run `npm run build` locally to verify build succeeds
7. ✓ Verify `dist/` directory structure is correct

### Vercel Deployment Steps

1. **Connect Repository**
   - Push changes to Git repository
   - Connect repository to Vercel project

2. **Configure Environment Variables**
   - Go to Vercel Project Settings → Environment Variables
   - Add `VITE_SUPABASE_URL` with Supabase URL
   - Add `VITE_SUPABASE_PUBLISHABLE_KEY` with publishable key
   - Add `SUPABASE_SERVICE_ROLE_KEY` with service role key

3. **Trigger Deployment**
   - Vercel automatically detects push
   - Reads `vercel.json` configuration
   - Executes `npm run build`
   - Deploys to Node.js runtime

4. **Verify Deployment**
   - Check Vercel deployment logs
   - Verify application loads in browser
   - Test Supabase authentication
   - Test backend API calls

### Post-Deployment Verification

1. **Application Loads**
   - Navigate to deployed URL
   - Verify page renders without errors

2. **Supabase Integration**
   - Test user authentication
   - Verify database queries work
   - Check API endpoints

3. **Error Handling**
   - Trigger an error to verify error page displays
   - Check server logs for error messages

4. **Performance**
   - Monitor build time
   - Check runtime performance
   - Verify no memory issues

---

## Summary of Changes

| Component | Current | Updated | Reason |
|-----------|---------|---------|--------|
| `package.json` | Includes `@cloudflare/vite-plugin` | Remove dependency | Not needed for Vercel |
| `vite.config.ts` | References Cloudflare plugin | Remove references | Vercel uses Node.js runtime |
| `vercel.json` | Partial configuration | Complete configuration | Ensure all settings correct |
| `wrangler.jsonc` | Exists | Delete | Cloudflare-specific, not needed |
| `src/server.ts` | Existing | No changes | Already Vercel-compatible |
| Environment variables | Local .env | Vercel dashboard | Vercel manages secrets |

---

## Next Steps

1. **Implementation Phase**: Execute configuration changes and file deletions
2. **Testing Phase**: Run property-based tests to verify correctness
3. **Deployment Phase**: Deploy to Vercel and verify functionality
4. **Documentation Phase**: Create deployment guide for team
