Verifying and troubleshooting Vercel deploy (frontend)

Steps I applied:
- Added `vercel.json` to build `frontend` using `@vercel/static-build` and a SPA rewrite to `index.html`.

Checklist to ensure deploy succeeds:
1. Repository setup
   - Root `vercel.json` exists (it points to `frontend/package.json`).
   - `frontend/package.json` contains `build` script (`vite build`).
2. Vercel project settings
   - Root Directory: leave blank (or set to `frontend` if you want Vercel to only observe that folder).
   - Build Command: `npm run build` (Vercel will use `frontend/package.json` because of vercel.json `src`).
   - Output Directory: `dist`.
3. Local check (optional)
   - Run locally: `cd frontend && npm ci && npm run build` and confirm `dist/index.html` exists.
4. SPA routing
   - `vercel.json` contains a `rewrites` rule so client routes like `/login` return `index.html`.
5. Static assets
   - Ensure `frontend/public/images/logo.png` exists; Vite copies `public` to `dist` during build.

If you still see 404 for `/login` or 401 for assets:
- Ensure the Deploy is the latest commit where `vercel.json` was added.
- Check Vercel Build Logs for `vite build` success and confirm artifacts in the `dist` folder.
- In Vercel Dashboard, confirm `Root Directory` matches project structure (blank or `frontend`).

If you want, I can:
- Run the frontend build inside a Node-enabled environment and inspect `dist` locally.
- Add a simple smoke test (GitHub action or script) to verify that `dist/index.html` exists after build.
