# Repository Replacement Guide - Idaho Broadcasting Foundation

## 🚀 Quick Start

This package contains the complete integrated Idaho Broadcasting Foundation codebase ready to replace your existing repository.

## 📋 Prerequisites

- Node.js 18+ installed
- Git installed
- Access to your GitHub repository
- Netlify/Vercel account (for deployment)

## 🔄 Step-by-Step Repository Replacement

### Step 1: Backup Your Current Repository

```bash
# Create a backup branch in your current repository
git checkout -b backup-original-site
git push origin backup-original-site
```

### Step 2: Clear Your Repository (Keep Git History)

```bash
# In your existing repository directory
git checkout main
git rm -rf .
git clean -fxd
```

### Step 3: Copy New Codebase

```bash
# Copy all files from this package to your repository directory
# (Replace /path/to/this/package with actual path)
cp -r /path/to/this/package/* /path/to/your/repository/
cp -r /path/to/this/package/.* /path/to/your/repository/ 2>/dev/null || true
```

### Step 4: Install Dependencies

```bash
# In your repository directory
npm install
```

### Step 5: Configure Environment Variables

```bash
# Copy the environment template
cp .env.example .env.local

# Edit .env.local with your actual values:
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 6: Test Locally

```bash
# Start development server
npm run dev

# Open http://localhost:3000 to verify everything works
```

### Step 7: Commit and Push

```bash
# Add all new files
git add .

# Commit the new codebase
git commit -m "feat: integrate modern Tailwind template with broadcasting tools

- Add VoxPro Media Player with 5-key interface
- Integrate Current Key Assignments display
- Implement Events page with calendar functionality
- Add The Back Corner content area
- Update branding to Idaho Broadcasting Foundation
- Add Supabase integration with mock data fallback
- Implement responsive design with Tailwind CSS 4.0
- Add TypeScript support and modern Next.js 15 architecture"

# Push to your repository
git push origin main
```

## 🌐 Deployment Options

### Option A: Netlify (Recommended for Static Sites)

1. Connect your repository to Netlify
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `out`
3. Environment variables: Add your Supabase credentials
4. Deploy!

### Option B: Vercel (Recommended for Next.js)

1. Connect your repository to Vercel
2. Vercel will auto-detect Next.js settings
3. Add environment variables in Vercel dashboard
4. Deploy!

### Option C: Manual Static Deployment

```bash
# Build static files
npm run build

# Upload the 'out' directory to your hosting provider
```

## 🔧 Configuration Files Included

- `package.json` - Dependencies and scripts
- `next.config.js` - Next.js configuration with static export
- `tsconfig.json` - TypeScript configuration
- `postcss.config.js` - PostCSS configuration
- `.gitignore` - Git ignore rules
- `.env.example` - Environment variables template

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── (default)/         # Default layout group
│   │   ├── page.tsx       # Home page
│   │   ├── events/        # Events page
│   │   └── back-corner/   # The Back Corner page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── broadcasting/      # Broadcasting-specific components
│   ├── events/           # Event components
│   └── ui/               # UI components
├── lib/                  # Utilities and configurations
│   └── supabase.ts       # Supabase client and types
├── public/               # Static assets
└── content/              # MDX content files
```

## 🎛️ Broadcasting Features

### VoxPro Media Player
- 5-key interface with color coding
- Media file selection and playback
- Professional broadcasting controls
- Demo mode with mock data

### Current Key Assignments
- Detailed media file information
- File type indicators
- Author and date metadata
- Download and external link actions

### Events System
- Professional event listings
- Calendar integration buttons
- Map location links
- Responsive event cards

## 🔗 Important URLs

- **Live Demo:** https://udxcbpjp.manus.space
- **Original Site:** https://6871932b433c6d8b57e1ef05--ornate-syrniki-0df84f.netlify.app/

## 🆘 Troubleshooting

### Build Errors
- Ensure Node.js 18+ is installed
- Delete `node_modules` and run `npm install` again
- Check that all environment variables are set

### Supabase Connection Issues
- The site works with mock data if Supabase is unavailable
- Update `.env.local` with your actual Supabase credentials
- Verify Supabase project is active and accessible

### Deployment Issues
- For static deployment, ensure `npm run build` completes successfully
- Check that the `out` directory is created after build
- Verify hosting provider supports Next.js static export

## 📞 Support

If you encounter any issues during the replacement process, the integrated codebase includes:
- Comprehensive error handling
- Fallback systems for external dependencies
- Detailed component documentation
- TypeScript for better development experience

The new codebase maintains all your original functionality while providing a modern, professional foundation for future development.

