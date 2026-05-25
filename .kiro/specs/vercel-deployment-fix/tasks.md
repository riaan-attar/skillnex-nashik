# Implementation Plan: Vercel Deployment Configuration

## Overview

This implementation plan breaks down the migration from Cloudflare Workers to Vercel into discrete, actionable coding tasks. Each task builds on previous steps, ensuring incremental validation of core functionality. The plan covers configuration updates, dependency management, build verification, and comprehensive testing through property-based tests.

## Tasks

- [x] 1. Remove Cloudflare dependencies from package.json
  - Remove `@cloudflare/vite-plugin` from the dependencies section
  - Verify no other Cloudflare-specific packages remain
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 2. Delete wrangler.jsonc configuration file
  - Remove the wrangler.jsonc file from the project root
  - Verify the file no longer exists in the repository
  - _Requirements: 1.2, 1.4_

- [-] 3. Update vite.config.ts to remove Cloudflare references
  - Remove the comment about `@cloudflare/vite-plugin` from vite.config.ts
  - Ensure the configuration maintains TanStack Start settings with `server: { entry: "server" }`
  - Verify the file contains no references to Cloudflare or wrangler
  - _Requirements: 1.4, 2.1, 2.4, 8.1, 8.2, 8.3, 8.4_

  - [~] 3.1 Write property test for vite.config.ts validity
    - **Property 3: Build Succeeds Without Cloudflare Plugin**
    - **Validates: Requirements 2.1, 2.4, 8.2, 8.4**

- [-] 4. Update vercel.json with complete Vercel configuration
  - Verify `buildCommand` is set to `npm run build`
  - Verify `outputDirectory` is set to `dist`
  - Verify `framework` is set to `vite`
  - Add `SUPABASE_SERVICE_ROLE_KEY` to the `env` section with value `@supabase_service_role_key`
  - Ensure all environment variable mappings use proper Vercel secret references (@ prefix)
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 4.1, 4.2, 4.3_

  - [~] 4.1 Write property test for vercel.json configuration
    - **Property 7: vercel.json Configuration Valid**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4_

- [x] 5. Run npm install to update dependencies
  - Execute `npm install` to update package-lock.json
  - Verify that `@cloudflare/vite-plugin` is removed from node_modules
  - Verify all other dependencies are installed correctly
  - _Requirements: 1.1, 1.3_

- [-] 6. Test the build locally
  - Execute `npm run build` to compile the application
  - Verify the build completes without errors
  - Check that no Cloudflare-related errors appear in the build output
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 6.1, 6.2, 6.3, 6.4_

  - [~] 6.1 Write property test for build success without Cloudflare
    - **Property 3: Build Succeeds Without Cloudflare Plugin**
    - **Validates: Requirements 2.1, 2.4, 8.2, 8.4**

- [-] 7. Verify build output structure
  - Confirm `dist/` directory exists after build
  - Verify `dist/server/` contains the server bundle
  - Verify `dist/client/` contains client assets (JavaScript, CSS)
  - Verify the server bundle exports a default object with a `fetch` method
  - Check that all static assets are present in the output
  - _Requirements: 2.1, 2.2, 2.3, 6.1, 6.2, 6.3, 6.4_

  - [~] 7.1 Write property test for build output artifacts
    - **Property 2: Build Output Contains Required Artifacts**
    - **Validates: Requirements 2.1, 2.2, 2.3, 6.1, 6.2**

  - [~] 7.2 Write property test for server entry point validity
    - **Property 4: Server Entry Point Exports Valid Handler**
    - **Validates: Requirements 5.1, 5.2, 5.3**

- [-] 8. Verify no Cloudflare references remain in configuration files
  - Search package.json for any "cloudflare" or "wrangler" strings
  - Search vite.config.ts for any "cloudflare" or "wrangler" strings
  - Search vercel.json for any "cloudflare" or "wrangler" strings
  - Confirm all searches return no results
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [~] 8.1 Write property test for no Cloudflare references
    - **Property 1: No Cloudflare References Remain**
    - **Validates: Requirements 1.1, 1.2, 1.3, 1.4**

- [-] 9. Verify environment variable configuration
  - Confirm `VITE_SUPABASE_URL` is defined in vercel.json env section
  - Confirm `VITE_SUPABASE_PUBLISHABLE_KEY` is defined in vercel.json env section
  - Confirm `SUPABASE_SERVICE_ROLE_KEY` is defined in vercel.json env section
  - Verify all environment variables use proper Vercel secret references
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [~] 9.1 Write property test for environment variable injection
    - **Property 5: Environment Variables Injected at Build Time**
    - **Validates: Requirements 4.1, 4.2, 4.4**

  - [~] 9.2 Write property test for runtime variable access
    - **Property 6: Server-Side Variables Available at Runtime**
    - **Validates: Requirements 4.3, 4.5**

- [-] 10. Verify server entry point compatibility
  - Confirm `src/server.ts` exports a default object with a `fetch` method
  - Verify the fetch method accepts `(request: Request, env: unknown, ctx: unknown)` parameters
  - Verify the fetch method returns a `Promise<Response>`
  - Check that error handling is in place for SSR failures
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [~] 10.1 Write property test for server request/response handling
    - **Property 8: Server Handles Requests and Returns Responses**
    - **Validates: Requirements 5.2, 5.4**

- [-] 11. Verify Supabase integration
  - Confirm Supabase client can be initialized with `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`
  - Verify the client is accessible from client-side code
  - Confirm server-side code can access `SUPABASE_SERVICE_ROLE_KEY` for privileged operations
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [~] 11.1 Write property test for Supabase client initialization
    - **Property 9: Supabase Client Initialization Succeeds**
    - **Validates: Requirements 9.1, 9.2, 9.4**

  - [~] 11.2 Write property test for service role key usage
    - **Property 10: Server-Side Supabase Operations Use Service Role Key**
    - **Validates: Requirements 9.3**

- [x] 12. Checkpoint - Ensure all configuration changes are complete
  - Verify all configuration files have been updated correctly
  - Confirm all dependencies have been updated
  - Ensure the build completes successfully
  - Ask the user if questions arise before proceeding to deployment verification

- [x] 13. Create deployment guide documentation
  - Document the step-by-step process for deploying to Vercel
  - Include instructions for setting up environment variables in Vercel dashboard
  - Document how to connect the Git repository to Vercel
  - Explain the build and deployment process flow
  - Include troubleshooting steps for common deployment issues
  - Reference vercel.json configuration and explain each setting
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 14. Final checkpoint - Verify all tests pass
  - Ensure all property-based tests pass successfully
  - Confirm all configuration validations pass
  - Verify the build output is correct
  - Ask the user if questions arise before considering the feature complete

## Notes

- Tasks marked with `*` are optional property-based tests and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties across multiple iterations
- Configuration changes are incremental and build on each other
- Checkpoints ensure validation at reasonable breaks in the workflow
- All tasks focus on code changes and automated verification only
