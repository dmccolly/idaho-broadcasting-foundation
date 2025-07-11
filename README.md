# idaho-broadcasting-foundation

This project uses Supabase for storage and authentication. The Supabase client
expects the following environment variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

On Netlify, configure these variables in your site settings so they are
available during builds and in serverless functions. Locally you can create a
`.env` file with the same variables for development, but `.env*` files are
ignored from version control.

## Content Management

Netlify CMS is bundled in the `public/admin` directory. Visit `/admin/` on your
deployed site to log in and manage content. All other duplicate admin folders
have been removed.
