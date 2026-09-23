<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Conseilux Training - Project Information

## Database Configuration
- This project uses Supabase as the database backend
- Environment variables needed in `.env.local`:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `ADMIN_EMAIL`
  - `ADMIN_PASSWORD`

## Database Tables
- `formations` - Training courses
- `dates` - Training dates
- `avis` - Customer reviews
- `leads` - Client leads/registrations
- `messages` - Contact messages

## Storage
- Bucket name: `formations-images` for storing training images
- Public access configured for reading images

## Admin Panel
- Access at `/admin/dashboard`
- Authentication required via `/api/auth/login`
- Dashboard shows statistics for all entities

## Key Features
- Admin can add formations with image upload (URL or direct upload)
- Formations are stored in Supabase and displayed on public site
- Images can be uploaded to Supabase Storage or provided as URLs
- Soft delete implemented (deleted_at field)

## Setup Instructions
See `.devin/SUPABASE_SETUP.md` for detailed Supabase configuration
Environment template available in `.devin/env-template.txt`
