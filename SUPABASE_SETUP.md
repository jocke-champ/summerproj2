# Gräsön - Setup Guide

This guide will help you deploy the Gräsön family hub application using Supabase and Vercel.

## Prerequisites

- A Supabase account (https://supabase.com)
- A Vercel account (https://vercel.com)
- Git repository access

## Step 1: Set Up Supabase

1. **Create a new Supabase project:**
   - Go to https://supabase.com/dashboard
   - Click "New Project"
   - Choose your organization
   - Enter project details:
     - Name: `grasos-hub` (or your preferred name)
     - Database Password: Generate a strong password
     - Region: Choose closest to your users
   - Click "Create new project"

2. **Wait for project setup:**
   - The project will take a few minutes to initialize
   - Once ready, you'll see the project dashboard

3. **Create the database schema:**
   - Go to the SQL Editor in your Supabase dashboard
   - Copy the entire contents of `supabase-schema.sql`
   - Paste it into a new query
   - Click "Run" to execute the SQL

4. **Get your project credentials:**
   - Go to Project Settings → API
   - Note down these values:
     - `Project URL`
     - `anon public` key
     - `service_role` key (keep this secret!)

## Step 2: Deploy to Vercel

1. **Connect your repository:**
   - Go to https://vercel.com/dashboard
   - Click "New Project"
   - Import your Git repository

2. **Configure environment variables:**
   - In the deployment settings, add these environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```
   - Replace the values with those from Step 1.4

3. **Deploy:**
   - Click "Deploy"
   - Wait for the deployment to complete

## Step 3: Configure Supabase (Optional Security)

If you want to add authentication later, you can configure:

1. **Authentication providers** in Supabase Dashboard → Authentication → Providers
2. **Email templates** in Authentication → Email Templates
3. **Row Level Security policies** (currently set to allow all operations)

## Step 4: Test Your Application

1. Visit your deployed Vercel URL
2. Select a family member from the user selector
3. Create a test project and shopping list
4. Verify data persists by refreshing the page

## Features

### Project Management
- Create, edit, and delete projects
- Checklist with progress tracking
- Comments system
- Real-time progress calculation

### Shopping Lists
- Swedish shopping categories
- Quick-add buttons for common items
- Category-organized display
- Progress tracking

### User Management
- Simple family member selection
- No complex authentication required
- User context preserved in localStorage

## Troubleshooting

### Common Issues

1. **Environment variables not working:**
   - Ensure variable names are exact: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Check for extra spaces or characters
   - Redeploy after adding variables

2. **Database connection errors:**
   - Verify your Supabase project URL is correct
   - Check that the API key has the right permissions
   - Ensure the database schema was created successfully

3. **Data not persisting:**
   - Check browser console for errors
   - Verify Supabase RLS policies allow operations
   - Test database connection in Supabase dashboard

### Fallback Mode

The application includes localStorage fallback:
- If Supabase is unavailable, data is stored locally
- Data persists across browser sessions
- No functionality is lost in offline mode

## Development

To run locally:

```bash
# Clone and install dependencies
npm install

# Create .env.local file with your Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Run development server
npm run dev
```

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Test the Supabase connection in the dashboard
4. Ensure the database schema was created properly

The application is designed to work reliably with Supabase but gracefully degrades to localStorage if needed. 