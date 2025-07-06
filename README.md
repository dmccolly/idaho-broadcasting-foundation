# idaho-broadcasting-foundation

This project uses Supabase for storage and authentication. The Supabase client
expects the following environment variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

On Netlify, configure these variables in your site settings so they are
available during builds and in serverless functions. Locally you can create a
`.env` file with the same variables for development, but `.env*` files are
ignored from version control.

## Building and Deploying

The project is built with Vite. Netlify will run `pnpm run build` and deploy
the contents of the `dist` folder. Locally you can run the same command after
installing dependencies with `pnpm install`.

The Netlify build uses Node 20 and pnpm 10.12.4 as specified in `netlify.toml`.

