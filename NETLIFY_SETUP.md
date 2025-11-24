# Netlify Setup Instructions

This guide will help you deploy Camden's website to Netlify with admin panel access.

## Step 1: Create Netlify Account

1. Go to [netlify.com](https://www.netlify.com)
2. Click "Sign up" and create a free account
3. You can sign up with your GitHub account for easier integration

## Step 2: Connect Your GitHub Repository

1. Once logged in, click "Add new site" → "Import an existing project"
2. Choose "GitHub" as your Git provider
3. Authorize Netlify to access your GitHub account
4. Select the `Camden` repository
5. Configure build settings:
   - **Branch to deploy:** `website-updates` (or your main branch)
   - **Build command:** Leave empty
   - **Publish directory:** `.` (dot means root directory)
6. Click "Deploy site"

## Step 3: Enable Netlify Identity

1. After deployment, go to your site's dashboard
2. Click on "Site settings" in the top menu
3. Navigate to "Identity" in the left sidebar
4. Click "Enable Identity"

## Step 4: Configure Identity Settings

1. In the Identity settings, go to "Registration preferences"
2. Set registration to **"Invite only"**
3. Under "External providers", you can optionally enable Google/GitHub login
4. Under "Services" → "Git Gateway", click "Enable Git Gateway"
5. This allows the admin panel to update files directly in GitHub

## Step 5: Invite Camden as a User

1. In the Identity section, click "Invite users"
2. Enter Camden's email address
3. He'll receive an email to set up his password
4. Save the admin panel URL: `https://your-site-name.netlify.app/admin.html`

## Step 6: Set Up Custom Domain (Optional)

1. Go to "Domain settings" in your site dashboard
2. Click "Add custom domain"
3. Enter `camdenarchambeau.com` (or your domain)
4. Follow the instructions to configure DNS settings
5. Netlify will automatically provision an SSL certificate

## Step 7: Test the Admin Panel

1. Go to `https://your-site-name.netlify.app/admin.html`
2. Click the login button
3. Sign in with the credentials Camden set up
4. You should see the admin dashboard

## Using the Admin Panel

### Managing Carousel Videos

1. Click "Carousel Videos" in the sidebar
2. To add a video:
   - Paste the full YouTube URL
   - Enter a title
   - Click "Add Video"
3. To reorder videos, use the ↑ ↓ arrows
4. To remove a video, click the trash icon 🗑️
5. Click "Save Changes" when done

### Editing the About Section

1. Click "About Section" in the sidebar
2. Edit the biography text
3. Use blank lines to separate paragraphs
4. Click "Save Changes"

### Managing Performances

1. Click "Performances" in the sidebar
2. Add new performances with venue, date, and description
3. Remove old performances after they've passed
4. Click "Save Changes"

## Important Notes

- **Current Version:** The admin panel downloads HTML updates that need to be manually applied. This is temporary.
- **Future Enhancement:** We can integrate GitHub API to make updates fully automatic
- **Security:** Only invited users can access the admin panel
- **Backups:** All changes are stored in GitHub, so you have full version history

## Troubleshooting

### Can't Login
- Make sure Camden completed the email invitation
- Check that Identity is enabled in Netlify settings
- Try clearing browser cache and cookies

### Changes Not Appearing
- Netlify auto-deploys when you push to GitHub
- Check the "Deploys" tab to see deployment status
- Changes typically take 1-2 minutes to go live

### Need Help?
- Check [Netlify's documentation](https://docs.netlify.com)
- Contact support through the Netlify dashboard

## Cost

Everything described here is **100% FREE** on Netlify's free tier:
- Unlimited sites
- 100GB bandwidth/month
- Continuous deployment
- Netlify Identity (up to 1000 users)
- Custom domains
- SSL certificates

Camden's site will likely use less than 1GB bandwidth per month, so you'll never hit limits.
