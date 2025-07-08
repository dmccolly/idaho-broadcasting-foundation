# idaho-broadcasting-foundation

This project uses Supabase for storage and authentication. The Supabase client
expects the following environment variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

On Netlify, configure these variables in your site settings so they are
available during builds and in serverless functions. Locally you can create a
`.env` file with the same variables for development, but `.env*` files are
ignored from version control.

## Duplicate repository for testing

To create a separate working copy of this project without affecting the main site, use the provided script:

```bash
./scripts/duplicate_repo.sh ../idaho-broadcasting-foundation-copy
```

Replace the path with your desired destination directory. The script copies all files except the `.git` folder, initializes a new Git repository in that location, and outputs the path to the duplicate.

## Design Style Guide

See [STYLE_GUIDE.md](./STYLE_GUIDE.md) for details on implementing the Idaho Broadcasting Foundation design system using Tailwind CSS and CSS variables.

